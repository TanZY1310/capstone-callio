import uuid

_demo_sessions: dict[str, str] = {}

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


def generate_demo_token() -> str:
    return f"DEMO_{uuid.uuid4().hex}"


def register_session(token: str, firebase_uid: str):
    _demo_sessions[token] = firebase_uid


def get_session_uid(token: str) -> str | None:
    return _demo_sessions.get(token)
