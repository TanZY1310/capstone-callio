import traceback
import uuid
from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends, Header
from fastapi.concurrency import run_in_threadpool
from firebase_admin import auth as firebase_auth
from sqlalchemy import select

from core.firebase_admin import init_firebase
from core.demo import (
    DEMO_AGENT,
    DEMO_TEAM_LEAD,
    SUB_AGENTS,
    generate_demo_token,
    get_session_uid,
    register_session,
)
from database import db_dependency
from models.user import Users
from schemas.user import UserCreate, UserResponse
from seed_data import seed_demo_data

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

    Also accepts DEMO_ prefixed tokens for presentation demo mode.
    """
    print("[AUTH] verify_firebase_token called")
    print(f"[AUTH] Authorization header starts with Bearer: {authorization.startswith('Bearer ') if authorization else 'NO HEADER'}")

    if not authorization.startswith("Bearer "):
        print("[AUTH] ERROR: Invalid auth header format")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <token>",
        )

    token = authorization.removeprefix("Bearer ")
    print(f"[AUTH] Token length: {len(token)} chars")

    # Demo mode bypass — accept DEMO_ prefixed tokens
    demo_uid = get_session_uid(token)
    if token.startswith("DEMO_"):
        if demo_uid:
            print(f"[AUTH] Demo token accepted. UID: {demo_uid}")
            return {"uid": demo_uid, "demo": True, "email": "demo@callio.demo"}
        print("[AUTH] ERROR: Demo token expired or invalid")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Demo session expired. Please log in again.",
        )

    try:
        # verify_id_token is blocking (JWKS fetch on first call) — run in threadpool
        decoded = await run_in_threadpool(firebase_auth.verify_id_token, token)
        print(f"[AUTH] Token verified successfully. UID: {decoded.get('uid')}, Project: {decoded.get('aud')}")
    except firebase_auth.ExpiredIdTokenError:
        print("[AUTH] ERROR: Token expired")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please sign in again.",
        )
    except firebase_auth.InvalidIdTokenError as e:
        print(f"[AUTH] ERROR: Invalid token - {e}")
        print(traceback.format_exc())
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token.",
        )
    except Exception as e:
        print(f"[AUTH] ERROR: Unexpected Firebase token verification error: {type(e).__name__}: {e}")
        print(f"[AUTH] Full traceback:\n{traceback.format_exc()}")
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
        team_lead_id=payload.team_lead_id,
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


@router.post(
    "/demo-login",
    status_code=status.HTTP_200_OK,
    summary="Demo login (presentation mode)",
    description="Creates or finds a demo user and returns a session token. Bypasses Firebase auth.",
)
async def demo_login(payload: dict, db: db_dependency):
    role = payload.get("role", "agent")

    if role == "team_lead":
        demo_data = DEMO_TEAM_LEAD.copy()
    else:
        demo_data = DEMO_AGENT.copy()

    result = db.execute(select(Users).where(Users.email == demo_data["email"]))
    user = result.scalar_one_or_none()
    sub_users = []

    if not user:
        firebase_uid = f"demo_{role}_{uuid.uuid4().hex}"
        demo_data["firebase_uid"] = firebase_uid

        user = Users(
            firebase_uid=firebase_uid,
            email=demo_data["email"],
            first_name=demo_data["first_name"],
            last_name=demo_data["last_name"],
            role=demo_data["role"],
            registered_year=demo_data.get("registered_year"),
            license_number=demo_data.get("license_number"),
            agency_branch=demo_data.get("agency_branch"),
        )
        db.add(user)
        db.flush()

        if role == "team_lead":
            for sub in SUB_AGENTS:
                sub_result = db.execute(
                    select(Users).where(Users.email == sub["email"])
                )
                existing_sub = sub_result.scalar_one_or_none()
                if existing_sub:
                    existing_sub.team_lead_id = user.user_id
                    sub_users.append(existing_sub)
                else:
                    sub_user = Users(
                        firebase_uid=f"demo_sub_{uuid.uuid4().hex}",
                        email=sub["email"],
                        first_name=sub["first_name"],
                        last_name=sub["last_name"],
                        role=sub["role"],
                        agency_branch=sub["agency_branch"],
                        team_lead_id=user.user_id,
                    )
                    db.add(sub_user)
                    db.flush()
                    sub_users.append(sub_user)

        db.commit()
        db.refresh(user)
    else:
        if role == "team_lead":
            for agent_template in SUB_AGENTS:
                agent = db.execute(
                    select(Users).where(Users.email == agent_template["email"])
                ).scalar_one_or_none()
                if agent:
                    sub_users.append(agent)

    if role == "team_lead":
        for idx, sub_user in enumerate(sub_users):
            seed_demo_data(db, sub_user.user_id, set_index=idx)
    else:
        seed_demo_data(db, user.user_id, set_index=0)

    demo_token = generate_demo_token()
    register_session(demo_token, user.firebase_uid)

    return {
        "demo_token": demo_token,
        "user": UserResponse.model_validate(user).model_dump(),
    }
