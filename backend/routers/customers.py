from fastapi import APIRouter, status, HTTPException, Depends
from database import db_dependency
from models.customer import Customers
from schemas.customer import CustomerResponse
import uuid
from typing import Annotated
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