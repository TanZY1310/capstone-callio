import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables

#Instead of importing routers.customer i can just from routers with the use of __init__.py
from routers import customers, auth, sheets, user_profile, whatsapp, speech, users, metrics, rag

app = FastAPI()

if os.getenv("ENV") != "production" or os.getenv("AUTO_MIGRATE", "").lower() == "true":
    create_tables()

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware, 
    allow_origins=[frontend_url],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)    

# Add your routers here
app.include_router(customers.router)
app.include_router(auth.router)
app.include_router(whatsapp.router)
app.include_router(sheets.router)
app.include_router(user_profile.router)
app.include_router(speech.router)
app.include_router(metrics.router)
app.include_router(users.router)
app.include_router(rag.router)
