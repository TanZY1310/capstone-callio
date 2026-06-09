from sqlalchemy import Column, Integer, ForeignKey, String, DATE, DATETIME, Boolean
from database import Base

class Customers(Base):
    __tablename__ = "customers"

    cust_id = Column(Integer, primary_key=True, index=True)
    name = Column(String)