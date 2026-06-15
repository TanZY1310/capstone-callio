from fastapi import APIRouter, status
from database import db_dependency
from schemas.customer import SyncResult
from services.sheets import sync_customers_from_sheets, fetch_status
import uuid

router = APIRouter(
    prefix="/sheets",
    tags=["sheets"]
)

# Temporary: user_id as a query param until JWT auth is implemented
@router.post("/sync", response_model=SyncResult, status_code=status.HTTP_200_OK)
async def sync_customers(
    db: db_dependency,
    user_id: uuid.UUID, # will be replaced by auth token later
) -> SyncResult:
    return await sync_customers_from_sheets(db, user_id)

@router.get("/status", status_code=status.HTTP_200_OK)
async def get_sheets_status():
    try:
        fetch_status()
        return { "connected": True }
    except Exception as e:
        return { "connected": False, "error": str(e) }