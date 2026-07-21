from fastapi import APIRouter, FastAPI, Depends, Path, HTTPException, status, Query
from sqlalchemy import func, extract, select, and_
import uuid
from typing import List, Optional

from datetime import datetime, timezone, timedelta, date
from database import db_dependency

from models.user import Users, UserRole
from models.customer import Customers
from schemas.user import UserVerification, UserProfileUpdate
from models.speech import SpeechAnalysis, Objection

from schemas.metric import (
    AgentStats,
    CallCount,
    RegionCount,
    ObjectionCount,
    LeaderDashboardResponse,
    AgentTable,
    TeamStats,
    AgentDashboardResponse,
    Period,
    ConversionRate
)

#GET/POST/PUT/DELETE /metrics
router = APIRouter(
    prefix="/dashboard",
    tags=["metrics"]
)

PENDING_FOLLOWUPS = ["Pending Appointment", "WhatsApp"]
APPOINTMENT_OR_BEYOND = ["Appointment", "Booking", "Completed"]
BOOKING_OR_BEYOND = ["Booking", "Completed"]
COMPLETED = ["Completed"]

# -----------------------#
# This is the query part; we use functions and just can call them later in @router
# -----------------------#

#-------------------------------------------- #
# 1. WRITE THE PERIOD BOUNDARIES FUNCTION 
#-------------------------------------------- #\

# ----------------this is get period for CALLS VOLUME----------------------
def get_period_calls(period, year: int, month: int, day: int): # explicitly state what type a variable should be

    if period == Period.DAILY:
        

        start = date(year, month, 1)

        # month_end rolls forward to first day of the next month

        if month == 12:
            end = date(year + 1, 1, 1)

        else: end = date(year, month + 1, 1)

        return start, end
    
    elif period == Period.MONTHLY:
        # 

        start = date(year, 1, 1)
        end = date(year + 1, 1, 1)

        return start, end
    
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported period: {period}")


# ------------------this is get period for KPIs---------------------------
def get_period(period, year: int, month: int, day: int): # explicitly state what type a variable should be

    if period == Period.DAILY:
        start = date(year, month, day)
        end = date(year, month, day) # it ends on the same day
        return start, end

    elif period == Period.MONTHLY:
        start = date(year, month, 1)

        # month_end rolls forward to first day of the next month

        if month == 12:
            end = date(year + 1, 1, 1)

        else: end = date(year, month + 1, 1)

        return start, end
    else:
        raise HTTPException(status_code=400, detail=f"Unsupported period: {period}")

# ------------------this is get period for KPIs (LAST MONTH)---------------------------
def get_previous_period(period, year: int, month: int, day: int):
    if period == Period.DAILY:
        # previous period for daily = yesterday
        yesterday = date(year, month, day) - timedelta(days=1)
        return yesterday, yesterday  # single day, same start and end

    elif period == Period.MONTHLY:
        # previous period for monthly = last month
        if month == 1:
            prev_month = 12
            prev_year = year - 1
        else:
            prev_month = month - 1
            prev_year = year

        start = date(prev_year, prev_month, 1)
        end = date(year, month, 1)
        return start, end
    
# ------------------compute % changes---------------------------
def pct_change(current, previous):
    if previous == 0:
        return 0  # no previous data — return 0 instead of None
    return int(((current - previous) / previous) * 100)
    
        
#-------------------------------------------- #
# 2. AGENT DASHBOARD API
#-------------------------------------------- #

@router.get("/agent", response_model=AgentDashboardResponse)
async def get_agent_dashboard(db: db_dependency, user_id: uuid.UUID, 
                              period: Period = Query(default=Period.MONTHLY), 
                              year: int = Query(default=None),
                              month: int = Query(default=None),
                              day: int = Query(default=None),
                              ):
    
