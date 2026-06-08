from sqlalchemy import Column, Integer, ForeignKey, String, DATE, DATETIME, Boolean
from sqlalchemy.sql import func
from database import Base

class Users(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)