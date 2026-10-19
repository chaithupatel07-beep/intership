"""
Chat and RAG Conversation Routes for AgriAI Smart Farming Assistant.
Handles interactive natural language agricultural Q&A, context retrieval,
source attribution, session history, and query logging.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from database import (
    get_chat_history,
    get_recent_queries,
    get_system_stats,
    log_recent_query,
    save_chat_message,
)
from rag.retriever import retriever
from services.llm_service import llm_service

router = APIRouter(prefix="/api/chat", tags=["Chat & RAG"])


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = "default_session"
    filter_doc_id: Optional[str] = None
    top_k: Optional[int] = 4


class ChatResponse(BaseModel):
    answer: str
    sources: List[Dict[str, Any]]
    followups: List[str]
    session_id: str
    timestamp: str
    model_used: str


@router.post("", response_model=ChatResponse)
async def handle_chat_query(req: ChatRequest):
    """
    Core RAG conversational endpoint.
    Retrieves authoritative agricultural document chunks and generates
    grounded responses with exact document and page citations.
    """
    user_query = req.message.strip()
    if not user_query:
        raise HTTPException(status_code=400, detail="Query message cannot be empty.")

    session_id = req.session_id or "default_session"

    # 1. Categorize query and log for recent queries feed
    category = "general"
    q_low = user_query.lower()
    if "fertilizer" in q_low or "urea" in q_low or "dap" in q_low or "npk" in q_low:
        category = "fertilizer"
    elif "pest" in q_low or "borer" in q_low or "disease" in q_low or "spray" in q_low:
        category = "pest"
    elif "water" in q_low or "irrigation" in q_low or "drip" in q_low:
        category = "irrigation"
    elif "scheme" in q_low or "kisan" in q_low or "subsidy" in q_low or "bima" in q_low:
        category = "scheme"
    elif "soil" in q_low or "ph" in q_low or "carbon" in q_low:
        category = "soil"

    log_recent_query(user_query, category)

    # 2. Save user message to persistent history
    save_chat_message(session_id=session_id, role="user", content=user_query)

    # 3. Retrieve grounding context from vector store
    sources = retriever.retrieve(
        query=user_query,
        top_k=req.top_k,
        filter_doc_id=req.filter_doc_id,
    )

    # 4. Generate grounded synthesis with citations
    history = get_chat_history(session_id=session_id, limit=6)
    result = llm_service.generate_rag_response(
        query=user_query,
        retrieved_sources=sources,
        chat_history=history,
    )

    # 5. Save assistant response and citations to history
    save_chat_message(
        session_id=session_id,
        role="assistant",
        content=result["answer"],
        sources=result["sources"],
    )

    return ChatResponse(
        answer=result["answer"],
        sources=result["sources"],
        followups=result.get("followups", []),
        session_id=session_id,
        timestamp=datetime.now().strftime("%I:%M %p"),
        model_used=result.get("model_used", "AgriAI-RAG"),
    )


@router.get("/history")
async def get_history(session_id: str = "default_session", limit: int = 50):
    """Returns conversational message history for the given session."""
    return {"history": get_chat_history(session_id, limit)}


@router.delete("/history")
async def clear_history(session_id: str = "default_session"):
    """Resets message history for the given session."""
    from database import get_db_connection

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM chat_messages WHERE session_id = ?", (session_id,))
    conn.commit()
    conn.close()
    return {"status": "cleared", "session_id": session_id}


@router.get("/recent-queries")
async def fetch_recent_queries(limit: int = 5):
    """Returns recent queries for the dashboard 'Recent Queries' card."""
    return {"recent_queries": get_recent_queries(limit)}


@router.get("/stats")
async def fetch_system_stats():
    """Returns system KPI counter metrics for the dashboard top bar."""
    return get_system_stats()