# Query is FastAPI's way of telling the framework: 
# "this parameter comes from the URL query string, not from the request body or the path."
# Example: "/dashboard/agent/{user_id}?period=monthly&year=2026&month=6"
# if tak letak, the FastAPI will see it as "/dashboard/agent/{user_id}/monthly/2026/6".

    today = datetime.now(timezone.utc).date()

    if year is None:
        year = today.year
    
    if month is None:
        month = today.month

    if day is None:
        day = today.day

    start, end = get_period(period=period, year=year, month=month, day=day)

    # get previous period boundaries
    prev_start, prev_end = get_previous_period(period, year, month, day)
    

    if period == Period.DAILY:

        total_calls = ( db.query(func.count(SpeechAnalysis.id))
                       .filter(SpeechAnalysis.user_id == user_id)
                       .filter(func.date(SpeechAnalysis.created_at) == start)
                       .scalar() or 0
                       )

        pending_follow_ups = ( db.query(func.count(Customers.cust_id))
                  .filter(Customers.user_id == user_id)
                  .filter(Customers.status.in_(PENDING_FOLLOWUPS))
                #   .filter(func.date(Customers.last_contact) == start)
                  .scalar() or 0
                  )

        total_appointments = ( db.query(func.count(Customers.cust_id))
                  .filter(Customers.user_id == user_id)
                  .filter(Customers.status == "Appointment")
                  .filter(func.date(Customers.last_contact) == start)
                  .scalar() or 0
                  )

        total_bookings = ( db.query(func.count(Customers.cust_id))
                  .filter(Customers.user_id == user_id)
                  .filter(Customers.status == "Booking")
                  .filter(func.date(Customers.last_contact) == start)
                  .scalar() or 0
                  )

        # NEW: Total Completed
        total_completed = ( db.query(func.count(Customers.cust_id))
                  .filter(Customers.user_id == user_id)
                  .filter(Customers.status.in_(COMPLETED))
                  .filter(func.date(Customers.last_contact) == start)
                  .scalar() or 0
                  )

        total_leads = (
                    db.query(func.count(func.distinct(SpeechAnalysis.customer_id)))
                    .join(Customers, SpeechAnalysis.customer_id == Customers.cust_id)
                    .filter(Customers.user_id == user_id)
                    .filter(func.date(SpeechAnalysis.created_at) == start)
                    .scalar() or 0
                     )

        prev_calls = (
            db.query(func.count(SpeechAnalysis.id))
            .filter(SpeechAnalysis.user_id == user_id)
            .filter(func.date(SpeechAnalysis.created_at) == prev_start)
            .scalar() or 0
        )

        prev_bookings = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id == user_id)
            .filter(Customers.status.in_(BOOKING_OR_BEYOND))
            .filter(func.date(Customers.last_contact) == prev_start)
            .scalar() or 0
        )

        prev_appointments = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id == user_id)
            .filter(Customers.status.in_(APPOINTMENT_OR_BEYOND))
            .filter(func.date(Customers.last_contact) == prev_start)
            .scalar() or 0
        )

        # NEW: prev completed
        prev_completed = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id == user_id)
            .filter(Customers.status.in_(COMPLETED))
            .filter(func.date(Customers.last_contact) == prev_start)
            .scalar() or 0
        )

        calls_change = pct_change(total_calls, prev_calls)
        bookings_change = pct_change(total_bookings, prev_bookings)
        appointments_change = pct_change(total_appointments, prev_appointments)
        completed_change = pct_change(total_completed, prev_completed)  # NEW

    else:

        total_calls = ( db.query(func.count(SpeechAnalysis.id))
                       .filter(SpeechAnalysis.user_id == user_id)
                       .filter(func.date(SpeechAnalysis.created_at) >= start,
                               func.date(SpeechAnalysis.created_at) < end)
                       .scalar() or 0
                       )

        pending_follow_ups = ( db.query(func.count(Customers.cust_id))
                  .filter(Customers.user_id == user_id)
                  .filter(Customers.status.in_(PENDING_FOLLOWUPS))
                #   .filter(func.date(Customers.last_contact) >= start,
                #           func.date(Customers.last_contact) < end)
                  .scalar() or 0
                  )

        total_appointments = ( db.query(func.count(Customers.cust_id))
                  .filter(Customers.user_id == user_id)
                  .filter(Customers.status == "Appointment")
                  .filter(func.date(Customers.last_contact) >= start,
                          func.date(Customers.last_contact) < end)
                  .scalar() or 0
                  )

        total_bookings = ( db.query(func.count(Customers.cust_id))
                  .filter(Customers.user_id == user_id)
                  .filter(Customers.status == "Booking")
                  .filter(func.date(Customers.last_contact) >= start,
                          func.date(Customers.last_contact) < end)
                  .scalar() or 0
                  )

        # NEW: Total Completed
        total_completed = ( db.query(func.count(Customers.cust_id))
                  .filter(Customers.user_id == user_id)
                  .filter(Customers.status.in_(COMPLETED))
                  .filter(func.date(Customers.last_contact) >= start,
                          func.date(Customers.last_contact) < end)
                  .scalar() or 0
                  )

        total_leads = (
                    db.query(func.count(func.distinct(SpeechAnalysis.customer_id)))
                    .join(Customers, SpeechAnalysis.customer_id == Customers.cust_id)
                    .filter(Customers.user_id == user_id)
                    .filter(func.date(SpeechAnalysis.created_at) >= start)
                    .filter(func.date(SpeechAnalysis.created_at) < end)
                    .scalar() or 0
                     )

        prev_calls = (
            db.query(func.count(SpeechAnalysis.id))
            .filter(SpeechAnalysis.user_id == user_id)
            .filter(func.date(SpeechAnalysis.created_at) >= prev_start,
                    func.date(SpeechAnalysis.created_at) < prev_end)
            .scalar() or 0
        )

        prev_bookings = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id == user_id)
            .filter(Customers.status.in_(BOOKING_OR_BEYOND))
            .filter(func.date(Customers.last_contact) >= prev_start,
                    func.date(Customers.last_contact) < prev_end)
            .scalar() or 0
        )

        prev_appointments = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id == user_id)
            .filter(Customers.status.in_(APPOINTMENT_OR_BEYOND))
            .filter(func.date(Customers.last_contact) >= prev_start,
                    func.date(Customers.last_contact) < prev_end)
            .scalar() or 0
        )

        # NEW: prev completed
        prev_completed = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id == user_id)
            .filter(Customers.status.in_(COMPLETED))
            .filter(func.date(Customers.last_contact) >= prev_start,
                    func.date(Customers.last_contact) < prev_end)
            .scalar() or 0
        )

        calls_change = pct_change(total_calls, prev_calls)
        bookings_change = pct_change(total_bookings, prev_bookings)
        appointments_change = pct_change(total_appointments, prev_appointments)
        completed_change = pct_change(total_completed, prev_completed)  # NEW

    kpis = AgentStats(
        calls=total_calls,
        leads=total_leads,
        followUps=pending_follow_ups,
        appointments=total_appointments,
        bookings=total_bookings,
        completed=total_completed,  # NEW
    )

    conversionPct = ConversionRate(
        calls_change=calls_change,
        leads_change=0,  # not tracked at agent-level in your original design; kept explicit rather than silently omitted
        appointments_change=appointments_change,
        bookings_change=bookings_change,
        completed_change=completed_change,  # NEW
    )

    if period == Period.DAILY:
        region_rows = ( db.query(Customers.location, func.count(Customers.cust_id).label("count"))
                    .filter(Customers.user_id == user_id)
                    .filter(Customers.location.isnot(None))
                    .filter(func.date(Customers.last_contact) == start)
                    .group_by(Customers.location)
                    .order_by(func.count(Customers.cust_id).desc())
                    .limit(5)
                    .all()
                    )
    else:
        region_rows = ( db.query(Customers.location, func.count(Customers.cust_id).label("count"))
                    .filter(Customers.user_id == user_id)
                    .filter(Customers.location.isnot(None))
                    .filter(func.date(Customers.last_contact) >= start,
                            func.date(Customers.last_contact) < end)
                    .group_by(Customers.location)
                    .order_by(func.count(Customers.cust_id).desc())
                    .limit(5)
                    .all()
                    )

    regions = [ RegionCount(region = r.location, region_count = r.count) for r in region_rows]

    if period == Period.DAILY:
        objection_rows = ( db.query(Objection.objection_type, func.count(Objection.objection_id).label("count"))
                        .join(SpeechAnalysis, Objection.call_id == SpeechAnalysis.id)
                        .filter(SpeechAnalysis.user_id == user_id)
                        .filter(func.date(SpeechAnalysis.created_at) == start)
                        .group_by(Objection.objection_type)
                        .order_by(func.count(Objection.objection_id).desc())
                        .limit(5)
                        .all()
                        )
    else:
        objection_rows = ( db.query(Objection.objection_type, func.count(Objection.objection_id).label("count"))
                        .join(SpeechAnalysis, Objection.call_id == SpeechAnalysis.id)
                        .filter(SpeechAnalysis.user_id == user_id)
                        .filter(func.date(SpeechAnalysis.created_at) >= start,
                                func.date(SpeechAnalysis.created_at) < end)
                        .group_by(Objection.objection_type)
                        .order_by(func.count(Objection.objection_id).desc())
                        .limit(5)
                        .all()
                        )

    top_objections = [ ObjectionCount(objection_type = r.objection_type, objection_count = r.count)
                      for r in objection_rows]

    return AgentDashboardResponse(
        kpis = kpis,
        conversion=conversionPct,
        total_region = regions,
        top_objection = top_objections
    )


