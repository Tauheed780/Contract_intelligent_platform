from fastapi import APIRouter, UploadFile, File, HTTPException, status
from fastapi.responses import JSONResponse
from typing import Optional
from app.services.contract_analyzer import ContractAnalyzer
from app.services.qa_service import QAService
from app.api.models import UploadResponse, QuestionRequest, QuestionResponse
import os
import asyncio

router = APIRouter()
contract_analyzer = ContractAnalyzer()
qa_service = QAService()

# Store analysis results (in production, use Redis or database)
analysis_store = {}

@router.post("/upload", response_model=UploadResponse)
async def upload_contract(file: UploadFile = File(...)):
    """Upload a PDF contract for analysis"""
    try:
        # Validate file type
        if not file.filename.endswith('.pdf'):
            raise HTTPException(
                status_code=400,
                detail="Only PDF files are allowed"
            )
        
        # Read file content
        content = await file.read()
        
        # Check file size (10MB limit)
        if len(content) > 10 * 1024 * 1024:
            raise HTTPException(
                status_code=400,
                detail="File size exceeds 10MB limit"
            )
        
        # Process the contract
        analysis_result = await contract_analyzer.analyze_contract(
            content, 
            file.filename
        )
        
        # Store for later retrieval
        file_id = analysis_result["file_info"]["file_id"]
        analysis_store[file_id] = analysis_result
        
        # Return response
        return UploadResponse(
            file_id=file_id,
            filename=analysis_result["file_info"]["filename"],
            page_count=analysis_result["file_info"]["page_count"],
            file_size=analysis_result["file_info"]["file_size"],
            status="completed"
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Upload processing failed: {str(e)}"
        )

@router.get("/analysis/{file_id}")
async def get_analysis(file_id: str):
    """Get complete analysis results for a contract"""
    if file_id not in analysis_store:
        raise HTTPException(
            status_code=404,
            detail="File not found or analysis not completed"
        )
    
    return JSONResponse(
        content=analysis_store[file_id],
        status_code=200
    )

@router.post("/ask")
async def ask_question(request: QuestionRequest):
    """Ask a question about a contract"""
    try:
        # Get contract text
        contract_text = request.contract_text
        
        if not contract_text and request.file_id:
            # Retrieve from store
            if request.file_id in analysis_store:
                contract_text = analysis_store[request.file_id]["full_text"]
        
        if not contract_text:
            raise HTTPException(
                status_code=400,
                detail="Contract text or file_id must be provided"
            )
        
        # Get answer
        answer_data = await qa_service.answer_question(
            contract_text,
            request.question
        )
        
        return JSONResponse(
            content=answer_data,
            status_code=200
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Q&A service error: {str(e)}"
        )

@router.get("/qa-history")
async def get_qa_history():
    """Get Q&A history for the current session"""
    return JSONResponse(
        content={"history": qa_service.get_qa_history()},
        status_code=200
    )

@router.delete("/analysis/{file_id}")
async def delete_analysis(file_id: str):
    """Delete a contract analysis"""
    if file_id not in analysis_store:
        raise HTTPException(
            status_code=404,
            detail="File not found"
        )
    
    # Remove from store
    del analysis_store[file_id]
    
    return JSONResponse(
        content={"status": "deleted", "file_id": file_id},
        status_code=200
    )

@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "contract-analyser"}