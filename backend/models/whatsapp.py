import uuid
from sqlalchemy import Column, Integer, ForeignKey, JSON, String, DateTime, func
from database import Base
from sqlalchemy.orm import Mapped, mapped_column


class AIResponse(Base):
    __tablename__ = "airesponses"

    response_id = Column(Integer, primary_key = True, index = True)
    content = Column(JSON)
    status = Column(String, default="draft")
    # cust_id = Column(uuid.UUID, ForeignKey("customers.cust_id"))
    cust_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("customers.cust_id"),
        nullable=False,
    )
    created_at = Column(DateTime, default=func.now())


