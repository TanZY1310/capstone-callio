import os 
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy_utils import database_exists, create_database
from typing import Annotated
from fastapi import Depends
from google.cloud.sql.connector import Connector

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")

INSTANCE_CONNECTION_NAME = os.getenv("INSTANCE_CONNECTION_NAME")

if os.getenv("ENV") == "production" and INSTANCE_CONNECTION_NAME:
    missing = [v for v in ("DB_USER", "DB_PASSWORD", "DB_NAME") if not os.getenv(v)]
    if missing:
        raise RuntimeError(
            f"Cloud SQL connector mode: missing env vars: {', '.join(missing)}"
        )
    connector = Connector()

    def getconn():
        conn = connector.connect(
            INSTANCE_CONNECTION_NAME,
            "pg8000",
            user=DB_USER,
            password=DB_PASSWORD,
            db=DB_NAME
        )
        return conn

    engine = create_engine(
        "postgresql+pg8000://",
        creator=getconn,
        pool_size=5,
        max_overflow=10,
        pool_timeout=30,
        pool_recycle=1800
    )
else:
    missing = [v for v in ("DB_USER", "DB_PASSWORD", "DB_HOST", "DB_PORT", "DB_NAME") if not os.getenv(v)]
    if missing:
        raise RuntimeError(
            f"Direct connection mode: missing env vars: {', '.join(missing)}"
        )
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