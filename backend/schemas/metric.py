from pydantic import BaseModel, Field, StrictInt
from datetime import date
import uuid
from enum import StrEnum

#-------------------------------------------- #
# SELECTING PERIOD
#-------------------------------------------- #

class Period(StrEnum):
    DAILY = "daily"
    MONTHLY = "monthly"
    # YEARLY = "yearly"

# Enum means FastAPI can read it directly from a query parameter — 
# when the frontend sends ?period=monthly, FastAPI automatically validates it against these three values 
# and returns a clean 422 error if something invalid comes through

#-------------------------------------------- #
# NORMAL AGENT DASHBOARD
#-------------------------------------------- #

class AgentStats(BaseModel):
    calls: int
    leads: int
    followUps: int
    appointments: int
    bookings: int
    calls_change: float = 0.00
    bookings_change: float = 0.00

class CallCount(BaseModel):
    call_date: str | int
    call_count: int

class RegionCount(BaseModel):
    region: str
    region_count: int

class ObjectionCount(BaseModel):
    objection_type: str
    objection_count: int

class AgentDashboardResponse(BaseModel):
    kpis: AgentStats
    total_region: list[RegionCount]
    top_objection: list[ObjectionCount]
    # total_calls: list[CallCount]


#-------------------------------------------- #
# LEADER AGENT DASHBOARD
#-------------------------------------------- #

class AgentTable(BaseModel):
    agent_id: uuid.UUID  # user id
    agent_name: str # user first name and last name
    calls: int 
    leads: int
    followUps: int
    appointments: int

class TeamStats(BaseModel):
    team_kpis: AgentStats
    team_regions: list[RegionCount]
    # team_objections: list[ObjectionCount]
    
class LeaderDashboardResponse(BaseModel):
    # total_agents: int
    # team_calls: int
    # team_leads: int
    # team_appointments: int
    # team_bookings: int
    # team_prev_bookings: int
    # team_prev_calls: int
    total_agents: int
    team_stats: TeamStats
    team_completed: int
    team_overview: list[AgentTable]










