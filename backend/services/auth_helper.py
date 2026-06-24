import uuid
from firebase_admin import auth as firebase_auth
from sqlalchemy import select
from models.user import Users
from fastapi import HTTPException

async def resolve_user_id(db, firebase_uid: str) -> uuid.UUID:
    """Given a Firebase UID, return the internal user_id (UUID)."""
    result = db.execute(select(Users.user_id).where(Users.firebase_uid == firebase_uid))
    row = result.one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="User not found")
    return row[0]