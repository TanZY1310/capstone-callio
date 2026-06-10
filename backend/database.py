from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import database_exists, create_database
from typing import Annotated
from fastapi import Depends

# PostgreSQL connection details: Move to env file later
DB_USER = "postgres"
DB_PASSWORD = "Drose?4MVP"
DB_HOST = "localhost"
DB_PORT = "5432"
DB_NAME = "callio_db"

# Database_URL:
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

engine = create_engine(DATABASE_URL, pool_size=5, max_overflow=10, pool_timeout=30, pool_recycle=1800)

if not database_exists(engine.url):
    create_database(engine.url)
    print("Database created successfully!")
else:
    print("Database already exists.")

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def create_tables():
    Base.metadata.create_all(bind=engine)

db_dependency = Annotated[Session, Depends(get_db)]