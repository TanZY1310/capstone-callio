import uuid
from datetime import datetime
from sqlalchemy import Text, ForeignKey, DateTime, String
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB
from database import Base


class SpeechAnalysis(Base):
    __tablename__ = "speech_analysis"

    id: Mapped[uuid.UUID] = mapped_column(primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("users.user_id"), nullable=True)
    customer_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("customers.cust_id"), nullable=True)
    customer_name: Mapped[str | None] = mapped_column(String(255), nullable=True)
    transcription: Mapped[str] = mapped_column(Text, nullable=False)
    sentiment: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    next_actions: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    preferences: Mapped[dict | None] = mapped_column(JSONB, nullable=True)
    summary: Mapped[str | None] = mapped_column(Text, nullable=True)
    objections: Mapped[list | None] = mapped_column(JSONB, nullable=True)
    buyer_stage: Mapped[str | None] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
