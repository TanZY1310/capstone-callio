import os
import uuid
import jwt
from datetime import datetime, timedelta, timezone

JWT_SECRET = os.getenv("JWT_SECRET", "callio-dev-secret-change-in-production")
JWT_ALGORITHM = "HS256"
JWT_EXPIRY_DAYS = 7

COOKIE_NAME = "callio_session"


def create_session_jwt(firebase_uid: str, user_id: uuid.UUID, role: str, email: str) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": firebase_uid,
        "uid": firebase_uid,
        "user_id": str(user_id),
        "role": role,
        "email": email,
        "iat": now,
        "exp": now + timedelta(days=JWT_EXPIRY_DAYS),
    }
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


def verify_session_jwt(token: str) -> dict | None:
    try:
        return jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None


def set_session_cookie(response, token: str):
    response.set_cookie(
        key=COOKIE_NAME,
        value=token,
        httponly=True,
        secure=os.getenv("ENV") == "production",
        samesite="lax",
        max_age=JWT_EXPIRY_DAYS * 24 * 60 * 60,
        path="/",
    )


def delete_session_cookie(response):
    response.delete_cookie(
        key=COOKIE_NAME,
        path="/",
    )
