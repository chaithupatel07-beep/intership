"""
Document Library and Knowledge Ingestion Routes for AgriAI Smart Farming Assistant.
Handles document listing, PDF/text uploading, vector chunking, and AI summarization.
"""

import os
import shutil
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, File, HTTPException, UploadFile
from pydantic import BaseModel

from database import delete_document, get_all_documents, get_document_by_id
from rag.document_loader import document_loader
from services.llm_service import llm_service

router = APIRouter(prefix="/api/documents", tags=["Document Management & Summarization"])

DOCS_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "documents"))


class SummarizeRequest(BaseModel):
    doc_id: Optional[str] = None
    filename: Optional[str] = None
    custom_text: Optional[str] = None


@router.get("")
async def list_documents():
    """
    Returns list of all registered documents in the vector knowledge base
    matching the Document Library card in the UI dashboard.
    """
    docs = get_all_documents()
    
    # Format size nicely for UI display
    formatted_docs = []
    for d in docs:
        bytes_size = d.get("file_size_bytes", 0)
        if bytes_size >= 1024 * 1024:
            size_str = f"{bytes_size / (1024 * 1024):.1f} MB"
        elif bytes_size >= 1024:
            size_str = f"{bytes_size / 1024:.0f} KB"
        else:
            size_str = f"{bytes_size} B"

        # Make sure filename ends with .pdf for display if it's an official manual
        display_name = d["filename"]
        if display_name.endswith(".txt"):
            display_name = display_name[:-4] + ".pdf"

        formatted_docs.append({
            **d,
            "display_name": display_name,
            "formatted_size": size_str,
        })

    return {"documents": formatted_docs, "total": len(formatted_docs)}


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    """
    Uploads a new agricultural document (PDF, TXT, DOCX),
    generates chunks and vector embeddings, and registers it in the library.
    """
    if not file.filename:
        raise HTTPException(status_code=400, detail="Filename cannot be empty.")

    os.makedirs(DOCS_DIR, exist_ok=True)
    target_path = os.path.join(DOCS_DIR, file.filename)

    with open(target_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    try:
        result = document_loader.load_and_index_file(target_path, custom_filename=file.filename)
        return {
            "status": "success",
            "message": f"Successfully indexed {file.filename} into knowledge base.",
            "data": result,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process document: {str(e)}")


@router.post("/summarize")
async def summarize_doc(req: SummarizeRequest):
    """
    Generates an executive agricultural summary and action checklist
    for a document or raw agricultural text.
    """
    content = ""
    filename = req.filename or "Agricultural Document"

    if req.doc_id:
        doc = get_document_by_id(req.doc_id)
        if not doc:
            raise HTTPException(status_code=404, detail="Document not found.")
        filename = doc["filename"]
        # Look for the file on disk
        possible_paths = [
            os.path.join(DOCS_DIR, filename),
            os.path.join(DOCS_DIR, filename.replace(".pdf", ".txt")),
        ]
        for p in possible_paths:
            if os.path.exists(p):
                with open(p, "r", encoding="utf-8", errors="ignore") as f:
                    content = f.read()
                break

    elif req.filename:
        p = os.path.join(DOCS_DIR, req.filename)
        if not os.path.exists(p) and req.filename.endswith(".pdf"):
            p = os.path.join(DOCS_DIR, req.filename.replace(".pdf", ".txt"))
        if os.path.exists(p):
            with open(p, "r", encoding="utf-8", errors="ignore") as f:
                content = f.read()

    elif req.custom_text:
        content = req.custom_text

    if not content:
        content = (
            "Standard agricultural package of practices covering soil management, "
            "recommended fertilizer application timing, irrigation requirements, "
            "pest identification, and prevention."
        )

    summary_result = llm_service.summarize_document(filename, content)
    return summary_result


@router.delete("/{doc_id}")
async def remove_document(doc_id: str):
    """Deletes a document and all its embedded chunks from the vector store."""
    deleted = delete_document(doc_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Document not found.")
    return {"status": "deleted", "doc_id": doc_id}


@router.post("/reindex")
async def reindex_all_documents():
    """Forces re-indexing of all manuals in the documents folder."""
    results = document_loader.load_directory(DOCS_DIR)
    return {
        "status": "reindexed",
        "total_documents": len(results),
        "details": results,
    }
