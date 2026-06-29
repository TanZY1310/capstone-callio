from pydantic import BaseModel, Field, StrictInt
from datetime import date
import uuid


# NORMAL AGENT DASHBOARD

class AgentStats(BaseModel):
    calls: int
    leads: int
    followUps: int
    appointments: int

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
    
# LEADER AGENT DASHBOARD

class AgentTable(BaseModel):
    agent_id: uuid.UUID  # user id
    agent_first_name: str # user first name and last name
    agent_last_name: str # user first name and last name
    total_calls: int 
    total_leads: int
    follow_ups: int
    appointments: int


class LeaderDashboardResponse(BaseModel):
    
    total_agents: int
    team_calls: int
    team_followUp: int
    team_appoinments: int
    agents: list[AgentTable]


# # finalise
# class LeaderDashboardResponse(BaseModel):
#     own_stats: AgentStats
#     team_stats: TeamOverviewResponse




# class AgentDashboardStats(BaseModel): 
#     total_calls: int
#     total_leads: int
#     total_region: str
#     follow_ups: int
#     appoinment_sets: int
#     call_weekly: list[dict]

# # for table agent overview
# class AgentTable(BaseModel):
#     agent_name: str
#     total_calls: int
#     total_leads: int
#     total_region: str
#     follow_ups: int
#     appoinment_sets: int
    
# class LeaderStats(BaseModel):
#     total_agents: int
#     agent_overview: list[AgentTable]
    





