from fastapi import APIRouter, FastAPI, Depends, Path, HTTPException, status
from sqlalchemy import func, extract, select, and_
import uuid
from typing import List, Optional

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
    TeamStats,
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
async def get_agent_dashboard(db: db_dependency, user_id: uuid.UUID):
    
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
                          .filter(Customers.status == "Appointment")
                          .scalar() or 0
                          )
    
    total_bookings = ( db.query(func.count(Customers.cust_id))
                          .filter(Customers.user_id == user_id)
                          .filter(Customers.status == "Booking")
                          .scalar() or 0
                          )
    

    # finalize for the top metrics - for NORMAL AGENTS
    kpis = AgentStats(
        calls=total_calls_today,
        leads=total_leads,
        followUps=pending_follow_ups,
        appointments=total_appointments,
        bookings=total_bookings
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
async def get_leader_dashboard(db: db_dependency, user_id: uuid.UUID):

    # get the current user info
    current_user = db.query(Users).filter(Users.user_id == user_id).first()

    if current_user is None:
        raise(HTTPException(status_code=404, detail= "User not found"))
    
    # if current_user.role is not 'team_lead':
    #     raise HTTPException(status_code= 403, detail= "Leader access only")
    
    
    

    
    team_members = db.query(Users).filter(Users.team_lead_id == user_id).all()
    team_agent_ids = [m.user_id for m in team_members]


    today_start = datetime.combine(datetime.now(timezone.utc).date(), datetime.min.time())
    today_end  = today_start + timedelta(days=1)

    # month_start = today_start.replace(day=1)

    # Team stats calculation

    # checking if the leader has any agents under him
    if not team_agent_ids:
        team_kpis = AgentStats(calls = 0, leads=0, followUps=0, appointments=0, bookings=0)
        team_overview = []
        team_regions, team_objections = [], []
        team_stats = TeamStats(
            team_kpis=team_kpis,
            team_objections=team_objections,
            team_regions=team_regions
            
        )
    
    else:
        team_calls_today = ( 
            db.query(func.count(SpeechAnalysis.id)) 
            .filter(SpeechAnalysis.user_id.in_(team_agent_ids))
            .filter(SpeechAnalysis.created_at >= today_start, SpeechAnalysis.created_at < today_end)
            .scalar() or 0
            )
        
        team_leads = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id.in_(team_agent_ids))
            .scalar() or 0
        )

        ## modify it later if in case the status customer is using manual method

        team_latest_per_customer = (
            db.query(AIResponse.cust_id, func.max(AIResponse.created_at).label("latest_time"))
            .group_by(AIResponse.cust_id)
            .subquery()
        )
        # .subquery() says the opposite: "don't finish yet — 
        # package this up as a temporary, nameless table that another query can use as one of its ingredients.

        team_followUps = (
            db.query(func.count(AIResponse.response_id))
            .join(team_latest_per_customer, and_ (AIResponse.cust_id == team_latest_per_customer.c.cust_id, AIResponse.created_at == team_latest_per_customer.c.latest_time))
            .join(Customers, AIResponse.cust_id == Customers.cust_id)
            .filter(SpeechAnalysis.user_id.in_(team_agent_ids))
            .filter(AIResponse.status.in_(PENDING_STATUSES))
            .scalar() or 0
        )

        team_appointments = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id.in_(team_agent_ids))
            .filter(func.lower(Customers.status) == "appointment")
            .scalar() or 0
        )

        team_bookings = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id.in_(team_agent_ids))
            .filter(func.lower(Customers.status) == "booking")
            .scalar() or 0
        )

        # Total agents under the leader
        # option 2- look at the return LeaderDashbpoardResponse

        # total_agents = (
        #     db.query(func.count(Users.user_id))
        #     .filter(Users.team_lead_id == user_id)
        #     .scalar() or 0
        # )

        # Overall total kpis (call today, leads, followUps, appointments)

        team_kpis = AgentStats(
            calls= team_calls_today,
            leads= team_leads,
            followUps= team_followUps,
            appointments= team_appointments,
            bookings=team_bookings
        )

        # Total team regions

        team_region_rows = (
            db.query(Customers.location, func.count(Customers.cust_id).label("count"))
            .filter(Customers.user_id.in_(team_agent_ids))
            .filter(Customers.location.isnot(None)) # filter out rows with empty location
            .group_by(Customers.location)
            .order_by(func.count(Customers.cust_id).desc())
            .all()
        )

        # looping through all the rows and insert it into RegionCount list
        team_regions = [RegionCount(region = r.location, region_count= r.count) for r in team_region_rows]

        # Total team objections

        team_objection_rows = (
            db.query(Objection.objection_type, func.count(Objection.objection_id).label("count"))
            .join(SpeechAnalysis, Objection.call_id == SpeechAnalysis.id)
            .filter(SpeechAnalysis.user_id.in_(team_agent_ids))
            .group_by(Objection.objection_type)
            .order_by(func.count(Objection.objection_id).desc())
            .all()
        )

        # looping through all the rows and insert it into ObjectionCount list
        team_objections = [ObjectionCount(objection_type= r.objection_type, objection_count= r.count) for r in team_objection_rows]

        team_stats = TeamStats(
            team_kpis= team_kpis,
            team_regions= team_regions,
            team_objections= team_objections
            
        )

        # AGENT TABLE:
        ## This section is for the agent table (each row consists of the agent details: kpis, etc)

        if not team_agent_ids:
            team_overview = []

        else:
            lead_rows = (
                db.query(Customers.user_id, func.count(Customers.cust_id).label("count"))
                .filter(Customers.user_id.in_(team_agent_ids))
                .group_by(Customers.user_id)
                .all()
            )

            leads_map = { r.user_id: r.count for r in lead_rows}

            call_today_rows = (
                db.query(SpeechAnalysis.user_id, func.count(SpeechAnalysis.id).label("count"))
                .filter(SpeechAnalysis.user_id.in_(team_agent_ids))
                .filter(SpeechAnalysis.created_at >= today_start, SpeechAnalysis.created_at < today_end)
                .group_by(SpeechAnalysis.user_id)
                .all()
            )

            calls_today_map = { r.user_id: r.count for r in call_today_rows}

            overview_latest_per_customer = (
            db.query(
                AIResponse.cust_id,
                func.max(AIResponse.created_at).label("latest_time"),
            )
            .group_by(AIResponse.cust_id)
            .subquery()
        )
            follow_up_rows = (
                db.query(
                    Customers.user_id,
                    func.count(AIResponse.response_id).label("count"),
                )
                .join(
                    overview_latest_per_customer,
                    and_(
                        AIResponse.cust_id == overview_latest_per_customer.c.cust_id,
                        AIResponse.created_at == overview_latest_per_customer.c.latest_time,
                    ),
                )
                .join(Customers, AIResponse.cust_id == Customers.cust_id)
                .filter(Customers.user_id.in_(team_agent_ids))
                .filter(AIResponse.status.in_(PENDING_STATUSES)) # (func.lower(Customers.status) == "appointment")
                .group_by(Customers.user_id)
                .all()
            )
            follow_up_map = {r.user_id: r.count for r in follow_up_rows}

            appointment_rows = (
                db.query(Customers.user_id, func.count(Customers.cust_id).label("count"))
                .filter(Customers.user_id.in_(team_agent_ids))
                .filter(func.lower(Customers.status) == "appointment")
                .group_by(Customers.user_id)
                .all()
            )

            appointments_map = { r.user_id: r.count for r in appointment_rows}
            team_overview = [] 

            team_overview = [ AgentTable(
                agent_id= m.user_id,
                agent_name= f'{m.first_name} {m.last_name}',
                total_leads= leads_map.get(m.user_id, 0),
                # dict.get(key, default) returns the value if key exists, or default if it doesn't — exactly what you want here, since not every agent will have rows in every map 
                # (e.g. an agent with zero calls today won't appear in calls_today_map at all).
                total_calls= calls_today_map.get(m.user_id, 0),
                follow_ups= follow_up_map.get(m.user_id, 0),
                appointments= appointments_map.get(m.user_id, 0),
            
            )  for m in team_members ]

    # What the API returns to frontend
    return LeaderDashboardResponse(
        # total_agents=total_agents,
        team_stats= team_stats,
        team_overview=team_overview,
        total_agents = len(team_agent_ids)
    )
    

