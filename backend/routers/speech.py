import os
import uuid
import asyncio

from fastapi import APIRouter, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from database import SessionLocal
from models.customer import Customers
from services.audio_service import transcribe_audio, analyze_transcript

router = APIRouter(prefix="/speech", tags=["Speech"])

AUDIO_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "audio_files")
os.makedirs(AUDIO_DIR, exist_ok=True)

tasks = {}


@router.post("/transcribe")
async def transcribe(
    file: UploadFile = File(...),
    customer_id: str = Form(None),
):
    ext = os.path.splitext(file.filename or "audio.wav")[1] or ".wav"
    unique_name = f"{uuid.uuid4()}{ext}"
    file_path = os.path.join(AUDIO_DIR, unique_name)

    contents = await file.read()
    with open(file_path, "wb") as f:
        f.write(contents)

    task_id = str(uuid.uuid4())
    tasks[task_id] = {
        "step": 0,
        "status": "processing",
        "audio_url": f"/audio/{unique_name}",
        "filename": file.filename,
        "customer_id": customer_id,
        "data": None,
    }

    asyncio.create_task(_process(task_id, file_path))

    return {"task_id": task_id}


@router.get("/status/{task_id}")
async def get_status(task_id: str):
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task


@router.post("/pipeline/{task_id}")
async def add_to_pipeline(task_id: str):
    task = tasks.get(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    if task["status"] != "complete":
        raise HTTPException(status_code=400, detail="Analysis not yet complete")
    if not task.get("customer_id"):
        raise HTTPException(status_code=400, detail="No customer associated")

    summary = task["data"].get("summary", {})
    if not summary:
        raise HTTPException(status_code=400, detail="No summary available")

    db: Session = SessionLocal()
    try:
        customer = (
            db.query(Customers)
            .filter(Customers.cust_id == task["customer_id"])
            .first()
        )
        if not customer:
            raise HTTPException(status_code=404, detail="Customer not found")

        from datetime import datetime

        customer.remarks = {
            "summary": summary,
            "lastAnalysis": datetime.utcnow().isoformat(),
        }
        db.commit()
        return {"success": True}
    finally:
        db.close()


async def _process(task_id: str, file_path: str):
    try:
        tasks[task_id]["step"] = 1
        await asyncio.sleep(0.1)
        transcript = await asyncio.to_thread(transcribe_audio, file_path)

        tasks[task_id]["step"] = 2
        await asyncio.sleep(0.1)

        tasks[task_id]["step"] = 3
        analysis = await asyncio.to_thread(analyze_transcript, transcript)

        tasks[task_id]["step"] = 4
        tasks[task_id]["status"] = "complete"
        tasks[task_id]["data"] = {
            "transcription": transcript,
            "sentiment": analysis.get("sentiment", {}),
            "nextActions": analysis.get("nextActions", []),
            "preferences": analysis.get("preferences", {}),
            "summary": analysis.get("summary", {}),
        }

    except Exception as e:
        tasks[task_id]["status"] = "error"
        tasks[task_id]["error"] = str(e)
