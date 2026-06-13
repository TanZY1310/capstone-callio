import uuid
from datetime import datetime
from sqlalchemy import Integer, ForeignKey, String, DateTime, UniqueConstraint
from sqlalchemy.sql import func
from sqlalchemy.orm import Mapped, mapped_column
from sqlalchemy.dialects.postgresql import UUID, JSONB #JSONB supports indexing and fast lookups compared to JSON
from database import Base
class Customers(Base):
    __tablename__ = "customers"

    cust_id: Mapped[uuid.UUID] = mapped_column(
            UUID(as_uuid=True),
            primary_key=True,
            default=uuid.uuid4,
    )    
    cust_name:  Mapped[str] = mapped_column(String(100), nullable=False)
    phone: Mapped[str] = mapped_column(String(20), nullable=False, unique=True, index=True) # Phone column is unique since id is generated after import google sheets need to make sure no duplicate
    budget: Mapped[int | None] = mapped_column(Integer, nullable=True) # This means that the column can be empty or null
    location: Mapped[str | None] = mapped_column(String(255), nullable=True)
    status: Mapped[str | None] = mapped_column(String(100), nullable=True)
    last_contact: Mapped[datetime | None] = mapped_column(DateTime, onupdate=func.now(), nullable=True) #For datetime can be empty but should update based on status change or other triggers
    remarks: Mapped[dict | None] = mapped_column(JSONB, nullable=True)

    user_id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True),
        ForeignKey("users.user_id"),
        nullable=False,
    )