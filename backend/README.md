# Backend README

This directory contains the FastAPI backend for the Contract Analyzer platform.

## Overview

The backend is responsible for:

- Receiving uploaded contract files
- Extracting and processing document content
- Running AI-powered contract analysis
- Answering questions about the uploaded contract
- Exposing REST API endpoints for the frontend

## Project Structure

```text
backend/
├── app/
│   ├── api/
│   │   ├── models.py
│   │   └── routes.py
│   ├── core/
│   │   ├── config.py
│   │   ├── llm_service.py
│   │   └── pdf_processor.py
│   ├── services/
│   │   ├── contract_analyzer.py
│   │   └── qa_service.py
│   ├── utils/
│   │   └── validators.py
│   ├── main.py
│   └── __init__.py
├── requirements.txt
├── Dockerfile
├── docker-compose.yml
└── test_groq.py
```

## Requirements

Install the Python dependencies:

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Environment Variables

Create a `.env` file inside the `backend` folder with:

```env
GROQ_API_KEY=your_groq_api_key
GROQ_MODEL=llama-3.3-70b-versatile
```

## Running the API

Start the FastAPI server locally:

```bash
cd backend
uvicorn app.main:app --reload --port 8000
```

The API will be available at:

- http://localhost:8000
- http://localhost:8000/docs for Swagger UI

## Docker

Run the backend using Docker Compose:

```bash
cd backend
docker compose up --build
```

## Main API Endpoints

The backend exposes endpoints for:

- Uploading contracts
- Fetching analysis results
- Asking questions about contracts
- Health checks

## Notes

- Uploaded files are stored in the `uploads` directory.
- The backend uses Groq for AI-powered analysis and Q&A.
- Make sure the required environment variables are set before running the service.
