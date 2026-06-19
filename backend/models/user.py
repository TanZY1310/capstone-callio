import uuid
from enum import StrEnum
from sqlalchemy import Column, Integer, ForeignKey, String, DATE, DATETIME, Boolean, Enum as SAEnum
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID
from database import Base

class UserRole(StrEnum):
    TEAM_LEAD = "team_lead"
    AGENT = "agent"

class Users(Base):
    __tablename__ = "users"

    user_id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
    )
    first_name:  Mapped[str] = mapped_column(String(100), nullable=False)
    last_name:  Mapped[str] = mapped_column(String(100), nullable=False)

    role: Mapped[UserRole] = mapped_column(
        SAEnum(UserRole, name="user_role_enum"),
        nullable=False,
        default=UserRole.AGENT,
    )

    email: Mapped[str] =  mapped_column(String(255), unique=True, nullable=False, index=True)
    password: Mapped[str] = mapped_column(String(255), nullable=False)

    registered_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    license_number: Mapped[str | None] = mapped_column(String(10), nullable=True)
    agency_branch: Mapped[str | None] = mapped_column(String(255), nullable=True)