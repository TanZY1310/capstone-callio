import os
import time
import uuid

import jwt
from dotenv import load_dotenv

load_dotenv()

DEMO_JWT_SECRET = os.getenv("DEMO_JWT_SECRET", "")
if not DEMO_JWT_SECRET:
    raise RuntimeError("DEMO_JWT_SECRET environment variable is required")

DEMO_JWT_ALGORITHM = "HS256"
DEMO_JWT_EXPIRY_HOURS = 8

DEMO_AGENT = {
    "email": "amir.hassan@callio-property.com",
    "first_name": "Amir",
    "last_name": "Hassan",
    "role": "agent",
    "agency_branch": "Kuala Lumpur HQ",
    "registered_year": 2020,
    "license_number": "REN12345",
    "sheets_id": "1eN1XOgQ7VbaXCCX2iUq0DJrglThdzGkdqjBb6L_z8E8",
}

DEMO_TEAM_LEAD = {
    "email": "zara@callio-property.com",
    "first_name": "Datin Seri",
    "last_name": "Zara",
    "role": "team_lead",
    "agency_branch": "Kuala Lumpur HQ",
    "registered_year": 2017,
    "license_number": "REN67890",
}

SUB_AGENTS = [
    DEMO_AGENT,
    {
        "email": "sarah.chen@callio-property.com",
        "first_name": "Sarah",
        "last_name": "Chen",
        "role": "agent",
        "agency_branch": "Petaling Jaya Branch",
    },
    {
        "email": "james.lim@callio-property.com",
        "first_name": "James",
        "last_name": "Lim",
        "role": "agent",
        "agency_branch": "Cheras Branch",
    },
    {
        "email": "aisha.rahman@callio-property.com",
        "first_name": "Aisha",
        "last_name": "Rahman",
        "role": "agent",
        "agency_branch": "Subang Jaya Branch",
    },
    {
        "email": "daniel.wong@callio-property.com",
        "first_name": "Daniel",
        "last_name": "Wong",
        "role": "agent",
        "agency_branch": "Penang Branch",
    },
]


def generate_demo_jwt(firebase_uid: str, role: str) -> str:
    now = int(time.time())
    payload = {
        "sub": firebase_uid,
        "demo": True,
        "role": role,
        "iat": now,
        "exp": now + DEMO_JWT_EXPIRY_HOURS * 3600,
    }
    return jwt.encode(payload, DEMO_JWT_SECRET, algorithm=DEMO_JWT_ALGORITHM)


def verify_demo_jwt(token: str) -> dict:
    return jwt.decode(token, DEMO_JWT_SECRET, algorithms=[DEMO_JWT_ALGORITHM])
