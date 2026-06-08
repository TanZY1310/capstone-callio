# POST /login, Post /register, Post /refresh
from fastapi import APIRouter, HTTPException, Cookie, Depends, Response
from database import db_dependency
from models.user import Users

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.get("/")
async def test_get_user(db: db_dependency):
    return db.query(Users).all()


