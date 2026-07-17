from pydantic import BaseModel, Field, StrictInt
from datetime import date
import uuid
from enum import StrEnum
from typing import Optional


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
    
class ConversionRate(BaseModel):
    calls_change: int
    appointments_change: int
    bookings_change: int


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
    conversion: ConversionRate
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
    appointment_rate: int
    bookings: int
    booking_rate: int
    status: str

class TeamStats(BaseModel):
    team_kpis: AgentStats
    team_regions: list[RegionCount]
    # team_completed: int
    # team_objections: list[ObjectionCount]
    
class LeaderDashboardResponse(BaseModel):
    total_agents: int
    team_stats: TeamStats
    team_overview: list[AgentTable]
    team_conversion: ConversionRate










