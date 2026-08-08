import groq
from typing import List, Dict, Any
from app.core.config import settings
import json
import asyncio

class LLMService:
    def __init__(self):
        self.client = groq.Groq(api_key=settings.groq_api_key)
        self.model = settings.groq_model
        
    async def generate_summary(self, contract_text: str) -> Dict[str, Any]:
        """Generate a comprehensive contract summary using Groq"""
        prompt = f"""
        Analyze the following contract and provide a comprehensive summary including:
        1. Main Purpose: What is the primary objective of this contract?
        2. Key Parties: Who are the parties involved?
        3. Core Obligations: What are the main obligations of each party?
        4. Key Dates: Important dates (effective date, termination, renewal)
        5. Payment Terms: Financial arrangements and payment schedules
        6. Duration: Contract length and renewal conditions
        7. Critical Clauses: Any particularly important clauses
        
        Contract:
        {contract_text[:6000]}
        
        Provide the summary in a structured JSON format with these exact keys:
        main_purpose, key_parties, core_obligations, key_dates, payment_terms, duration, critical_clauses
        """
        
        try:
            # Groq uses synchronous calls, so we wrap in async
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a legal contract analyst. Provide structured, professional contract summaries in valid JSON format."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1500
            )
            
            summary_text = response.choices[0].message.content
            try:
                # Try to parse JSON from the response
                # Sometimes the response includes markdown code blocks
                summary_text = summary_text.strip()
                if summary_text.startswith('```json'):
                    summary_text = summary_text[7:]
                if summary_text.endswith('```'):
                    summary_text = summary_text[:-3]
                summary_data = json.loads(summary_text.strip())
                return summary_data
            except json.JSONDecodeError:
                # If not valid JSON, return as raw text
                return {"raw_summary": summary_text}
            
        except Exception as e:
            raise Exception(f"Error generating summary with Groq: {str(e)}")
    
    async def generate_clause_checklist(self, contract_text: str) -> List[Dict[str, Any]]:
        """Generate a checklist of important clauses using Groq"""
        prompt = f"""
        Review this contract and identify the presence and quality of key legal clauses.
        For each clause, determine if it's present, absent, or needs review.
        
        Contract:
        {contract_text[:5000]}
        
        Provide a structured list of clauses with:
        - clause_name: Name of the clause
        - present: boolean (true/false)
        - quality: "good", "needs_review", or "poor"
        - notes: Brief assessment
        
        Focus on these key clauses:
        1. Confidentiality
        2. Intellectual Property Rights
        3. Termination
        4. Indemnification
        5. Liability Limitations
        6. Governing Law
        7. Dispute Resolution
        8. Force Majeure
        9. Non-Compete
        10. Data Protection/Privacy
        
        Return ONLY valid JSON array. Do not include any other text.
        """
        
        try:
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a legal contract analyst. Return ONLY valid JSON. No other text."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.2,
                max_tokens=1200
            )
            
            checklist_text = response.choices[0].message.content.strip()
            # Clean up markdown if present
            if checklist_text.startswith('```json'):
                checklist_text = checklist_text[7:]
            if checklist_text.endswith('```'):
                checklist_text = checklist_text[:-3]
            
            try:
                checklist_data = json.loads(checklist_text)
                return checklist_data
            except json.JSONDecodeError:
                return [{"error": "Failed to parse checklist", "raw": checklist_text}]
                
        except Exception as e:
            raise Exception(f"Error generating checklist with Groq: {str(e)}")
    
    async def identify_risk_flags(self, contract_text: str) -> List[Dict[str, Any]]:
        """Identify and flag potential risks using Groq"""
        prompt = f"""
        Analyze this contract for potential risks and red flags. Focus on:
        1. Unfavorable terms
        2. Ambiguous language
        3. Missing protections
        4. Unbalanced obligations
        5. Financial risks
        6. Legal compliance issues
        
        Contract:
        {contract_text[:5000]}
        
        Provide a risk assessment with:
        - risk: Description of the risk
        - severity: "high", "medium", or "low"
        - category: Type of risk (e.g., "Legal", "Financial", "Operational")
        - recommendation: Suggested mitigation
        
        Return ONLY valid JSON array. Do not include any other text.
        """
        
        try:
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a risk assessment expert. Return ONLY valid JSON. No other text."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3,
                max_tokens=1200
            )
            
            risk_text = response.choices[0].message.content.strip()
            # Clean up markdown if present
            if risk_text.startswith('```json'):
                risk_text = risk_text[7:]
            if risk_text.endswith('```'):
                risk_text = risk_text[:-3]
            
            try:
                risk_data = json.loads(risk_text)
                return risk_data
            except json.JSONDecodeError:
                return [{"error": "Failed to parse risks", "raw": risk_text}]
                
        except Exception as e:
            raise Exception(f"Error identifying risks with Groq: {str(e)}")
    
    async def answer_question(self, context: str, question: str) -> Dict[str, Any]:
        """Answer a question grounded in the contract text using Groq"""
        prompt = f"""
        Based on the following contract text, answer the question accurately.
        If the answer cannot be found in the contract, say so explicitly.
        
        Contract Text:
        {context[:4000]}
        
        Question: {question}
        
        Provide:
        1. A direct answer to the question
        2. Relevant quotes from the contract (if applicable)
        3. Confidence level (high/medium/low)
        4. Section references if available
        
        Return in this format:
        {{
            "answer": "your answer here",
            "confidence": "high/medium/low",
            "sources": ["section references or quotes"]
        }}
        """
        
        try:
            response = await asyncio.to_thread(
                self.client.chat.completions.create,
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are a precise contract analyst. Only answer based on the provided text. Return valid JSON."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.1,
                max_tokens=800
            )
            
            answer_text = response.choices[0].message.content.strip()
            # Clean up markdown if present
            if answer_text.startswith('```json'):
                answer_text = answer_text[7:]
            if answer_text.endswith('```'):
                answer_text = answer_text[:-3]
            
            try:
                answer_data = json.loads(answer_text)
                return {
                    "question": question,
                    "answer": answer_data.get("answer", answer_text),
                    "sources": answer_data.get("sources", ["Contract text"]),
                    "confidence": answer_data.get("confidence", "medium"),
                    "timestamp": 0
                }
            except json.JSONDecodeError:
                # Fallback for non-JSON responses
                return {
                    "question": question,
                    "answer": answer_text,
                    "sources": ["Contract text"],
                    "confidence": "medium",
                    "timestamp": 0
                }
            
        except Exception as e:
            raise Exception(f"Error answering question with Groq: {str(e)}")