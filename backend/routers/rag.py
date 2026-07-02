from fastapi import APIRouter, File, UploadFile, HTTPException
from typing import List
from services.rag import process_and_store_pdf, delete_pdf_from_store, get_all_pdfs_from_store
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

@router.delete("/delete/{filename}")
async def delete_file(filename: str):
    try:
        deleted_count = delete_pdf_from_store(filename)
        return {"message": f"Successfully deleted {deleted_count} chunks for {filename}", "deleted_count": deleted_count}
    except Exception as e:
        logging.error(f"Error deleting {filename}: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/files")
async def get_files():
    try:
        files = get_all_pdfs_from_store()
        return {"files": [{"name": f} for f in files]}
    except Exception as e:
        logging.error(f"Error retrieving files: {e}")
        raise HTTPException(status_code=500, detail=str(e))
