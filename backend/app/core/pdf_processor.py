# app/core/pdf_processor.py
import os
import uuid
from typing import List, Dict, Any
import pdfplumber
from PyPDF2 import PdfReader
from pathlib import Path
import hashlib

class PDFProcessor:
    def __init__(self, upload_dir: str = "./uploads"):
        self.upload_dir = Path(upload_dir)
        self.upload_dir.mkdir(exist_ok=True)
    
    async def save_pdf(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        """Save uploaded PDF and return metadata"""
        # Generate unique ID
        file_id = str(uuid.uuid4())
        safe_filename = f"{file_id}_{filename}"
        file_path = self.upload_dir / safe_filename
        
        # Save file
        with open(file_path, "wb") as f:
            f.write(file_content)
        
        # Extract text
        text_content = await self.extract_text_from_pdf(file_path)
        
        # Calculate hash
        file_hash = hashlib.md5(file_content).hexdigest()
        
        return {
            "file_id": file_id,
            "filename": filename,
            "file_path": str(file_path),
            "file_size": len(file_content),
            "file_hash": file_hash,
            "page_count": len(text_content["pages"]),
            "full_text": text_content["full_text"],
            "pages": text_content["pages"]
        }
    
    async def extract_text_from_pdf(self, file_path: Path) -> Dict[str, Any]:
        """Extract text from PDF with page-level granularity"""
        pages_text = []
        full_text = ""
        
        try:
            with pdfplumber.open(file_path) as pdf:
                for page in pdf.pages:
                    page_text = page.extract_text() or ""
                    pages_text.append({
                        "page_number": len(pages_text) + 1,
                        "text": page_text.strip()
                    })
                    full_text += page_text + "\n\n"
        except Exception as e:
            # Fallback to PyPDF2
            with open(file_path, 'rb') as file:
                reader = PdfReader(file)
                for page_num, page in enumerate(reader.pages):
                    page_text = page.extract_text() or ""
                    pages_text.append({
                        "page_number": page_num + 1,
                        "text": page_text.strip()
                    })
                    full_text += page_text + "\n\n"
        
        return {
            "full_text": full_text.strip(),
            "pages": pages_text
        }
    
    async def chunk_text(self, text: str, chunk_size: int = 2000) -> List[str]:
        """Split text into chunks for processing"""
        words = text.split()
        chunks = []
        current_chunk = []
        current_size = 0
        
        for word in words:
            if current_size + len(word) > chunk_size:
                chunks.append(" ".join(current_chunk))
                current_chunk = [word]
                current_size = len(word)
            else:
                current_chunk.append(word)
                current_size += len(word) + 1
        
        if current_chunk:
            chunks.append(" ".join(current_chunk))
        
        return chunks