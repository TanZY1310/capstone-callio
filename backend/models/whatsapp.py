from sqlalchemy import Column, Integer, ForeignKey, JSON, String, DateTime, func
from database import Base

class AIResponse(Base):
    __tablename__ = "airesponses"

    response_id = Column(Integer, primary_key = True, index = True)
    content = Column(JSON)
    status = Column(String, default="draft")
    cust_id = Column(Integer, ForeignKey("customers.cust_id"))
    created_at = Column(DateTime, default=func.now())


