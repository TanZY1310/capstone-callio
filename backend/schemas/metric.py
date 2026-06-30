from pydantic import BaseModel, Field, StrictInt
from datetime import date
import uuid

#-------------------------------------------- #
# NORMAL AGENT DASHBOARD
#-------------------------------------------- #

class AgentStats(BaseModel):
    calls: int
    leads: int
    followUps: int
    appointments: int
    bookings: int

class DailyCallCount(BaseModel):
    call_date: date
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
    daily_calls: list[DailyCallCount]


#-------------------------------------------- #
# LEADER AGENT DASHBOARD
#-------------------------------------------- #

class AgentTable(BaseModel):
    agent_id: uuid.UUID  # user id
    agent_name: str # user first name and last name
    total_calls: int 
    total_leads: int
    follow_ups: int
    appointments: int

class TeamStats(BaseModel):
    team_kpis: AgentStats
    team_regions: list[RegionCount]
    team_objections: list[ObjectionCount]
    
class LeaderDashboardResponse(BaseModel):
    # total_agents: int
    # team_calls: int
    # team_appointments: int
    total_agents: int
    team_stats: TeamStats
    team_overview: list[AgentTable]










