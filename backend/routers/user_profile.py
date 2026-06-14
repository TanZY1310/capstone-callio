from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, Field, EmailStr
from database import db_dependency
from models.user import Users, UserRole
from auth import pwd_context
from schemas.user import UserVerification, UserProfileUpdate

router = APIRouter(
    prefix="/user-profile",
    tags=["user-profile"]
)


# temporary
async def get_current_user(db: db_dependency) -> Users:
    # Hardcoded fallback placeholder to ensure the code compiles out-of-the-box
    user = db.query(Users).first() 
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, 
            detail="Authentication Failed"
        )
    return user



@router.get("/", status_code=status.HTTP_200_OK)
async def get_user_profile(
    db: db_dependency, 
    current_user: Users = Depends(get_current_user)
):
   
    return current_user


@router.put("/", status_code=status.HTTP_200_OK)
async def update_profile(
    payload: UserProfileUpdate, 
    db: db_dependency, 
    current_user: Users = Depends(get_current_user)
):
    
    # Dynamically update fields if they are explicitly passed in the request body
    update_data = payload.model_dump(exclude_unset=True)
    
    for key, value in update_data.items():
        setattr(current_user, key, value)
        
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    return current_user


@router.put("/password", status_code=status.HTTP_204_NO_CONTENT)
async def change_password(
    payload: UserVerification, 
    db: db_dependency, 
    current_user: Users = Depends(get_current_user)
):
    
    # Verify old password matches database record
    if not pwd_context.verify(payload.password, current_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect current password"
        )
        
    current_user.password = pwd_context.hash(payload.new_password)
    
    db.add(current_user)
    db.commit()
    
    return None