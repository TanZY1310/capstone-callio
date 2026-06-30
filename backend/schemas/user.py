import uuid
from pydantic import BaseModel, StrictInt, Field, ConfigDict
from models.user import UserRole

class UserCreate(BaseModel): # Email and password now comes from firebase token
    first_name: str = Field(min_length=1, max_length=1000)
    last_name: str = Field(min_length=1, max_length=1000)
    role: UserRole = UserRole.AGENT
    registered_year: StrictInt | None = None
    license_number: str | None = None
    agency_branch: str | None = None
    team_lead_id: uuid.UUID | None = None

class UserResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    user_id: uuid.UUID
    firebase_uid: str | None
    email: str | None
    first_name: str
    last_name: str
    role: str
    registered_year: StrictInt | None = None
    license_number: str | None = None
    agency_branch: str | None = None
    team_lead_id: uuid.UUID | None = None
    sheets_id: str | None = None
    bio: str | None = None

class UserVerification(BaseModel):
    password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=6, description="New password")

class UserProfileUpdate(BaseModel):
    first_name: str | None = Field(None, max_length=100)
    last_name: str | None = Field(None, max_length=100)
    license_number: str | None = Field(None, max_length=10)
    agency_branch: str | None = Field(None, max_length=100)
    team_lead_id: uuid.UUID | None = None
    sheets_id: str | None = Field(None, max_length=255)
    bio: str | None = Field(None, max_length=1000)