# ---------------------------------------------------------------------
# 3. DAILY CALLS CHART — month-aware, for the prev/next arrow UI.
# ---------------------------------------------------------------------

@router.get("/calls", response_model=List[CallCount])
# get the year and month requested
async def get_agent_calls(db: db_dependency, user_id: uuid.UUID, 
                          period: Period = Query(default = Period.MONTHLY), 
                          year: int = Query(default=None), 
                          month: int = Query(default=None), 
                          day: int = Query(default=None)):
    
    today = datetime.now(timezone.utc).date()

    if year is None:
        year = today.year
    if month is None:
        month = today.month
    if day is None:
        day = today.day

    start, end = get_period_calls(period=period, year=year, month=month, day=day)

    if period == Period.DAILY:
        # rows = (
        #     db.query(func.extract("hour",  SpeechAnalysis.created_at).label("call_date"),
        #             func.count(SpeechAnalysis.id).label("call_count"))
        #     .filter(SpeechAnalysis.user_id == user_id, 
        #             SpeechAnalysis.created_at == start)
        #     .group_by(func.extract("hour",  SpeechAnalysis.created_at))
        #     .order_by(func.extract("hour",  SpeechAnalysis.created_at))
        #     .all()
        # )
    
        # return [CallCount(call_date= int(r.call_date), call_count= r.call_count) for r in rows]

        rows = (
            db.query(func.date(SpeechAnalysis.created_at).label("call_date"),
                    func.count(SpeechAnalysis.id).label("call_count"))
            .filter(SpeechAnalysis.user_id == user_id, 
                    func.date(SpeechAnalysis.created_at) == start)
            .group_by(func.date(SpeechAnalysis.created_at))
            .order_by(func.date(SpeechAnalysis.created_at))
            .all()
        )

        return [CallCount(call_date= str(r.call_date), call_count= r.call_count) for r in rows]
    
    elif period == Period.MONTHLY:
        # rows = (
        #     db.query(func.date(SpeechAnalysis.created_at).label("call_date"),
        #             func.count(SpeechAnalysis.id).label("call_count"))
        #     .filter(SpeechAnalysis.user_id == user_id, 
        #             SpeechAnalysis.created_at >= start,
        #             SpeechAnalysis.created_at < end)
        #     .group_by(func.date(SpeechAnalysis.created_at))
        #     .order_by(func.date(SpeechAnalysis.created_at))
        #     .all()
        # )

        # return [CallCount(call_date= str(r.call_date), call_count= r.call_count) for r in rows]

        rows = (
            db.query( func.extract("month", SpeechAnalysis.created_at).label("call_date"), 
                     func.count(SpeechAnalysis.id).label("call_count"))
            .filter(SpeechAnalysis.user_id == user_id, 
                    func.date(SpeechAnalysis.created_at) >= start,
                    func.date(SpeechAnalysis.created_at) < end)
            .group_by(func.extract("month", SpeechAnalysis.created_at))
            .order_by(func.extract("month", SpeechAnalysis.created_at))
            .all()            
              
        )

        return [CallCount(call_date= int(r.call_date), call_count= r.call_count) for r in rows]
    
    # elif period == Period.YEARLY:
    #     rows = (
    #         db.query( func.extract("month", SpeechAnalysis.created_at).label("call_date"), 
    #                  func.count(SpeechAnalysis.id).label("call_count"))
    #         .filter(SpeechAnalysis.user_id == user_id, 
    #                 SpeechAnalysis.created_at >= start,
    #                 SpeechAnalysis.created_at < end)
    #         .group_by(func.extract("month", SpeechAnalysis.created_at))
    #         .order_by(func.extract("month", SpeechAnalysis.created_at))
    #         .all()            
              
    #     )

    #     return [CallCount(call_date= int(r.call_date), call_count= r.call_count) for r in rows]

