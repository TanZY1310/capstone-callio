from fastapi import FastAPI, Depends, Path, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from database import engine, SessionLocal, get_db, create_tables
from typing import Annotated
from sqlalchemy.orm import Session
from pydantic import BaseModel, StrictInt, Field

#Instead of importing routers.customer i can just from routers with the use of __init__.py
from routers import customers, auth, sheets

app = FastAPI()
create_tables()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)    

async def root():
    return {"message": "Welcome to the API!"}  

# Add your routers here
app.include_router(customers.router)
app.include_router(auth.router)
app.include_router(sheets.router)