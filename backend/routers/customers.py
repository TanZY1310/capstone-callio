import uuid
from typing import Optional
from fastapi import APIRouter, HTTPException, Cookie, Depends, Response
from sqlalchemy.orm import Session
from database import get_db, db_dependency
from typing import Annotated
from models.customer import Customers

#GET/POST/PUT/DELETE /customers
router = APIRouter(
    prefix="/customers",
    tags=["customers"]
)

@router.get("/")
async def get_customer(db: db_dependency):
    return db.query(Customers).all()