# ---------------------------------------------------------------------
# DAILY CALLS CHART — month-aware, for the prev/next arrow UI.
# ---------------------------------------------------------------------

@router.get("/agent/daily-calls/{user_id}", response_model=List[DailyCallCount])
# get the year and month requested
async def get_agent_daily_calls(db: db_dependency, user_id: uuid.UUID, year: Optional[int] = None, month: Optional[int] =  None):
    
    today = datetime.now(timezone.utc).date()

    # Step 2 — defaulting to "today" if nothing was sent
    if year is None:
        year = today.year
    if month is None:
        month = today.month

    # Step 3 — validation, before anything risky happens
    # Checking if the month is between 1 and 12
    if not (1 <= month <= 12):
        raise(HTTPException(status_code= 400, detail= "Invalid month. Month must be between 1 and 12"))
    
    # Checking if the year is between 2020 and 2030
    if not (2020 <= year <= 2030):
        raise(HTTPException(status_code= 400, detail= "Invalid year. Year must be between 2020 and 2030"))
    
    # Step 4 — building the month's boundaries
    month_start = date(year, month, 1)

    if month == 12:
        month_end = date(year + 1, 1, 1) # nak tunjuk rolling year, instead of become month 13
    else:
        month_end = date(year, month + 1, 1)

    rows = (
        db.query(func.date(SpeechAnalysis.created_at).label("call_date"),
                 func.count(SpeechAnalysis.id).label("call_count"))
        .filter(SpeechAnalysis.user_id == user_id)
        .filter(SpeechAnalysis.created_at >= month_start)
        .filter(SpeechAnalysis.created_at < month_end)
        .group_by(func.date(SpeechAnalysis.created_at))
        .order_by(func.date(SpeechAnalysis.created_at))
        .all()
    )
    
    return [DailyCallCount(call_date= r.call_date, call_count= r.call_count) for r in rows]












    
