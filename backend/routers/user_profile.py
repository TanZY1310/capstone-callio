from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select

from database import db_dependency
from models.user import Users
from routers.auth import verify_firebase_token
from schemas.user import UserProfileUpdate, UserResponse

router = APIRouter(
    prefix='/user_profile',
    tags=['user_profile']
)

FirebaseToken = Annotated[dict, Depends(verify_firebase_token)]

async def get_current_user(
    token: FirebaseToken,
    db: db_dependency,
) -> Users:
    """
    Resolves the Firebase token to a DB user.
    Reused across all routes in this router.
    """
    uid = token["uid"]

    result = db.execute(select(Users).where(Users.firebase_uid == uid))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found.",
        )

    return user

CurrentUser = Annotated[Users, Depends(get_current_user)]

# ── Routes ────────────────────────────────────────────────────────────────────

@router.get(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Get current user profile",
)
async def get_user_profile(current_user: CurrentUser) -> Users:
    return current_user


@router.put(
    "/",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    summary="Update current user profile",
    description="Updates editable profile fields. Email and password are managed by Firebase — not accepted here.",
)
async def update_profile(
    payload: UserProfileUpdate,
    db: db_dependency,
    current_user: CurrentUser,
) -> Users:
    update_data = payload.model_dump(exclude_unset=True)

    for key, value in update_data.items():
        setattr(current_user, key, value)

    db.add(current_user)
    db.commit()
    db.refresh(current_user)

    return current_user