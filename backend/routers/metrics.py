from fastapi import APIRouter, FastAPI, Depends, Path, HTTPException, status
from sqlalchemy import func, extract, select, and_
import uuid
from typing import List

from datetime import datetime, timezone, timedelta, date
from database import db_dependency

from models.user import Users, UserRole
from models.customer import Customers
from schemas.user import UserVerification, UserProfileUpdate
from models.speech import SpeechAnalysis, Objection
from models.whatsapp import AIResponse

from schemas.metric import (
    AgentStats,
    AgentTable,
    DailyCallCount,
    RegionCount,
    ObjectionCount,
    LeaderDashboardResponse,
    # TeamOverviewResponse,
    AgentDashboardResponse
)

#GET/POST/PUT/DELETE /metrics
router = APIRouter(
    prefix="/dashboard",
    tags=["metrics"]
)

PENDING_STATUSES = ["draft", "edited"]


# -----------------------#
# This is the query part; we use functions and just can call them later in @app
# -----------------------#

@router.get("/agent/{user_id}", response_model=AgentDashboardResponse)
def get_agent_dashboard(db: db_dependency, user_id: uuid.UUID):
    
    # get the datetime for today starting from 00:00:00
    today_start = datetime.combine(datetime.now(timezone.utc).date(), datetime.min.time())

    # timedelta is a class from Python's datetime module that represents a duration or difference between two dates/times. 
    # It allows you to add or subtract units of time.
    today_end = today_start + timedelta(days=1)

    # Metrics Top Card
    total_calls_today = ( db.query(func.count(SpeechAnalysis.id))
                         .filter(SpeechAnalysis.user_id == user_id)
                         .filter(SpeechAnalysis.created_at >= today_start, SpeechAnalysis.created_at < today_end)
                         .scalar() or 0
                         )
    
    total_leads = ( db.query(func.count(Customers.cust_id))
                   .filter(Customers.user_id == user_id)
                   .scalar() or 0
                   )
    
    # --- KPI: pending follow-ups (AIResponse, latest-contact(row)-per-customer) ---
    # Step 1: find the latest created_at PER CUSTOMER, across ALL their
    # AIResponse rows (not filtered by agent yet — we filter after the join).
    latest_per_customer = ( db.query(AIResponse.cust_id, func.max(AIResponse.created_at).label("latest_contact"),)
                           .group_by(AIResponse.cust_id)
                           .subquery()
                           ) # the output is gonna be 2 columns: cust_id and the date of the latest date
    
    # Step 2: walk back to AIResponse to recover the STATUS of that
    # specific latest row (cust_id + created_at must both match —
    # that's what pins down the exact row, not just the timestamp).
    # Step 3: join to Customer to scope by agent, then filter status.
    pending_follow_ups = ( db.query(func.count(AIResponse.response_id))
                          .join(latest_per_customer, and_(AIResponse.cust_id == latest_per_customer.c.cust_id,
                                                          AIResponse.created_at == latest_per_customer.c.latest_contact),
                                                          )
                            .join(Customers, AIResponse.cust_id == Customers.cust_id)
                            .filter(Customers.user_id == user_id)
                            .filter(AIResponse.status.in_(PENDING_STATUSES))
                            .scalar() or 0
                            )
    
    total_appointments = ( db.query(func.count(Customers.cust_id))
                          .filter(Customers.user_id == user_id)
                          .filter(Customers.status == "appointment")
                          .scalar() or 0
                          )
    

    # finalize for the top metrics - for NORMAL AGENTS
    kpis = AgentStats(
        calls=total_calls_today,
        leads=total_leads,
        followUps=pending_follow_ups,
        appointments=total_appointments
    )

    # --- Daily calls line chart (last 31 days) ---

    since = today_start.replace(day=1)

    daily_rows = ( db.query(func.date(SpeechAnalysis.created_at).label("call_date"),
                  func.count(SpeechAnalysis.id).label("call_count"))
                  .filter(SpeechAnalysis.user_id == user_id)
                  .filter(SpeechAnalysis.created_at >= since)
                  .group_by(func.date(SpeechAnalysis.created_at))
                  .order_by(func.date(SpeechAnalysis.created_at))
                  .all()
                  )
    
    daily_calls = [DailyCallCount(call_date = r.call_date, call_count= r.call_count)
                   for r in daily_rows]
    
    # --- Regions bar chart (count of CUSTOMERS per region, NOT calls) ---
    # A customer who gets called 5 times still counts as 1 toward their region —
    # this chart answers "how many leads do I have per region"


    region_rows = ( db.query(Customers.location, func.count(Customers.cust_id).label("count"))
                   .filter(Customers.user_id == user_id)
                   .filter(Customers.location.isnot(None))
                   .group_by(Customers.location)
                   .order_by(func.count(Customers.cust_id).desc()) 
                   .limit(5)
                   .all()
                   ) 
    
    regions = [ RegionCount(region = r.location, region_count = r.count) for r in region_rows]

    # --- Top 5 objections bar chart ---

    objection_rows = ( db.query(Objection.objection_type, func.count(Objection.objection_id).label("count"))
                      .join(SpeechAnalysis, Objection.call_id == SpeechAnalysis.id)
                      .filter(SpeechAnalysis.user_id == user_id)
                      .group_by(Objection.objection_type)
                      .order_by(func.count(Objection.objection_id).desc())
                      .limit(5)
                      .all()
                      )
    
    top_objections = [ ObjectionCount(objection_type = r.objection_type, objection_count = r.count) 
                      for r in objection_rows]
    
    return AgentDashboardResponse(
        kpis = kpis,
        daily_calls = daily_calls,
        total_region = regions,
        top_objection = top_objections
    )


