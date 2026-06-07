from database import Base
from sqlalchemy import Column, Integer, String, Date
from datetime import date

# class User(Base):
#     __tablename__ = "user"

#     id = Column(Integer, primary_key=True, index=True)
#     username = Column(String)

# class UserTask(Base):
#     __tablename__ = "user_task"

#     task_id = Column(Integer, primary_key=True, index=True)
#     user = Column(String)

# class Customer(Base):
#     __tablename__ = "customer"

class Books(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String)
    author = Column(String)
    published_year = Column(Integer)
