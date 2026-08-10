from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any

class UploadResponse(BaseModel):
    file_id: str
    filename: str
    page_count: int
    file_size: int
    status: str = "processing"
    
class QuestionRequest(BaseModel):
    question: str = Field(..., description="Question about the contract")
    contract_text: Optional[str] = Field(None, description="Full contract text")
    file_id: Optional[str] = Field(None, description="Reference to uploaded file")
    
class QuestionResponse(BaseModel):
    question: str
    answer: str
    sources: List[str]
    confidence: str
    timestamp: float