import uuid
import asyncio

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import db_dependency
from models.customer import Customers
from models.speech import SpeechAnalysis, Objection
from services.audio_service import transcribe_audio, analyze_transcript
from services.sheets import export_customers_to_sheets


class PipelineRequest(BaseModel):
    customer_id: str | None = None

router = APIRouter(prefix="/speech", tags=["Speech"])

AUDIO_MIME_MAP = {
    ".wav": "audio/wav",
    ".mp3": "audio/mpeg",
    ".m4a": "audio/mp4",
    ".ogg": "audio/ogg",
    ".flac": "audio/flac",
    ".webm": "audio/webm",
}

tasks = {}


@router.post("/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    customer_id: str = Form(None),
):
    contents = await file.read()
    ext = (file.filename or "audio.wav").rsplit(".", 1)[-1]
    ext = f".{ext}" if ext else ".wav"
    mime_type = AUDIO_MIME_MAP.get(ext, "audio/wav")

    task_id = str(uuid.uuid4())
    tasks[task_id] = {
        "step": 0,
        "status": "processing",
        "filename": file.filename,
        "customer_id": customer_id,
        "data": None,
        "progress_message": "Uploading audio...",
    }

    asyncio.create_task(_process(task_id, contents, mime_type))

    return {"task_id": task_id}


@router.get("/status/{task_id}")
async def get_status(task_id: str):
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/pipeline/{task_id}")
async def add_to_pipeline(db: db_dependency, task_id: str, body: PipelineRequest = None):
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task["status"] != "complete":
        raise HTTPException(status_code=400, detail="Analysis not yet complete")

    cid = (body.customer_id if body else None) or task.get("customer_id")
    if not cid:
        raise HTTPException(status_code=400, detail="No customer associated")

    analysis_id = task["data"].get("analysisId")

    try:
        analysis_record = None
        if analysis_id:
            analysis_record = db.query(SpeechAnalysis).filter(SpeechAnalysis.id == analysis_id).first()

        summary = analysis_record.summary if analysis_record else task["data"].get("summary", "")
        buyer_stage = analysis_record.buyer_stage if analysis_record else task["data"].get("customerStatus")
        preferences = analysis_record.preferences if analysis_record else task["data"].get("preferences", {})
        next_actions = analysis_record.next_actions if analysis_record else task["data"].get("nextActions", [])
        sentiment = analysis_record.sentiment if analysis_record else task["data"].get("sentiment", {})

        customer = db.query(Customers).filter(Customers.cust_id == cid).first()
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")

        from datetime import datetime

        remarks_entry = customer.remarks or {}
        remarks_entry["speechAnalysis"] = {
            "analysisId": analysis_id,
            "summary": summary,
            "buyerStage": buyer_stage,
            "purpose": (preferences or {}).get("purpose"),
            "sentiment": (sentiment or {}).get("overallSentiment"),
            "nextActions": next_actions,
            "preferences": (preferences or {}).get("preferences"),
            "callDatetime": analysis_record.created_at.isoformat() if analysis_record else None,
            "lastAnalysis": datetime.utcnow().isoformat(),
        }
        customer.remarks = remarks_entry

        if buyer_stage:
            customer.status = buyer_stage

        task_budget = task["data"].get("budget")
        task_location = task["data"].get("location")
        if task_budget is not None:
            customer.budget = str(task_budget)
        if task_location is not None:
            customer.location = task_location

        db.commit()

        try:
            await export_customers_to_sheets(db, customer.user_id)
        except Exception:
            pass

        return {"success": True}
    finally:
        db.close()


async def _process(task_id: str, audio_bytes: bytes, mime_type: str):
    try:
        tasks[task_id]["step"] = 1
        tasks[task_id]["progress_message"] = "Starting transcription..."

        def update(msg):
            tasks[task_id]["progress_message"] = msg

        await asyncio.sleep(0.1)
        transcript = await asyncio.to_thread(transcribe_audio, audio_bytes, mime_type, progress_callback=update)

        tasks[task_id]["step"] = 2
        tasks[task_id]["status"] = "awaiting_approval"
        tasks[task_id]["progress_message"] = "Transcription complete — review and approve"
        tasks[task_id]["data"] = {
            "transcription": transcript,
        }

    except Exception as e:
        tasks[task_id]["status"] = "error"
        tasks[task_id]["error"] = str(e)


@router.post("/reject/{task_id}")
async def reject_transcript(task_id: str):
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task["status"] != "awaiting_approval":
        raise HTTPException(status_code=400, detail="Task is not awaiting approval")

    task["status"] = "rejected"
    return {"success": True}


@router.post("/approve/{task_id}")
async def approve_transcript(db: db_dependency, task_id: str):
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task["status"] != "awaiting_approval":
        raise HTTPException(status_code=400, detail="Task is not awaiting approval")

    task["status"] = "processing"
    task["step"] = 3

    asyncio.create_task(_analyze_phase(db, task_id))

    return {"success": True}


async def _analyze_phase(db:db_dependency, task_id: str):
    try:
        transcript = tasks[task_id]["data"]["transcription"]

        tasks[task_id]["step"] = 3
        tasks[task_id]["progress_message"] = "Starting AI analysis..."

        def update(msg):
            tasks[task_id]["progress_message"] = msg

        await asyncio.sleep(0.1)

        analysis = await asyncio.to_thread(analyze_transcript, transcript, progress_callback=update)

        transcript_text = "\n".join(
            f"{s['speaker']}: {s['text']}" for s in transcript
        )

        buyer_stage = analysis.get("customerStatus")
        summary_text = analysis.get("summary", "")
        if isinstance(summary_text, dict):
            summary_text = str(summary_text)

        objections = analysis.get("objections", analysis.get("sentiment", {}).get("objections", []))

        try:
            customer_id = tasks[task_id].get("customer_id")
            user_id = None
            customer_name = None
            if customer_id:
                customer = db.query(Customers).filter(Customers.cust_id == customer_id).first()
                if customer:
                    user_id = customer.user_id
                    customer_name = customer.cust_name

            record = SpeechAnalysis(
                user_id=user_id,
                customer_id=customer_id,
                customer_name=customer_name,
                transcription=transcript_text,
                sentiment=analysis.get("sentiment", {}),
                next_actions=analysis.get("nextActions", []),
                preferences=analysis.get("preferences", {}),
                summary=summary_text,
                buyer_stage=buyer_stage,
            )
            db.add(record)
            db.commit()
            db.refresh(record)
            analysis_id = str(record.id)

            if objections:
                for obj_text in objections:
                    if isinstance(obj_text, str) and obj_text.strip():
                        db.add(Objection(
                            call_id=record.id,
                            objection_type=obj_text.strip(),
                        ))
                db.commit()
        except Exception:
            db.rollback()
            analysis_id = None
        finally:
            db.close()

        budget = analysis.get("preferences", {}).get("budgetValue")
        location = analysis.get("preferences", {}).get("location")

        tasks[task_id]["step"] = 4
        tasks[task_id]["status"] = "complete"
        tasks[task_id]["data"] = {
            "transcription": transcript,
            "sentiment": analysis.get("sentiment", {}),
            "nextActions": analysis.get("nextActions", []),
            "preferences": analysis.get("preferences", {}),
            "summary": summary_text,
            "customerStatus": buyer_stage,
            "objections": objections,
            "analysisId": analysis_id,
            "budget": budget,
            "location": location,
        }

    except Exception as e:
        tasks[task_id]["status"] = "error"
        tasks[task_id]["error"] = str(e)
