from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from fastapi.concurrency import run_in_threadpool
from sqlalchemy.dialects.postgresql import insert
from database import db_dependency 

from models.customer import Customers
from schemas.customer import CustomerSheetRow, SyncResult
import uuid

SCOPES = ["https://www.googleapis.com/auth/spreadsheets.readonly"]
SERVICE_ACCOUNT_FILE = "sheets_credentials.json"   # path to your downloaded JSON key
SPREADSHEET_ID = "1eN1XOgQ7VbaXCCX2iUq0DJrglThdzGkdqjBb6L_z8E8"
SHEET_RANGE = "Sheet1!A2:G"                 # skip header row, 7 columns, Sheet1 follow name of sheet below

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
    headers = ["cust_name", "phone", "budget", "location", "status", "last_contact", "user_id"]

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

async def fetch_status():
    creds = service_account.Credentials.from_service_account_file(
        SERVICE_ACCOUNT_FILE, scopes=SCOPES
    )
    service = build("sheets", "v4", credentials=creds)
    service.spreadsheets().get(spreadsheetid=SPREADSHEET_ID).execute()
