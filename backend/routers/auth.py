# POST /login, Post /register, Post /refresh
from fastapi import APIRouter, HTTPException, Cookie, Depends, Response
from database import db_dependency
from models.user import Users
from schemas.user import UserCreate

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

@router.get("/")
async def get_user(db: db_dependency):
    return db.query(Users).all()

@router.get("/login/{email}")
async def login_user(db: db_dependency, email: str):
    user_result = db.query(Users).filter(Users.email == email).first()

    if user_result is not None:
        return user_result
    
    raise HTTPException(status_code=400, detail="User not found")

@router.post("/register")
async def register_user(payload: UserCreate, db: db_dependency):
    new_user = Users(
        first_name=payload.first_name,
        last_name=payload.last_name, 
        role=payload.role,
        email=payload.email,
        password=payload.password,
        registered_year=payload.registered_year,
        license_number=payload.license_number,
        agency_branch=payload.agency_branch
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
