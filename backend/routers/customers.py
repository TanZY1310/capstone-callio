from fastapi import APIRouter, Depends, status
from database import db_dependency
from models.customer import Customers
from schemas.customer import SyncResult
from services.sheets import sync_customers_from_sheets

#GET/POST/PUT/DELETE /customers
router = APIRouter(
    prefix="/customers",
    tags=["customers"]
)

@router.get("/")
async def get_customer(db: db_dependency):
    return db.query(Customers).all()

@router.post("/sync", response_model=SyncResult, status_code=status.HTTP_200_OK, 
             summary="Sync customers from Google Sheets", description="Fetches rows from the configured Google Sheet and insert into customer table")
async def sync_customers(db: db_dependency) -> SyncResult:
    return await sync_customers_from_sheets(db)