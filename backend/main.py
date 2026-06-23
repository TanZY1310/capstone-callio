from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import create_tables

#Instead of importing routers.customer i can just from routers with the use of __init__.py
from routers import customers, auth, sheets, user_profile, whatsapp, speech

app = FastAPI()
create_tables()

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"],
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
