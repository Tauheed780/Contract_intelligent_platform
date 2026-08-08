from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Optional
from app.services.contract_analyzer import ContractAnalyzer
from app.services.qa_service import QAService
from app.api.models import (
    UploadResponse, 
    QuestionRequest, 
    QuestionResponse
)
import tempfile
import os
import asyncio  

router = APIRouter()
contract_analyzer = ContractAnalyzer()
qa_service = QAService()


analysis_store = {}

@router.post("/upload", response_model=UploadResponse)
async def upload_contract(file: UploadFile = File(...)):
    try:
        if not file.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )
        
        content = await file.read()
        
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds 10MB limit"
            )
        
        analysis_result = await contract_analyzer.analyze_contract(
            content, 
            file.filename
        )
        
        analysis_store[analysis_result["file_info"]["file_id"]] = analysis_result
        
        return UploadResponse(
            file_id=analysis_result["file_info"]["file_id"],
            filename=analysis_result["file_info"]["filename"],
            page_count=analysis_result["file_info"]["page_count"],
            file_size=analysis_result["file_info"]["file_size"],
            status="completed"
        )
        
    except HTTPException:
        # Preserve expected client errors, such as an unsupported file type.
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Upload processing failed: {str(e)}"
        )

@router.get("/analysis/{file_id}")
async def get_analysis(file_id: str):
    if file_id not in analysis_store:
        raise HTTPException(
            status_code=404,
            detail="File not found or analysis not completed"
        )
    
    return JSONResponse(
        content=analysis_store[file_id],
        status_code=200
    )

@router.post("/ask", response_model=QuestionResponse)
async def ask_question(request: QuestionRequest):
    try:
        contract_text = request.contract_text
        
        if not contract_text and request.file_id:
            if request.file_id in analysis_store:
                contract_text = analysis_store[request.file_id]["full_text"]
        
        if not contract_text:
            raise HTTPException(
                status_code=400,
                detail="Contract text or file_id must be provided"
            )
        
        answer_data = await qa_service.answer_question(
            contract_text,
            request.question
        )
        
        return QuestionResponse(
            question=answer_data["question"],
            answer=answer_data["answer"],
            sources=answer_data["sources"],
            confidence=answer_data["confidence"],
            timestamp=answer_data["timestamp"]
        )
        
    except HTTPException:
        # Preserve validation errors raised above instead of turning them into 500s.
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Q&A service error: {str(e)}"
        )

@router.get("/qa-history")
async def get_qa_history():
    return JSONResponse(
        content={"history": qa_service.get_qa_history()},
        status_code=200
    )

@router.delete("/analysis/{file_id}")
async def delete_analysis(file_id: str):
    if file_id not in analysis_store:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )
    
    del analysis_store[file_id]
    
    return JSONResponse(
        content={"status": "deleted", "file_id": file_id},
        status_code=200
    )

@router.get("/health")
async def health_check():
    return {"status": "healthy", "service": "contract-analyser"}
