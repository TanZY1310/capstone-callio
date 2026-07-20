import uuid
from typing import Annotated

from fastapi import APIRouter, HTTPException, status, Depends, Request, Response
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
from services.jwt_helper import (
    create_session_jwt,
    verify_session_jwt,
    set_session_cookie,
    COOKIE_NAME,
)

init_firebase()

router = APIRouter(
    prefix="/auth",
    tags=["auth"]
)


async def verify_firebase_token(request: Request) -> dict:
    cookie_payload = _verify_cookie(request)
    if cookie_payload:
        return cookie_payload

    authorization = request.headers.get("Authorization", "")
    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format. Expected: Bearer <token>",
        )

    token = authorization.removeprefix("Bearer ")

    demo_uid = get_session_uid(token)
    if token.startswith("DEMO_"):
        if demo_uid:
            return {"uid": demo_uid, "demo": True, "email": "demo@callio.demo"}
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Demo session expired. Please log in again.",
        )

    try:
        decoded = await run_in_threadpool(firebase_auth.verify_id_token, token)
    except firebase_auth.ExpiredIdTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired. Please sign in again.",
        )
    except firebase_auth.InvalidIdTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token.",
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Token verification failed: {type(e).__name__}: {str(e)}",
        )
    return decoded


def _verify_cookie(request: Request) -> dict | None:
    cookie_token = request.cookies.get(COOKIE_NAME)
    if not cookie_token:
        return None
    return verify_session_jwt(cookie_token)


def _set_auth_cookie(response: Response, user: Users):
    jwt_token = create_session_jwt(
        firebase_uid=user.firebase_uid,
        user_id=user.user_id,
        role=user.role,
        email=user.email,
    )
    set_session_cookie(response, jwt_token)
    return jwt_token


FirebaseToken = Annotated[dict, Depends(verify_firebase_token)]


@router.post(
    "/session",
    response_model=UserResponse,
    summary="Restore session",
    description="Called on app load. Verifies the Firebase ID token and returns the matching DB user profile.",
)
async def get_session(token: FirebaseToken, db: db_dependency, response: Response) -> Users:
    uid = token["uid"]

    result = db.execute(select(Users).where(Users.firebase_uid == uid))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found. Please complete registration.",
        )

    _set_auth_cookie(response, user)
    return user


@router.post(
    "/refresh",
    response_model=UserResponse,
    summary="Refresh session cookie",
    description="Accepts Firebase ID token or demo token, verifies it, and issues/refreshes the session cookie.",
)
async def refresh_session(token: FirebaseToken, db: db_dependency, response: Response) -> Users:
    uid = token["uid"]

    result = db.execute(select(Users).where(Users.firebase_uid == uid))
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User profile not found.",
        )

    _set_auth_cookie(response, user)
    return user


@router.post(
    "/register",
    response_model=UserResponse,
    status_code=status.HTTP_201_CREATED,
    summary="Register user profile",
    description="Creates the DB user profile after Firebase account creation. Called once from RegisterForm.",
)
async def register_user(payload: UserCreate, token: FirebaseToken, db: db_dependency, response: Response) -> Users:
    uid = token["uid"]
    email = token.get("email")

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

    _set_auth_cookie(response, new_user)
    return new_user


@router.post(
    "/demo-login",
    status_code=status.HTTP_200_OK,
    summary="Demo login (presentation mode)",
    description="Creates or finds a demo user and returns a session token. Bypasses Firebase auth.",
)
async def demo_login(payload: dict, db: db_dependency, response: Response):
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
            sheets_id=demo_data.get("sheets_id"),
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
                    if sub.get("sheets_id"):
                        existing_sub.sheets_id = sub["sheets_id"]
                    db.flush()
                    sub_users.append(existing_sub)
                else:
                    sub_user = Users(
                        firebase_uid=f"demo_sub_{uuid.uuid4().hex}",
                        email=sub["email"],
                        first_name=sub["first_name"],
                        last_name=sub["last_name"],
                        role=sub["role"],
                        agency_branch=sub["agency_branch"],
                        sheets_id=sub.get("sheets_id"),
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
            await run_in_threadpool(seed_demo_data, db, sub_user.user_id, set_index=idx)
    else:
        await run_in_threadpool(seed_demo_data, db, user.user_id, set_index=0)

    demo_token = generate_demo_token()
    register_session(demo_token, user.firebase_uid)

    _set_auth_cookie(response, user)

    return {
        "demo_token": demo_token,
        "user": UserResponse.model_validate(user).model_dump(),
    }
