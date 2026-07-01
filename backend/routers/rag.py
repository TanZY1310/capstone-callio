from fastapi import APIRouter, File, UploadFile, HTTPException
from typing import List
from services.rag import process_and_store_pdf
import logging

router = APIRouter(
    prefix="/rag",
    tags=["RAG"]
)

@router.post("/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    results = []
    for file in files:
        if not file.filename.lower().endswith('.pdf'):
            results.append({
                "filename": file.filename,
                "error": "Only PDF files are allowed",
                "status": "failed"
            })
            continue
            
        try:
            content = await file.read()
            chunks = process_and_store_pdf(content, file.filename)
            results.append({
                "filename": file.filename,
                "chunks": chunks,
                "status": "success"
            })
        except Exception as e:
            logging.error(f"Error processing {file.filename}: {e}")
            results.append({
                "filename": file.filename,
                "error": str(e),
                "status": "failed"
            })
            
    return {"message": "Files processed", "results": results}
