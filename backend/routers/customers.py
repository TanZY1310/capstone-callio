from fastapi import APIRouter, status, HTTPException, Depends
from database import db_dependency
from models.customer import Customers
from schemas.customer import CustomerResponse, BatchStatusUpdate
import uuid
from typing import Annotated
from sqlalchemy.sql import func
from routers.auth import verify_firebase_token
from services.auth_helper import resolve_user_id

#GET/POST/PUT/DELETE /customers
router = APIRouter(
    prefix="/customers",
    tags=["customers"]
)

@router.get("/", response_model=list[CustomerResponse], status_code=status.HTTP_200_OK)
async def get_customers(
    db: db_dependency,
    current_user: Annotated[dict, Depends(verify_firebase_token)],
) -> list[CustomerResponse]:
    # result = db.execute(
    #     select(Customers).where(Customers.user_id == user_id)
    # )
    # return result.scalars().all()
    user_id = await resolve_user_id(db, current_user["uid"])
    customers = db.query(Customers).filter(Customers.user_id == user_id).all()

    if customers is not None:
        return customers
    
    raise HTTPException(status_code=400, detail="Customers not found")

# For updating status in customer listings page
@router.patch("/batch-status", status_code=status.HTTP_200_OK)
async def batch_update_status(
    payload: BatchStatusUpdate,
    db: db_dependency,
    current_user: Annotated[dict, Depends(verify_firebase_token)],
) -> dict:
    user_id = await resolve_user_id(db, current_user["uid"])
    updated = 0
    for item in payload.updates:
        customer = db.query(Customers).filter(
            Customers.cust_id == item.cust_id,
            Customers.user_id == user_id,
        ).first()
        if customer:
            customer.status = item.status
            customer.last_contact = func.now()
            updated += 1
    db.commit()
    return {"updated": updated}