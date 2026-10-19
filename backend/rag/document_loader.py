"""
Document Loader and Preprocessor for AgriAI Smart Farming Assistant.
Extracts text from files, breaks documents into semantically coherent chunks,
estimates page boundaries, generates vector embeddings, and registers records in the database.
"""

import os
import re
import uuid
from typing import Any, Dict, List, Optional

from database import save_chunks, save_document
from rag.embeddings import embeddings_service


class DocumentLoader:
    def __init__(self, chunk_size: int = 700, chunk_overlap: int = 120):
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap

    def load_and_index_file(
        self, file_path: str, custom_filename: Optional[str] = None
    ) -> Dict[str, Any]:
        """Loads a file from disk, chunks it, generates embeddings, and saves to database."""
        if not os.path.exists(file_path):
            raise FileNotFoundError(f"File not found: {file_path}")

        filename = custom_filename or os.path.basename(file_path)
        file_size = os.path.getsize(file_path)
        ext = os.path.splitext(filename)[1].lower().replace(".", "") or "txt"

        content = self._read_file_content(file_path, ext)
        doc_id = str(uuid.uuid5(uuid.NAMESPACE_DNS, filename))

        chunks = self.chunk_text(content, doc_id=doc_id, filename=filename)

        # Batch embed all chunks
        texts = [c["content"] for c in chunks]
        embeddings = embeddings_service.get_batch_embeddings(texts)
        for i, emb in enumerate(embeddings):
            chunks[i]["embedding"] = emb

        # Generate a brief summary of the document (first 300 characters or key sections)
        summary = self._extract_summary(content)

        # Save to database
        doc_record = {
            "id": doc_id,
            "filename": filename,
            "file_type": ext,
            "file_size_bytes": file_size,
            "chunk_count": len(chunks),
            "summary": summary,
            "status": "ready",
        }
        save_document(doc_record)
        save_chunks(chunks)

        return {
            "document": doc_record,
            "chunks_indexed": len(chunks),
        }

    def load_directory(self, dir_path: str) -> List[Dict[str, Any]]:
        """Indexes all supported documents inside a directory."""
        if not os.path.exists(dir_path):
            return []

        results = []
        for root, _, files in os.walk(dir_path):
            for file in files:
                if file.lower().endswith((".txt", ".md", ".pdf", ".json", ".csv")):
                    full_path = os.path.join(root, file)
                    try:
                        res = self.load_and_index_file(full_path, custom_filename=file)
                        results.append(res)
                    except Exception as e:
                        print(f"Error indexing {file}: {e}")
        return results

    def chunk_text(
        self, text: str, doc_id: str, filename: str
    ) -> List[Dict[str, Any]]:
        """
        Splits text into contextual chunks.
        Preserves Markdown headers (## Section) as section titles
        and assigns estimated page numbers (approx 1500 chars/page).
        """
        sections = re.split(r"(^##\s+.*$)", text, flags=re.MULTILINE)
        raw_blocks: List[Dict[str, str]] = []

        current_heading = "General Overview"
        buffer_text = ""

        for part in sections:
            part_strip = part.strip()
            if part_strip.startswith("## "):
                if buffer_text:
                    raw_blocks.append(
                        {"heading": current_heading, "text": buffer_text}
                    )
                    buffer_text = ""
                current_heading = part_strip.replace("## ", "").strip()
            else:
                buffer_text += "\n" + part

        if buffer_text:
            raw_blocks.append({"heading": current_heading, "text": buffer_text})

        chunks: List[Dict[str, Any]] = []
        chunk_idx = 0
        char_cumulative = 0

        for block in raw_blocks:
            heading = block["heading"]
            block_text = block["text"].strip()
            if not block_text:
                continue

            # If block text is small enough, make single chunk
            if len(block_text) <= self.chunk_size:
                char_cumulative += len(block_text)
                estimated_page = max(1, (char_cumulative // 1500) + 1)
                chunk_id = f"{doc_id}_chunk_{chunk_idx}"
                chunks.append(
                    {
                        "id": chunk_id,
                        "doc_id": doc_id,
                        "filename": filename,
                        "chunk_index": chunk_idx,
                        "page_number": estimated_page,
                        "section_title": heading,
                        "content": f"[{heading}]\n{block_text}",
                    }
                )
                chunk_idx += 1
            else:
                # Sliding window split on sentences/paragraphs
                paragraphs = [p.strip() for p in block_text.split("\n\n") if p.strip()]
                curr_chunk = ""
                for p in paragraphs:
                    if len(curr_chunk) + len(p) + 2 <= self.chunk_size:
                        curr_chunk += ("\n\n" if curr_chunk else "") + p
                    else:
                        if curr_chunk:
                            char_cumulative += len(curr_chunk)
                            estimated_page = max(1, (char_cumulative // 1500) + 1)
                            chunk_id = f"{doc_id}_chunk_{chunk_idx}"
                            chunks.append(
                                {
                                    "id": chunk_id,
                                    "doc_id": doc_id,
                                    "filename": filename,
                                    "chunk_index": chunk_idx,
                                    "page_number": estimated_page,
                                    "section_title": heading,
                                    "content": f"[{heading}]\n{curr_chunk}",
                                }
                            )
                            chunk_idx += 1
                        curr_chunk = p

                if curr_chunk:
                    char_cumulative += len(curr_chunk)
                    estimated_page = max(1, (char_cumulative // 1500) + 1)
                    chunk_id = f"{doc_id}_chunk_{chunk_idx}"
                    chunks.append(
                        {
                            "id": chunk_id,
                            "doc_id": doc_id,
                            "filename": filename,
                            "chunk_index": chunk_idx,
                            "page_number": estimated_page,
                            "section_title": heading,
                            "content": f"[{heading}]\n{curr_chunk}",
                        }
                    )
                    chunk_idx += 1

        return chunks

    def _read_file_content(self, file_path: str, ext: str) -> str:
        """Reads content from text or binary file formats."""
        if ext in ("txt", "md", "json", "csv"):
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()
        elif ext == "pdf":
            # Check if pypdf or PyPDF2 is available, otherwise extract plaintext streams
            try:
                import pypdf
                reader = pypdf.PdfReader(file_path)
                return "\n\n".join(
                    [
                        page.extract_text()
                        for page in reader.pages
                        if page.extract_text()
                    ]
                )
            except Exception:
                # Fallback to UTF-8/ASCII extraction
                with open(file_path, "rb") as f:
                    raw = f.read()
                # Basic string extraction
                printable = re.findall(rb"[\x20-\x7E\t\n\r]{4,}", raw)
                return "\n".join([p.decode("latin1", errors="ignore") for p in printable])
        else:
            with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
                return f.read()

    def _extract_summary(self, text: str) -> str:
        lines = [line.strip() for line in text.split("\n") if line.strip() and not line.startswith("#")]
        if lines:
            preview = " ".join(lines[:3])
            return preview[:280] + ("..." if len(preview) > 280 else "")
        return "Agricultural guidance manual containing agronomic practices and advisory."


# Global singleton loader instance
document_loader = DocumentLoader()