#-------------------------------------------- #
# 4. LEADER DASHBOARD
#-------------------------------------------- #

def get_leader_period(period: Period, year: int, month: int):
    if period == Period.MONTHLY:
        start = date(year, month, 1)
        end = date(year + 1, 1, 1) if month == 12 else date(year, month + 1, 1)

        if month == 1:
            prev_start = date(year - 1, 12, 1)
        else:
            prev_start = date(year, month - 1, 1)
        prev_end = start

        return start, end, prev_start, prev_end

    elif period == Period.YEARLY:
        start = date(year, 1, 1)
        end = date(year + 1, 1, 1)
        prev_start = date(year - 1, 1, 1)
        prev_end = start

        return start, end, prev_start, prev_end

    else:
        raise HTTPException(status_code=400, detail=f"Unsupported period for leader dashboard: {period}")
    
## AGENT TABLE FOR LEADER DASHBOARD

@router.get("/leader/{user_id}/overview", response_model=List[AgentTable])
async def get_leader_team_overview(
    db: db_dependency,
    user_id: uuid.UUID,
    period: Period = Query(default=Period.MONTHLY),
    year: Optional[int] = Query(default=None),
):
    team_members = db.query(Users).filter(Users.team_lead_id == user_id).all()
    team_agent_ids = [m.user_id for m in team_members]

    if not team_agent_ids:
        return []

    today = datetime.now(timezone.utc).date()
    if year is None:
        year = today.year
    month = today.month

    start, end, prev_start, prev_end = get_leader_period(period=period, year=year, month=month)

    lead_rows = (
        db.query(Customers.user_id, func.count(func.distinct(SpeechAnalysis.customer_id)).label("count"))
        .join(Customers, SpeechAnalysis.customer_id == Customers.cust_id)
        .filter(Customers.user_id.in_(team_agent_ids))
        .filter(func.date(SpeechAnalysis.created_at) >= start)
        .filter(func.date(SpeechAnalysis.created_at) < end)
        .group_by(Customers.user_id)
        .all()
    )
    leads_map = {r.user_id: r.count for r in lead_rows}

    call_rows = (
        db.query(SpeechAnalysis.user_id, func.count(SpeechAnalysis.id).label("count"))
        .filter(SpeechAnalysis.user_id.in_(team_agent_ids))
        .filter(func.date(SpeechAnalysis.created_at) >= start,
                func.date(SpeechAnalysis.created_at) < end)
        .group_by(SpeechAnalysis.user_id)
        .all()
    )
    calls_map = {r.user_id: r.count for r in call_rows}

    follow_up_rows = (
        db.query(Customers.user_id, func.count(Customers.cust_id).label("count"))
        .filter(Customers.user_id.in_(team_agent_ids))
        .filter(Customers.status.in_(PENDING_FOLLOWUPS))
        # .filter(func.date(Customers.last_contact) >= start,
        #         func.date(Customers.last_contact) < end)
        .group_by(Customers.user_id)
        .all()
    )
    follow_up_map = {r.user_id: r.count for r in follow_up_rows}

    appointment_rows = (
        db.query(Customers.user_id, func.count(Customers.cust_id).label("count"))
        .filter(Customers.user_id.in_(team_agent_ids))
        .filter(Customers.status == "Appointment")
        .filter(func.date(Customers.last_contact) >= start,
                func.date(Customers.last_contact) < end)
        .group_by(Customers.user_id)
        .all()
    )
    appointments_map = {r.user_id: r.count for r in appointment_rows}

    bookings_rows = (
        db.query(Customers.user_id, func.count(Customers.cust_id).label("count"))
        .filter(Customers.user_id.in_(team_agent_ids))
        .filter(Customers.status == "Booking")
        .filter(func.date(Customers.last_contact) >= start,
                func.date(Customers.last_contact) < end)
        .group_by(Customers.user_id)
        .all()
    )
    bookings_map = {r.user_id: r.count for r in bookings_rows}

    # NEW: completed rows
    completed_rows = (
        db.query(Customers.user_id, func.count(Customers.cust_id).label("count"))
        .filter(Customers.user_id.in_(team_agent_ids))
        .filter(Customers.status.in_(COMPLETED))
        .filter(func.date(Customers.last_contact) >= start,
                func.date(Customers.last_contact) < end)
        .group_by(Customers.user_id)
        .all()
    )
    completed_map = {r.user_id: r.count for r in completed_rows}

    team_overview = []
    for m in team_members:
        leads = leads_map.get(m.user_id, 0)
        calls = calls_map.get(m.user_id, 0)
        follow_ups = follow_up_map.get(m.user_id, 0)
        appointments = appointments_map.get(m.user_id, 0)
        bookings = bookings_map.get(m.user_id, 0)
        completed = completed_map.get(m.user_id, 0)  # NEW

        appt_rate = round((appointments / leads) * 100, 1) if leads > 0 else 0.0
        booking_rate = round((bookings / leads) * 100, 1) if appointments > 0 else 0.0
        completion_rate = round((completed / leads) * 100, 1) if leads > 0 else 0.0  # NEW

        if follow_ups > 0 and leads == 0:
            status = "needs_attention"
        elif follow_ups > 0 and calls > 0:
            status = "follow_ups_needed"
        elif follow_ups == 0 and calls == 0:
            status = "no_activity"
        else:
            status = "on_track"

        team_overview.append(AgentTable(
            agent_id=m.user_id,
            agent_name=f"{m.first_name} {m.last_name}",
            leads=leads,
            calls=calls,
            followUps=follow_ups,
            appointments=appointments,
            bookings=bookings,
            appointment_rate=appt_rate,
            booking_rate=booking_rate,
            completed=completed,             # NEW
            completion_rate=completion_rate, # NEW
            status=status,
        ))

    return team_overview

