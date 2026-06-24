from fastapi import APIRouter
from sqlalchemy import select

from database import db_dependency
from models.user import Users, UserRole
from pydantic import BaseModel, ConfigDict
import uuid

router = APIRouter(
    prefix="/users",
    tags=["users"],
)

class TeamLeadResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    user_id: uuid.UUID
    first_name: str
    last_name: str

@router.get(
    "/team-leads",
    response_model=list[TeamLeadResponse],
    summary="List all team leads",
    description="Returns users with role 'team_lead' for agent registration dropdown.",
)
async def list_team_leads(db: db_dependency) -> list[Users]:
    result = db.execute(
        select(Users).where(Users.role == UserRole.TEAM_LEAD.value)
    )
    return list(result.scalars().all())
