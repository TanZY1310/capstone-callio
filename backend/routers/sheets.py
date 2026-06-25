from fastapi import APIRouter, status, Depends
from database import db_dependency
from schemas.customer import SyncResult
from services.sheets import sync_customers_from_sheets, fetch_status, export_customers_to_sheets
from typing import Annotated
from routers.auth import verify_firebase_token
from services.auth_helper import resolve_user_id

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