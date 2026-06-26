from fastapi import APIRouter, status, Depends
from pydantic import BaseModel, Field
from database import db_dependency
from schemas.customer import SyncResult
from services.sheets import sync_customers_from_sheets, fetch_status, export_customers_to_sheets, get_sheets_id, update_sheets_id
from typing import Annotated
from routers.auth import verify_firebase_token
from services.auth_helper import resolve_user_id


class SheetsIdUpdate(BaseModel):
    sheets_id: str | None = Field(None, max_length=255)

router = APIRouter(
    prefix="/sheets",
    tags=["sheets"]
)

@router.post("/sync", response_model=SyncResult, status_code=status.HTTP_200_OK)
async def sync_customers(
    db: db_dependency,
    current_user: Annotated[dict, Depends(verify_firebase_token)]
) -> SyncResult:
    user_id = await resolve_user_id(db, current_user["uid"])
    return await sync_customers_from_sheets(db, user_id)

@router.get("/status", status_code=status.HTTP_200_OK)
async def get_sheets_status():
    try:
        fetch_status()
        return { "connected": True }
    except Exception as e:
        return { "connected": False, "error": str(e) }
    
@router.post("/export", status_code=status.HTTP_200_OK)
async def export_customers(db: db_dependency, current_user: Annotated[dict, Depends(verify_firebase_token)]) -> dict:
    user_id = await resolve_user_id(db, current_user["uid"])
    return await export_customers_to_sheets(db, user_id)

@router.get("/sheet-id", status_code=status.HTTP_200_OK)
async def get_sheet_id(
    db: db_dependency,
    current_user: Annotated[dict, Depends(verify_firebase_token)],
) -> dict:
    user_id = await resolve_user_id(db, current_user["uid"])
    sheets_id = await get_sheets_id(db, user_id)
    return {"sheets_id": sheets_id}

@router.put("/sheet-id", status_code=status.HTTP_200_OK)
async def set_sheet_id(
    payload: SheetsIdUpdate,
    db: db_dependency,
    current_user: Annotated[dict, Depends(verify_firebase_token)],
) -> dict:
    user_id = await resolve_user_id(db, current_user["uid"])
    sheets_id = await update_sheets_id(db, user_id, payload.sheets_id)
    return {"sheets_id": sheets_id}