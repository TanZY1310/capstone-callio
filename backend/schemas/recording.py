# backend/schemas/recording.py

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


# ----------------------------
# Base shared fields
# ----------------------------
class RecordingBase(BaseModel):
    filename: str
    file_size: int
    status: Optional[str] = "pending"


# ----------------------------
# For upload request (if needed)
# Typically used when metadata is sent via API (not file itself)
# ----------------------------
class RecordingUpload(BaseModel):
    filename: str
    file_size: int


# ----------------------------
# Response schema
# ----------------------------
class RecordingResponse(BaseModel):
    recording_id: UUID
    user_id: UUID

    filename: str
    file_path: str
    file_size: int

    transcript: Optional[str] = None
    sentiment: Optional[str] = None

    status: str

    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True  # for SQLAlchemy ORM compatibility