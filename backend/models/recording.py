# backend/models/recording.py

import uuid
from datetime import datetime

from sqlalchemy import Column, String, DateTime, ForeignKey, Text, Integer
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from backend.database import Base  # adjust if your Base is located elsewhere


class Recording(Base):
    __tablename__ = "recordings"

    recording_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)

    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"), nullable=False, index=True)

    filename = Column(String, nullable=False)
    file_path = Column(String, nullable=False)
    file_size = Column(Integer, nullable=False)

    transcript = Column(Text, nullable=True)
    sentiment = Column(String, nullable=True)

    status = Column(String, nullable=False, default="pending")  # e.g. pending, processing, done, failed

    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Optional relationship (if you have User model)
    user = relationship("User", back_populates="recordings")