# POST /login, Post /register, Post /refresh
from fastapi import APIRouter, HTTPException, Cookie, Depends, Response, status
from database import db_dependency
from models.user import Users
from schemas.user import UserCreate
from passlib.context import CryptContext

router = APIRouter(
    tags=["auth"]
)

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

@router.get("/")
async def get_user(db: db_dependency):
    return db.query(Users).all()

@router.post("/login")
async def login_user(db: db_dependency, email: str, password: str):
    user_result = db.query(Users).filter(Users.email == email).first()
        
    if not user_result:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    
    # Verify hashed password
    if not pwd_context.verify(password, user_result.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )
    
    return user_result
    
@router.post("/register")
async def register_user(payload: UserCreate, db: db_dependency):
    # Check for unique email
    existing_email = db.query(Users).filter(Users.email == payload.email).first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, 
            detail="Email already registered",
        )
    
    # Hash password before storing
    hashed_password = pwd_context.hash(payload.password)
    
    new_user = Users(
        first_name=payload.first_name,
        last_name=payload.last_name, 
        role=payload.role,
        email=payload.email,
        password=hashed_password,
        registered_year=payload.registered_year,
        license_number=payload.license_number,
        agency_branch=payload.agency_branch
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user
