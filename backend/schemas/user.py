from pydantic import BaseModel, StrictInt, Field, EmailStr
from models.user import UserRole

class UserCreate(BaseModel):
    first_name: str = Field(min_length=3, max_length=1000)
    last_name: str = Field(min_length=3, max_length=1000)
    role: UserRole = UserRole.AGENT
    email: EmailStr
    password: str = Field(min_length=8)
    registered_year: StrictInt
    license_number: str = Field(min_length=10, max_length=10)
    agency_branch: str = Field(min_length=3, max_length=1000)


class UserVerification(BaseModel):
    password: str = Field(..., description="Current password")
    new_password: str = Field(..., min_length=6, description="New password")

class UserProfileUpdate(BaseModel):
    first_name: str | None = Field(None, max_length=100)
    last_name: str | None = Field(None, max_length=100)
    license_number: str | None = Field(None, max_length=10)
    agency_branch: str | None = Field(None, max_length=100)