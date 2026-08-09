from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from app.api.routes import router
from app.core.config import settings
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Contract Analyzer API",
    description="AI-powered contract analysis and Q&A system",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", 
                   "http://localhost:3001", 
                   "https://contract-intelligent-platform.vercel.app/" # Your future Vercel URL
                   ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(
    TrustedHostMiddleware,
    allowed_hosts=["*"]
)

app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Contract Analyzer API",
        "version": "1.0.0",
        "endpoints": {
            "upload": "/api/v1/upload",
            "analysis": "/api/v1/analysis/{file_id}",
            "ask": "/api/v1/ask",
            "qa_history": "/api/v1/qa-history",
            "health": "/api/v1/health"
        }
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )