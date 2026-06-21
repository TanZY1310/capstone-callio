from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends, Header
from fastapi.concurrency import run_in_threadpool
from firebase_admin import auth as firebase_auth
from sqlalchemy import select

from core.firebase_admin import init_firebase
from database import db_dependency
from models.user import Users
from schemas.user import UserCreate, UserResponse

# Initialize firebase from firebase_admin.py
init_firebase()

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)

async def verify_firebase_token(authorization: Annotated[str, Header()]) -> dict:
    """
    Dependency — extracts and verifies the Firebase ID token from the
    Authorization header. Returns the decoded token payload.

    Header format: Authorization: Bearer <firebase_id_token>
    """
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <token>",
        )

    token = authorization.removeprefix("Bearer ")

    try:
        # verify_id_token is blocking (JWKS fetch on first call) — run in threadpool
        decoded = await run_in_threadpool(firebase_auth.verify_id_token, token)
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please sign in again.",
        )
    except firebase_auth.InvalidIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token.",
        )
    except Exception as e:
        print(f"Firebase token verification error: {type(e).__name__}: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {type(e).__name__}: {str(e)}",
        )
    return decoded

FirebaseToken = Annotated[dict, Depends(verify_firebase_token)]

@router.post(
    "/session",
    response_model=UserResponse,
    summary="Restore session",
    description="Called on app load. Verifies the Firebase ID token and returns the matching DB user profile.",
)
async def get_session(token: FirebaseToken, db: db_dependency,) -> Users:
    """
    Called by useAuth.js on every app load via onAuthStateChanged.
    Looks up the DB user by firebase_uid and returns their profile.
    """
    uid = token["uid"]
    print("UID in get session", uid)

    result = db.execute(select(Users).where(Users.firebase_uid == uid))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found. Please complete registration.",
        )

    return user

@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register user profile",
    description="Creates the DB user profile after Firebase account creation. Called once from RegisterForm.",
)
async def register_user(payload: UserCreate, token: FirebaseToken, db: db_dependency,) -> Users:
    """
    Called by RegisterForm.jsx after createUserWithEmailAndPassword succeeds.
    Firebase owns the credential — this endpoint only creates the DB profile row.
    """
    uid = token["uid"]
    email = token.get("email")

    # Guard against duplicate registration (e.g. user hits submit twice)
    result = db.execute(select(Users).where(Users.firebase_uid == uid))
    if result.scalar_one_or_none():
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User profile already exists.",
        )

    new_user = Users(
        firebase_uid=uid,
        email=email,
        first_name=payload.first_name,
        last_name=payload.last_name,
        role=payload.role,
        registered_year=payload.registered_year,
        license_number=payload.license_number,
        agency_branch=payload.agency_branch,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user
