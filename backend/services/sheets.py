import os
import uuid
from typing import Annotated
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from fastapi import Depends
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.dialects.postgresql import insert
from sqlalchemy import select

from database import db_dependency
from models.customer import Customers
from schemas.customer import CustomerSheetRow, SyncResult
from routers.auth import verify_firebase_token

SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
SERVICE_ACCOUNT_FILE = "sheets_credentials.json"   # path to your JSON key
SPREADSHEET_ID = "1eN1XOgQ7VbaXCCX2iUq0DJrglThdzGkdqjBb6L_z8E8"
SHEET_RANGE = "Sheet1!A2:G"                 # skip header row, 7 columns, Sheet1 follow name of sheet below
SHEET_HEADER_RANGE = "Sheet1!A1:H"          # header + data range for export

# Uncomment the credentials path when using CICD variable as deployment
# credentials_path = os.environ.get("GOOGLE_APPLICATION_CREDENTIALS_JSON")
# print(f"Credentials path: {credentials_path}")

# if not credentials_path:
#     raise ValueError("GOOGLE_APPLICATION_CREDENTIALS_JSON environment variable is not set")

# Column order expected in the sheet:
# Cust_Name | Phone | Budget | Location | Status | Last_Contact | UserID

def _fetch_sheet_rows() -> list[dict]:
    """Sync Google Sheets call — runs in threadpool."""
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build("sheets", "v4", credentials=creds)
    result = (
        service.spreadsheets()
        .values()
        .get(spreadsheetId=SPREADSHEET_ID, range=SHEET_RANGE)
        .execute()
    )
    rows = result.get("values", [])
    headers = ["cust_name", "phone", "budget", "location", "status", "last_contact"]

    parsed = []
    for row in rows:
        # Pad short rows with None for missing optional columns
        padded = row + [None] * (len(headers) - len(row))
        parsed.append(dict(zip(headers, padded)))
    return parsed


async def sync_customers_from_sheets(db: db_dependency, user_id: uuid.UUID) -> SyncResult:
    # Google SDK is sync — offload to threadpool
    raw_rows = await run_in_threadpool(_fetch_sheet_rows)

    synced = 0
    skipped = 0

    for row in raw_rows:
        try:
            validated = CustomerSheetRow(**row)
        except Exception as e:
            print(f"Skipped row {row} — reason: {e}")
            skipped += 1
            continue

        stmt = (
            insert(Customers)
            .values(
                cust_id=uuid.uuid4(),
                cust_name=validated.cust_name,
                phone=validated.phone,
                budget=validated.budget,
                location=validated.location,
                status=validated.status or "Not Yet Call", #If no status default is "Not Yet Call"
                last_contact=validated.last_contact,
                user_id=user_id,
            )
            .on_conflict_do_update(
                index_elements=["phone"],
                set_={
                    "cust_name": validated.cust_name,
                    "budget": validated.budget,
                    "location": validated.location,
                    "status": validated.status or "Not Yet Call",
                    "last_contact": validated.last_contact,
                },
            )
        )

        db.execute(stmt)
        synced += 1

    db.commit()
    return SyncResult(synced=synced, skipped=skipped, total=len(raw_rows))

def _write_rows_to_sheet(rows: list[list]) -> dict:
    """Sync Google Sheets write call — runs in threadpool."""
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build("sheets", "v4", credentials=creds)

    # Clear existing data (preserve header row by clearing from A2)
    service.spreadsheets().values().clear(
        spreadsheetId=SPREADSHEET_ID,
        range="Sheet1!A2:H",
    ).execute()

    if not rows:
        return {"updatedRows": 0}

    body = {"values": rows}
    result = (
        service.spreadsheets()
        .values()
        .update(
            spreadsheetId=SPREADSHEET_ID,
            range="Sheet1!A2",
            valueInputOption="USER_ENTERED",
            body=body,
        )
        .execute()
    )
    return result


async def export_customers_to_sheets(db: db_dependency, user_id: uuid.UUID) -> dict:
    stmt = select(Customers).where(Customers.user_id == user_id)
    customers = db.execute(stmt).scalars().all()

    rows = []
    for c in customers:
        rows.append([
            c.cust_name,
            c.phone,
            c.budget if c.budget is not None else "",
            c.location or "",
            c.status,
            c.last_contact.isoformat() if c.last_contact else "",
            str(c.user_id),
            str(c.cust_id),
        ])

    result = await run_in_threadpool(_write_rows_to_sheet, rows)
    return {"exported": len(rows), "updatedCells": result.get("updatedCells", 0)}


async def fetch_status():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build("sheets", "v4", credentials=creds)
    service.spreadsheets().get(spreadsheetId=SPREADSHEET_ID).execute()