## Other metrics for leader dashboard

@router.get("/leader/{user_id}", response_model=LeaderDashboardResponse)
async def get_leader_dashboard(db: db_dependency, user_id: uuid.UUID):

    current_user = db.query(Users).filter(Users.user_id == user_id).first()
    if current_user is None:
        raise HTTPException(status_code=404, detail="No user data")

    team_members = db.query(Users).filter(Users.team_lead_id == user_id).all()
    team_agent_ids = [m.user_id for m in team_members]

    today = datetime.now(timezone.utc).date()
    year = today.year
    month = today.month
    start = date(year, month, 1)
    end = date(year + 1, 1, 1) if month == 12 else date(year, month + 1, 1)

    if month == 1:
        prev_month = 12
        prev_year = year - 1
    else:
        prev_month = month - 1
        prev_year = year

    prev_start = date(prev_year, prev_month, 1)
    prev_end = date(year, month, 1)

    if not team_agent_ids:
        team_kpis = AgentStats(calls=0, leads=0, followUps=0, appointments=0, bookings=0, completed=0)
        team_regions = []
        team_conversion = ConversionRate(
            calls_change=0, leads_change=0, appointments_change=0,
            bookings_change=0, completed_change=0,
        )
        team_stats = TeamStats(team_kpis=team_kpis, team_regions=team_regions)

    else:

        team_calls = (
            db.query(func.count(SpeechAnalysis.id))
            .filter(SpeechAnalysis.user_id.in_(team_agent_ids))
            .filter(func.date(SpeechAnalysis.created_at) >= start,
                    func.date(SpeechAnalysis.created_at) < end)
            .scalar() or 0
            )

        team_leads = (
                    db.query(func.count(func.distinct(SpeechAnalysis.customer_id)))
                    .join(Customers, SpeechAnalysis.customer_id == Customers.cust_id)
                    .filter(Customers.user_id.in_(team_agent_ids))
                    .filter(func.date(SpeechAnalysis.created_at) >= start,
                            func.date(SpeechAnalysis.created_at) < end)
                    .scalar() or 0
                     )

        team_followUps = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id.in_(team_agent_ids))
            .filter(Customers.status.in_(PENDING_FOLLOWUPS))
            .filter(func.date(Customers.last_contact) >= start,
                    func.date(Customers.last_contact) < end)
            .scalar() or 0
        )

        team_bookings = (
                    db.query(func.count(Customers.cust_id))
                    .filter(Customers.user_id.in_(team_agent_ids), Customers.status.in_(BOOKING_OR_BEYOND))
                    .filter(func.date(Customers.last_contact) >= start,
                            func.date(Customers.last_contact) < end)
                    .scalar() or 0
                )

        team_appointments = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id.in_(team_agent_ids))
            .filter(Customers.status.in_(APPOINTMENT_OR_BEYOND))
            .filter(func.date(Customers.last_contact) >= start,
                    func.date(Customers.last_contact) < end)
            .scalar() or 0
        )

        team_completed = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id.in_(team_agent_ids))
            .filter(Customers.status.in_(COMPLETED))
            .filter(func.date(Customers.last_contact) >= start,
                    func.date(Customers.last_contact) < end)
            .scalar() or 0
        )

        team_prev_bookings = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id.in_(team_agent_ids))
            .filter(Customers.status.in_(BOOKING_OR_BEYOND))
            .filter(func.date(Customers.last_contact) >= prev_start,
                    func.date(Customers.last_contact) < prev_end)
            .scalar() or 0
        )

        team_prev_calls = (
            db.query(func.count(SpeechAnalysis.id))
            .filter(SpeechAnalysis.user_id.in_(team_agent_ids))
            .filter(func.date(SpeechAnalysis.created_at) >= prev_start,
                    func.date(SpeechAnalysis.created_at) < prev_end)
            .scalar() or 0
            )

        team_prev_appointments = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id.in_(team_agent_ids))
            .filter(Customers.status.in_(APPOINTMENT_OR_BEYOND))
            .filter(func.date(Customers.last_contact) >= prev_start,
                    func.date(Customers.last_contact) < prev_end)
            .scalar() or 0
        )

        team_prev_leads = (
            db.query(func.count(func.distinct(SpeechAnalysis.customer_id)))
            .join(Customers, SpeechAnalysis.customer_id == Customers.cust_id)
            .filter(Customers.user_id.in_(team_agent_ids))
            .filter(func.date(SpeechAnalysis.created_at) >= prev_start,
                    func.date(SpeechAnalysis.created_at) < prev_end)
            .scalar() or 0
        )

        team_prev_completed = (
            db.query(func.count(Customers.cust_id))
            .filter(Customers.user_id.in_(team_agent_ids))
            .filter(Customers.status.in_(COMPLETED))
            .filter(func.date(Customers.last_contact) >= prev_start,
                    func.date(Customers.last_contact) < prev_end)
            .scalar() or 0
        )

        team_calls_change = pct_change(team_calls, team_prev_calls)
        team_bookings_change = pct_change(team_bookings, team_prev_bookings)
        team_appointments_change = pct_change(team_appointments, team_prev_appointments)
        team_leads_change = pct_change(team_leads, team_prev_leads)
        team_completed_change = pct_change(team_completed, team_prev_completed)

        team_kpis = AgentStats(
            calls=team_calls, leads=team_leads, followUps=team_followUps,
            appointments=team_appointments, bookings=team_bookings,
            completed=team_completed,
        )

        team_conversion = ConversionRate(
            calls_change=team_calls_change,
            leads_change=team_leads_change,
            appointments_change=team_appointments_change,
            bookings_change=team_bookings_change,
            completed_change=team_completed_change,
        )

        team_region_rows = (
            db.query(Customers.location, func.count(Customers.cust_id).label("count"))
            .filter(Customers.user_id.in_(team_agent_ids))
            .filter(Customers.location.isnot(None))
            .group_by(Customers.location)
            .order_by(func.count(Customers.cust_id).desc())
            .limit(5)
            .all()
        )
        team_regions = [RegionCount(region=r.location, region_count=r.count) for r in team_region_rows]

        team_stats = TeamStats(team_kpis=team_kpis, team_regions=team_regions)

    return LeaderDashboardResponse(
        team_conversion=team_conversion,
        team_stats=team_stats,
        team_overview=[],  # unused — table is served by /leader/{user_id}/overview
        total_agents=len(team_agent_ids),
    )












    