@router.get("/leader/{user_id}", response_model=LeaderDashboardResponse)
def get_leader_dashboard(db: db_dependency, user_id: uuid.UUID, user_role: str):
    
    if user_role !=  UserRole.TEAM_LEAD:
        raise HTTPException(status_code= 400, detail= "Leader access only")
    
    team_members = db.query(Users).filter(Users.manager_id == user_id).all()
    team_ids = [m.user_id for m in team_members]


    

    

    










    

























# @router.get("/kpi/agent", response_model= AgentStats) # response_model tells FastAPI what the returned data should look like.
# async def agent_kpis(db: db_dependency, user_id: uuid.UUID):
    
#     # own_id = [user_id.user_id]

#     # query the database
#     total_calls = ( db.query(func.count(SpeechAnalysis.id))
#                    .filter(SpeechAnalysis.user_id == Users.user_id, func.date(SpeechAnalysis.created_at) == func.current_date())
#                    .scalar() or 0
#                    )
    
#     total_leads = ( db.query(func.count(Customers.cust_id)) 
#                    .filter(Customers.user_id == Users.user_id)
#                    .scalar() or 0
#                    )
    

#     # follow ups and appointment need changes
#     # check balik how to join airesponse-customer-user tables
#     follow_ups = ( db.query(func.count(Customers.cust_id))
#                   .filter(Customers.user_id == Users.user_id)
#                   .scalar() or 0
#                   )
    
#     appointments = ( db.query(func.count(Customers.cust_id))
#                     .filter(Customers.cust_id == Users.user_id)
#                     .scalar() or 0
#                     )
    
#     return AgentStats(
#         total_calls=total_calls,
#         total_leads=total_leads,
#         follow_ups=follow_ups,
#         appointments=appointments
#     )

# @router.get("/kpi/team", response_model= TeamOverviewResponse)
# async def team_kpis(db: db_dependency, user_id: uuid.UUID):

#     team_rows = ( db.query(Users.user_id)
#                  .filter(Users.manager_id == Users.user_id)
#                   .all()
#                   )
    



# # Agent Dashboard
# @router.get("/", response_model=AgentDashboardStats,  status_code=status.HTTP_200_OK)
# async def agent_dashboard(user_id: int, db: db_dependency):
#     get_user(db, user_id) # checking if the user exists

#     # why need to put .scalar() or 0 is because
#     # when query from SQL, it didn't return integer value.
#     # it returns rows. so scalar will return the total rows in integer value

#     total_calls = (db.query(func.count(CallLog.call_id))
#                    .filter(CallLog.user_id == user_id,
#                     func.date(CallLog.call_timestamp) == datetime.now(timezone.utc)
#                     .date()).scalar() or 0 )
    
#     total_leads = (db.query(func.count(Customers.cust_id))
#                    .filter(Customers.user_id == user_id)
#                    .scalar() or 0 )
    
#     ## needs checking
#     follow_ups = ( db.query(func.count(Customers.cust_id))
#                        .filter(Customers.user_id == user_id, 
#                                Customers.status == "follow-up")
#                         .scalar() or 0)
    
#     appoinment_sets = ( db.query(func.count(Customers.cust_id))
#                        .filter(Customers.user_id == user_id, 
#                                Customers.status == "appoinment")
#                         .scalar() or 0)
    
#     return AgentDashboardStats(
#         total_calls=total_calls,
#         total_leads=total_leads,
#         follow_ups=follow_ups,
#         appoinment_sets=appoinment_sets
#     )



# # Team Leader Dashboard

# @router.get("/leader", status_code=status.HTTP_200_OK)
# async def agent_table(db: db_dependency, user_id: uuid.UUID,) -> list[AgentTable]:
    
#     agents = db.query()


   

 







    
