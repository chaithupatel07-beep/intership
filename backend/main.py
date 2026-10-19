"""
Main Application Entry Point for AgriAI Smart Farming Assistant Backend.
FastAPI application with CORS, RAG pipelines, dynamic vector store auto-indexing,
and agricultural services.
"""

import os
import sys

# Ensure current backend directory is in python sys.path
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
if BASE_DIR not in sys.path:
    sys.path.insert(0, BASE_DIR)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from database import get_all_documents, init_db
from rag.document_loader import document_loader
from routes.auth import router as auth_router
from routes.chat import router as chat_router
from routes.crops import router as crops_router
from routes.documents import router as documents_router

app = FastAPI(
    title="AgriAI - Smart Farming Assistant API",
    description="Retrieval-Augmented Generation (RAG) backend for crop recommendation, soil fertility, fertilizer dosage, pest control, and government schemes.",
    version="1.0.0",
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register Sub-Routers
app.include_router(auth_router)
app.include_router(chat_router)
app.include_router(crops_router)
app.include_router(documents_router)


@app.on_event("startup")
async def startup_event():
    """
    On application boot:
    1. Initialize SQLite / pgvector database schema.
    2. Check if documents/ directory has manuals. If DB is unindexed, automatically
       extract, chunk, embed, and index them so RAG works immediately.
    """
    print("[AgriAI Backend] Initializing database...")
    init_db()

    docs_dir = os.path.abspath(os.path.join(BASE_DIR, "..", "documents"))
    existing_docs = get_all_documents()

    if not existing_docs and os.path.exists(docs_dir):
        print(f"[AgriAI Backend] Ingesting agricultural manuals from {docs_dir}...")
        indexed = document_loader.load_directory(docs_dir)
        print(f"[AgriAI Backend] Successfully indexed {len(indexed)} documents into vector store.")
    else:
        print(f"[AgriAI Backend] Knowledge base ready. {len(existing_docs)} documents loaded.")


@app.get("/")
async def root():
    return {
        "app": "AgriAI - Smart Farming Assistant API",
        "status": "online",
        "docs_url": "/docs",
        "endpoints": [
            "/api/chat",
            "/api/chat/history",
            "/api/chat/recent-queries",
            "/api/chat/stats",
            "/api/crops/recommend",
            "/api/crops/fertilizer-calc",
            "/api/crops/pests",
            "/api/crops/schemes",
            "/api/crops/market-prices",
            "/api/crops/weather",
            "/api/crops/field-insights",
            "/api/documents",
            "/api/documents/upload",
            "/api/documents/summarize",
        ],
    }


@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "service": "agri-ai-backend"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
