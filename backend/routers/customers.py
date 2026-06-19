from fastapi import APIRouter, status, HTTPException
from database import db_dependency
from models.customer import Customers
from schemas.customer import CustomerResponse
import uuid

#GET/POST/PUT/DELETE /customers
router = APIRouter(
    prefix="/customers",
    tags=["customers"]
)

@router.get("/", response_model=list[CustomerResponse], status_code=status.HTTP_200_OK)
async def get_customers(
    db: db_dependency,
    user_id: uuid.UUID,
) -> list[CustomerResponse]:
    # result = db.execute(
    #     select(Customers).where(Customers.user_id == user_id)
    # )
    # return result.scalars().all()

    customers = db.query(Customers).filter(Customers.user_id == user_id).all()

    if customers is not None:
        return customers
    
    raise HTTPException(status_code=400, detail="Customers not found")