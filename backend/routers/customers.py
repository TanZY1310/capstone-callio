from fastapi import APIRouter, status, HTTPException, Depends, Query
from database import db_dependency
from models.customer import Customers
from schemas.customer import CustomerResponse, BatchStatusUpdate, ChangesResponse, StatusUpdateRequest
import uuid
from typing import Annotated, Optional
from datetime import datetime
from sqlalchemy.sql import func
from routers.auth import verify_firebase_token
from services.auth_helper import resolve_user_id

#GET/POST/PUT/DELETE /customers
router = APIRouter(
    prefix="/customers",
    tags=["customers"]
)

@router.get("/all", response_model=list[CustomerResponse], status_code=status.HTTP_200_OK)
async def get_customers(
    db: db_dependency,
    current_user: Annotated[dict, Depends(verify_firebase_token)],
) -> list[CustomerResponse]:
    user_id = await resolve_user_id(db, current_user["uid"])
    customers = db.query(Customers).filter(Customers.user_id == user_id).all()

    if customers is not None:
        return customers
    
    raise HTTPException(status_code=400, detail="Customers not found")

@router.get("/changes", response_model=ChangesResponse, status_code=status.HTTP_200_OK)
async def get_changed_customers(
    db: db_dependency,
    current_user: Annotated[dict, Depends(verify_firebase_token)],
    since: Optional[datetime] = Query(None, description="Return records updated after this ISO timestamp"),
) -> ChangesResponse:
    user_id = await resolve_user_id(db, current_user["uid"])

    if since is None:
        return ChangesResponse(count=0, updated_ids=[])

    customers = (
        db.query(Customers.cust_id)
        .filter(
            Customers.user_id == user_id,
            Customers.updated_at > since,
        )
        .all()
    )
    ids = [row[0] for row in customers]
    return ChangesResponse(count=len(ids), updated_ids=ids)

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

# For updating status in Customer Listing page - now trigger based on each status changed
@router.patch("/{cust_id}", status_code=status.HTTP_200_OK)
async def update_customer_status(
    cust_id: uuid.UUID,
    payload: StatusUpdateRequest,
    db: db_dependency,
    current_user: Annotated[dict, Depends(verify_firebase_token)],
) -> dict:
    user_id = await resolve_user_id(db, current_user["uid"])
    customer = db.query(Customers).filter(
        Customers.cust_id == cust_id,
        Customers.user_id == user_id,
    ).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    customer.status = payload.status
    customer.last_contact = func.now()
    db.commit()
    return {"status": "updated"}