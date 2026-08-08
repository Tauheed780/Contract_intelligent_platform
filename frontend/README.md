# Frontend README

This frontend provides the user interface for the Contract Analyzer app. It allows users to upload contract PDFs, view AI-generated analysis, and ask questions about the document.

## Overview

The app is built with React and includes:

- A contract upload workflow
- Analysis tabs for summary, clause review, and risk flags
- A Q&A section for document-based conversations
- Toast notifications and a responsive layout

## Tech Stack

- React 18
- React Router DOM
- Tailwind CSS
- Axios
- React Dropzone
- Lucide React
- React Hot Toast
- Framer Motion
- Date-fns

## Project Structure

```text
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Analysis/
│   │   │   ├── ClauseChecklist.js
│   │   │   ├── ContractAnalysis.js
│   │   │   ├── RiskFlags.js
│   │   │   └── SummarySection.js
│   │   ├── Layout/
│   │   │   ├── Footer.js
│   │   │   └── Navbar.js
│   │   ├── Q&A/
│   │   │   └── QASection.js
│   │   └── Upload/
│   │       ├── FileUpload.js
│   │       └── UploadProgress.js
│   ├── context/
│   │   └── AppContext.js
│   ├── services/
│   │   ├── api.js
│   │   └── contractService.js
│   ├── utils/
│   │   ├── helpers.js
│   │   └── validators.js
│   ├── App.js
│   ├── index.css
│   └── index.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── README.md
```

## Prerequisites

Before running the frontend, make sure you have:

- Node.js 18+
- npm or yarn
- The backend running at http://localhost:8000

## Installation

From the project root:

```bash
cd frontend
npm install
```

## Development Server

Start the React app:

```bash
npm start
```

The app should open at:

- http://localhost:3000

## Environment Notes

The frontend is configured with a proxy to the backend:

```json
"proxy": "http://localhost:8000"
```

## Usage Flow

1. Start the backend API
2. Launch the frontend
3. Upload a contract PDF
4. Review the generated analysis
5. Ask questions in the Q&A section

## Notes

- The UI expects analysis data from the backend before enabling the analysis and Q&A tabs.
- Make sure the backend is running and reachable before using the app.
