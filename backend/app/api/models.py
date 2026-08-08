# app/api/models.py
from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class UploadResponse(BaseModel):
    file_id: str
    filename: str
    page_count: int
    file_size: int
    status: str = "processing"
    
class ContractAnalysis(BaseModel):
    file_id: str
    analysis: Dict[str, Any]
    full_text: str
    timestamp: float
    
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
    
class RiskFlag(BaseModel):
    risk: str
    severity: str
    category: str
    recommendation: str
    
class ClauseCheck(BaseModel):
    clause_name: str
    present: bool
    quality: str
    notes: str
    
class ContractSummary(BaseModel):
    main_purpose: str
    key_parties: str
    core_obligations: str
    key_dates: str
    payment_terms: str
    duration: str
    critical_clauses: str