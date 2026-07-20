import uuid
from fastapi import APIRouter, HTTPException, Depends
from typing import Annotated
from routers.auth import verify_firebase_token
from services.auth_helper import resolve_user_id
from services.llm_tracker import update_user_token_usage
from models.whatsapp import AIResponse
from schemas.whatsapp import AIResponseSchema, AIResponseUpdate, SendMessage
from models.customer import Customers
from models.speech import SpeechAnalysis
from database import get_db, db_dependency
from services.ai_responder import generate_reply_draft
from services.whatsapp_client import fetch_connection_status, fetch_chat_messages, send_whatsapp_message, connect_whatsapp
router = APIRouter(
    prefix = "/whatsapp",
    tags = ["whatsapp"]
)

TRANSCRIPT_HISTORY_LIMIT = 5

def _get_transcript_history(db: db_dependency, cust_id: uuid.UUID) -> list[str]:
    """Most recent call transcriptions for this customer, newest first."""
    rows = (
        db.query(SpeechAnalysis.transcription)
        .filter(SpeechAnalysis.customer_id == cust_id)
        .order_by(SpeechAnalysis.created_at.desc())
        .limit(TRANSCRIPT_HISTORY_LIMIT)
        .all()
    )
    return [row.transcription for row in rows]

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

# Get all customers
# DB
@router.get("/details/all/{user_id}")
async def get_all_customers(db: db_dependency, user_id: uuid.UUID):
    response = db.query(Customers).filter(Customers.user_id == user_id).all()
    if not response:
        raise HTTPException(status_code=404, detail="Customer not found")
    return response

# Get info to show in ContactCard & LeadHeader
# DB
@router.get("/details/{cust_id}")
async def get_customer_info(cust_id: uuid.UUID, db: db_dependency):
    # NOTE: removed `await` — db.query() on a sync session isn't awaitable
    response = db.query(Customers).filter(Customers.cust_id == cust_id).first()
    if not response:
        raise HTTPException(status_code=404, detail="Customer not found")
    return response

# read whatsapp history (ideally read it in a way that matches frontend rendering and make it show)
# NODEJS + DB (maybe, due to AIResponse) - AI Response part handled in generate_ai_draft
@router.get("/history/{cust_id}")
async def get_chat_history(cust_id: uuid.UUID, db: db_dependency):
    search = db.query(Customers).filter(Customers.cust_id == cust_id).first()
    if not search:
        raise HTTPException(status_code=404, detail="Customer not found")
    if not search.phone:
        return []

    response = await fetch_chat_messages(search.phone)
    return response

# take input in from user and prompt the send
# NODEJS
@router.post("/send/{cust_id}")
async def send_chat_message(cust_id: uuid.UUID, payload: SendMessage, db: db_dependency):
    search = db.query(Customers).filter(Customers.cust_id == cust_id).first()
    if not search:
        raise HTTPException(status_code=404, detail="Customer not found")
    response = await send_whatsapp_message(search.phone, payload.message)
    return response

# Current draft(s) for this customer — all live bubbles
# DB
@router.get("/airesponse/{cust_id}")
async def get_ai_drafts(cust_id: uuid.UUID, db: db_dependency):
    responses = db.query(AIResponse).filter(
        AIResponse.cust_id == cust_id,
        AIResponse.status.in_(["draft", "edited"])
    ).all()
    
    # Clean up corrupted content (if an object was accidentally saved as JSON)
    for r in responses:
        if not isinstance(r.content, str):
            r.content = str(r.content)
            
    return responses


# explicit generate action — adds a new bubble
# DB + LangChain (via ai_responder.py)
@router.post("/airesponse/{cust_id}/generate", response_model=AIResponseSchema)
async def generate_ai_draft(
    cust_id: uuid.UUID,
    db: db_dependency,
    current_user: Annotated[dict, Depends(verify_firebase_token)]
):
    customer = db.query(Customers).filter(Customers.cust_id == cust_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    chat_history = await fetch_chat_messages(customer.phone)

    customer_info = {
        "id": str(customer.cust_id),
        "name": customer.cust_name,
        "phone": customer.phone,
    }

    print(f"Customer ID is {customer_info['id']}")
    user_id = await resolve_user_id(db, current_user["uid"])
    metadata_out = {}
    
    content = await generate_reply_draft(
        chat_history=chat_history,
        customer_info=customer_info,
        transcript_history=_get_transcript_history(db, cust_id),
        metadata_out=metadata_out,
    )
    
    if metadata_out.get("tokens_used"):
        update_user_token_usage(db, user_id, metadata_out["tokens_used"])

    new_response = AIResponse(content=content, cust_id=cust_id, status="draft")
    db.add(new_response)
    db.commit()
    db.refresh(new_response)
    return new_response


# regenerate a specific bubble — replaces its content in place, no compare
# DB + LangChain
@router.post("/airesponse/{cust_id}/{response_id}/regenerate", response_model = AIResponseSchema)
async def regenerate_ai_draft(
    cust_id: uuid.UUID,
    response_id: int,
    db: db_dependency,
    current_user: Annotated[dict, Depends(verify_firebase_token)]
):
    existing = db.query(AIResponse).filter(
        AIResponse.response_id == response_id,
        AIResponse.cust_id == cust_id,
    ).first()

    if not existing:
        raise HTTPException(status_code=404, detail="Response not found")

    customer = db.query(Customers).filter(Customers.cust_id == cust_id).first()
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")

    chat_history = await fetch_chat_messages(customer.phone)
    customer_info = {"id": str(customer.cust_id), "name": customer.cust_name, "phone": customer.phone}

    user_id = await resolve_user_id(db, current_user["uid"])
    metadata_out = {}

    content = await generate_reply_draft(
        chat_history=chat_history,
        customer_info=customer_info,
        transcript_history=_get_transcript_history(db, cust_id),
        metadata_out=metadata_out,
    )
    
    if metadata_out.get("tokens_used"):
        update_user_token_usage(db, user_id, metadata_out["tokens_used"])

    existing.content = content
    existing.status = "draft"  # reset in case it had been "edited"
    db.commit()
    db.refresh(existing)
    return existing


# edit a specific bubble's content before sending
# DB
@router.patch("/airesponse/{cust_id}/{response_id}")
async def update_ai_draft(cust_id: uuid.UUID, response_id: int, payload: AIResponseUpdate, db: db_dependency):
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
@router.post("/airesponse/{cust_id}/{response_id}/confirm", response_model = AIResponseSchema)
async def confirm_ai_draft(cust_id: uuid.UUID, response_id: int, db: db_dependency):
    current = db.query(AIResponse).filter(
        AIResponse.response_id == response_id, #ensure response_id matches during frontend-backend mapping
        AIResponse.cust_id == cust_id,
        AIResponse.status.in_(["draft", "edited"])
    ).first()

    if not current:
        raise HTTPException(status_code=404, detail="No confirmable draft with this ID")

    search = db.query(Customers).filter(Customers.cust_id == cust_id).first()
    if not search:
        raise HTTPException(status_code=404, detail="Customer not found")
    await send_whatsapp_message(search.phone, content=current.content)

    # only mark after confirming if send actually worked
    current.status = "confirmed"
    db.commit()
    db.refresh(current)
    return current
