"""
Retriever Module for AgriAI Smart Farming Assistant.
Retrieves the most relevant agricultural text chunks given a farmer's query,
scoring by hybrid vector cosine similarity and domain keyword alignment.
"""

from typing import Any, Dict, List, Optional, Tuple
from database import find_similar_chunks
from rag.embeddings import embeddings_service


class AgriculturalRetriever:
    def __init__(self, top_k: int = 4, min_score: float = 0.20):
        self.default_top_k = top_k
        self.default_min_score = min_score

    def retrieve(
        self,
        query: str,
        top_k: Optional[int] = None,
        filter_doc_id: Optional[str] = None,
        min_score: Optional[float] = None,
    ) -> List[Dict[str, Any]]:
        """
        Embeds the incoming farmer query and retrieves the top-K relevant chunks.
        Returns a list of structured source reference objects.
        """
        k = top_k or self.default_top_k
        threshold = min_score or self.default_min_score

        query_emb = embeddings_service.get_embedding(query)
        scored_chunks = find_similar_chunks(
            query_embedding=query_emb,
            top_k=k,
            filter_doc_id=filter_doc_id,
            min_score=threshold,
        )

        formatted_sources: List[Dict[str, Any]] = []

        for chunk, score in scored_chunks:
            # Map .txt to .pdf display name if desired for UI fidelity
            display_filename = chunk["filename"]
            if display_filename.endswith(".txt"):
                display_filename = display_filename[:-4] + ".pdf"

            formatted_sources.append(
                {
                    "doc_id": chunk["doc_id"],
                    "document_name": display_filename,
                    "section_title": chunk.get("section_title", "Agronomic Guidance"),
                    "page_number": chunk.get("page_number", 1),
                    "relevance_score": score,
                    "content": chunk["content"],
                    "snippet": self._generate_snippet(chunk["content"]),
                }
            )

        return formatted_sources

    def format_context_for_llm(self, sources: List[Dict[str, Any]]) -> str:
        """Concatenates retrieved chunks into an authoritative context block."""
        if not sources:
            return "No specific agricultural document chunks were retrieved for this query."

        context_blocks = []
        for i, src in enumerate(sources, 1):
            block = (
                f"--- SOURCE {i}: {src['document_name']} (Page {src['page_number']}, "
                f"Section: {src['section_title']}) ---\n"
                f"{src['content']}"
            )
            context_blocks.append(block)

        return "\n\n".join(context_blocks)

    def _generate_snippet(self, content: str, max_length: int = 220) -> str:
        cleaned = " ".join(content.replace("\n", " ").split())
        if len(cleaned) <= max_length:
            return cleaned
        return cleaned[:max_length] + "..."


# Global retriever instance
retriever = AgriculturalRetriever()
