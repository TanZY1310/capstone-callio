import uuid
from enum import StrEnum
from sqlalchemy import Integer, String, Enum as SAEnum, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
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

    role: Mapped[str] = mapped_column(
        String(20),
        nullable=False,
        default=UserRole.AGENT.value,
    )

    email: Mapped[str] =  mapped_column(String(255), unique=True, nullable=False, index=True)
    # password column removed — Firebase owns credentials
    
    registered_year: Mapped[int | None] = mapped_column(Integer, nullable=True)
    license_number: Mapped[str | None] = mapped_column(String(10), nullable=True)
    agency_branch: Mapped[str | None] = mapped_column(String(255), nullable=True)

    team_lead_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("users.user_id"), nullable=True
    )

    firebase_uid: Mapped[str | None] = mapped_column(String(128), unique=True, nullable=False) 