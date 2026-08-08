from typing import Dict, Any, List
from app.core.llm_service import LLMService
import asyncio

class QAService:
    def __init__(self):
        self.llm_service = LLMService()
        self.qa_history = []
    
    async def answer_question(self, contract_text: str, question: str) -> Dict[str, Any]:
        try:
            answer_data = await self.llm_service.answer_question(contract_text, question)
            
            self.qa_history.append({
                "question": question,
                "answer": answer_data["answer"],
                "timestamp": asyncio.get_event_loop().time()
            })
            
            return answer_data
            
        except Exception as e:
            raise Exception(f"Q&A service error: {str(e)}")
    
    def get_qa_history(self) -> List[Dict[str, Any]]:
        return self.qa_history[-20:]