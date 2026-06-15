from fastapi import APIRouter, HTTPException
from models.whatsapp import AIResponse
from schemas.whatsapp import AIResponseUpdate, SendMessage
from models.customer import Customers
from database import get_db, db_dependency
from services.ai_responder import generate_reply_draft
from services.whatsapp_client import fetch_connection_status, fetch_chat_messages, send_whatsapp_message, connect_whatsapp
router = APIRouter(
    prefix = "/whatsapp",
    tags = ["whatsapp"]
)

@router.get("/")
async def test():
    return "endpoint working fine"

# check if connected, if not allow connect (sync status in frontend)
# NODEJS
@router.get("/status")
async def get_connection_status():
    response = await fetch_connection_status()
    return response

# connect 
# NODEJS
@router.post("/connect")
async def connect():
    response = await connect_whatsapp()
    return response

# Get info to show in ContactCard & LeadHeader
# DB
@router.get("/details/{cust_id}")
async def get_customer_info(cust_id: int, db: db_dependency):
    # NOTE: removed `await` — db.query() on a sync session isn't awaitable
    response = db.query(Customers).filter(Customers.cust_id == cust_id).first()
    if not response:
        raise HTTPException(status_code=404, detail="Customer not found")
    return response

# read whatsapp history (ideally read it in a way that matches frontend rendering and make it show)
# NODEJS + DB (maybe, due to AIResponse) - AI Response part handled in generate_ai_draft
@router.get("/history/{cust_id}")
async def get_chat_history(cust_id: int):
    response = await fetch_chat_messages(cust_id)
    return response

# take input in from user and prompt the send
# NODEJS
@router.post("/send/{cust_id}")
async def send_chat_message(cust_id: int, payload: SendMessage):
    response = await send_whatsapp_message(cust_id, payload.message)
    return response

# Current draft(s) for this customer — all live bubbles
# DB
@router.get("/airesponse/{cust_id}")
async def get_ai_drafts(cust_id: int, db: db_dependency):
    responses = db.query(AIResponse).filter(
        AIResponse.cust_id == cust_id,
        AIResponse.status.in_(["draft", "edited"])
    ).all()
    return responses


# explicit generate action — adds a new bubble
# DB + LangChain (via ai_responder.py)
@router.post("/airesponse/{cust_id}/generate")
async def generate_ai_draft(cust_id: int, db: db_dependency):
    customer = db.query(Customers).filter(Customers.cust_id == cust_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    chat_history = await fetch_chat_messages(cust_id)

    customer_info = {
        "name": customer.name,
        "phone": customer.phone,
    }

    content = await generate_reply_draft(
        chat_history=chat_history,
        customer_info=customer_info,
    )

    new_response = AIResponse(content=content, cust_id=cust_id, status="draft")
    db.add(new_response)
    db.commit()
    db.refresh(new_response)
    return new_response


# regenerate a specific bubble — replaces its content in place, no compare
# DB + LangChain
@router.post("/airesponse/{cust_id}/{response_id}/regenerate")
async def regenerate_ai_draft(cust_id: int, response_id: int, db: db_dependency):
    existing = db.query(AIResponse).filter(
        AIResponse.response_id == response_id,
        AIResponse.cust_id == cust_id,
    ).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Response not found")

    customer = db.query(Customers).filter(Customers.cust_id == cust_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    chat_history = await fetch_chat_messages(cust_id)
    customer_info = {"name": customer.name, "phone": customer.phone}

    content = await generate_reply_draft(
        chat_history=chat_history,
        customer_info=customer_info,
    )

    existing.content = content
    existing.status = "draft"  # reset in case it had been "edited"
    db.commit()
    db.refresh(existing)
    return existing


# edit a specific bubble's content before sending
# DB
@router.patch("/airesponse/{cust_id}/{response_id}")
async def update_ai_draft(cust_id: int, response_id: int, payload: AIResponseUpdate, db: db_dependency):
    draft = db.query(AIResponse).filter(
        AIResponse.response_id == response_id,
        AIResponse.cust_id == cust_id,
        AIResponse.status.in_(["draft", "edited"])
    ).first()

    if not draft:
        raise HTTPException(status_code=404, detail="No editable draft with this ID")

    draft.content = payload.content
    draft.status = "edited"
    db.commit()
    db.refresh(draft)
    return draft


# confirm and send a specific bubble
# NODE + DB
@router.post("/airesponse/{cust_id}/{response_id}/confirm")
async def confirm_ai_draft(cust_id: int, response_id: int, db: db_dependency):
    current = db.query(AIResponse).filter(
        AIResponse.response_id == response_id, #ensure response_id matches during frontend-backend mapping
        AIResponse.cust_id == cust_id,
        AIResponse.status.in_(["draft", "edited"])
    ).first()

    if not current:
        raise HTTPException(status_code=404, detail="No confirmable draft with this ID")

    result = await send_whatsapp_message(cust_id, content=current.content)

    # only mark after confirming if send actually worked
    current.status = "confirmed"
    db.commit()
    db.refresh(current)
    return result
