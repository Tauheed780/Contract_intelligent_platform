from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router
import os

app = FastAPI(
    title="Contract Analyzer API",
    description="AI-powered contract analysis and Q&A system",
    version="1.0.0"
)

# Configure CORS - THIS IS THE FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://contract-intelligent-platform.vercel.app",  # Your Vercel URL
        "https://*.vercel.app",  # All Vercel previews
        "http://localhost:3000",  # Local development
    ],
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
    expose_headers=["*"],
)

# Include routes with /api/v1 prefix
app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Contract Analyzer API",
        "version": "1.0.0",
        "status": "running"
    }

@app.get("/api/v1/health")
async def health_check():
    return {"status": "healthy", "service": "contract-analyser"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=port
    )