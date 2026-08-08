from typing import Dict, Any, List
from app.core.pdf_processor import PDFProcessor
from app.core.llm_service import LLMService
import asyncio

class ContractAnalyzer:
    def __init__(self):
        self.pdf_processor = PDFProcessor()
        self.llm_service = LLMService()
    
    async def analyze_contract(self, file_content: bytes, filename: str) -> Dict[str, Any]:
        try:
            pdf_data = await self.pdf_processor.save_pdf(file_content, filename)
            contract_text = pdf_data["full_text"]
            
            # Run analyses in parallel
            summary_task = self.llm_service.generate_summary(contract_text)
            checklist_task = self.llm_service.generate_clause_checklist(contract_text)
            risks_task = self.llm_service.identify_risk_flags(contract_text)
            
            summary, checklist, risks = await asyncio.gather(
                summary_task,
                checklist_task,
                risks_task
            )
            
            return {
                "file_info": {
                    "file_id": pdf_data["file_id"],
                    "filename": pdf_data["filename"],
                    "page_count": pdf_data["page_count"],
                    "file_size": pdf_data["file_size"]
                },
                "analysis": {
                    "summary": summary,
                    "clause_checklist": checklist,
                    "risk_flags": risks
                },
                "full_text": contract_text,
                "pages": pdf_data["pages"],
                "timestamp": asyncio.get_event_loop().time()
            }
            
        except Exception as e:
            raise Exception(f"Contract analysis failed: {str(e)}")