# Callio

**sixth-sense-callio** — an AI-powered CRM for real estate agents with WhatsApp integration, call transcription, and intelligent lead analysis.

## Description

Callio helps real estate agents manage leads, communicate via WhatsApp, and analyze sales calls using AI. Key features:

- **Lead Management**: Track customers with status, budget, location, and remarks. Sync from Google Sheets or add manually.
- **WhatsApp Integration**: Connect your WhatsApp account, view chat history, send messages, and get AI-generated reply drafts.
- **Call Analysis**: Upload call recordings → transcribe via Gemini AI → extract sentiment, buyer stage, objections, preferences, and next actions.
- **AI Insights**: Automatic buyer stage classification (Awareness → Ready to close), sentiment scoring, objection tracking.
- **Dashboards**: Agent dashboard (daily calls, leads, follow-ups, appointments) + Team Leader dashboard (team performance, agent rankings).
- **Google Sheets Sync**: Import/export customer data to keep spreadsheets in sync.

Built for real estate teams who want to close more deals with less manual work.

## Installation

This is a multi-service monorepo. Each service runs independently.

### Prerequisites

- Node.js 18+ (for frontend and whatsapp-service)
- Python 3.12.7 (for backend)
- PostgreSQL 14+
- Google Cloud account (for Firebase, Gemini, Google Sheets)
- WhatsApp account (for whatsapp-service)

### Backend (FastAPI)

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv myenv
myenv\Scripts\activate  # Windows
# source myenv/bin/activate  # Linux/Mac

# Install dependencies
pip install -r requirements.txt

# Set up environment variables (create backend/.env)
# DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME
# FIREBASE_PROJECT_ID
# GEMINI_API_KEY

# Set up Google Sheets credentials
# Place your service account JSON at backend/sheets_credentials.json

# Set up Firebase Admin SDK (Application Default Credentials)
gcloud auth application-default login

# Run the server
uvicorn main:app --reload
```

Backend runs on `http://localhost:8000`.

### Frontend (Vite + React)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Set up environment variables (create frontend/.env)
# VITE_API_URL=http://localhost:8000
# VITE_FIREBASE_API_KEY, VITE_FIREBASE_AUTH_DOMAIN, VITE_FIREBASE_PROJECT_ID
# VITE_FIREBASE_STORAGE_BUCKET, VITE_FIREBASE_MESSAGING_SENDER_ID, VITE_FIREBASE_APP_ID

# Run dev server
npm run dev
```

Frontend runs on `http://localhost:5173`.

### WhatsApp Service (Express + whatsapp-web.js)

```bash
# Navigate to whatsapp-service
cd whatsapp-service

# Install dependencies
npm install

# Run the service
npm start
```

WhatsApp service runs on `http://localhost:3001`. On first run, scan the QR code in the terminal to link your WhatsApp account.

**Important**: All three services must run on their default ports (5173, 3001, 8000) because they hard-code each other's addresses.

## Usage

### Getting Started

1. **Start all three services** (backend, frontend, whatsapp-service) in separate terminals.
2. **Open the frontend** at `http://localhost:5173`.
3. **Register or log in** using Firebase Auth (email/password or Google sign-in).
4. **Connect WhatsApp** (optional): Go to Profile Settings → Social → Connect WhatsApp. Scan the QR code.
5. **Sync customers from Google Sheets** (optional): Go to Profile Settings → Sheets → enter your Google Sheets ID → Sync.

### Core Workflows

**Managing Leads**:

- View all customers on the Home page.
- Update lead status (e.g., "follow-up", "appointment", "closed").
- Click a lead to see details, remarks, and speech analysis results.

**WhatsApp Messaging**:

- Go to a lead's detail page → WhatsApp tab.
- View chat history, send messages, or generate AI reply drafts.
- Edit AI drafts before sending.

**Call Analysis**:

- Go to the Speech page.
- Upload a call recording (WAV, MP3, M4A, OGG, FLAC, WebM).
- Review the transcription, then approve to trigger AI analysis.
- View extracted insights: buyer stage, sentiment, objections, preferences, next actions.
- Add analysis results to a customer's remarks.

**Dashboards**:

- **Agent Dashboard**: See your daily calls, total leads, pending follow-ups, appointments, daily call trends, top regions, and common objections.
- **Team Leader Dashboard** (team leads only): View team-wide stats and individual agent performance.

### Deployment

Frontend deploys to Firebase Hosting:

```bash
cd frontend
npm run build
firebase deploy
```

Backend and whatsapp-service can be deployed to any Node/Python hosting (e.g., Google Cloud Run, Railway, Render).

## Tech Stack

**Backend**:

- FastAPI, SQLAlchemy, PostgreSQL
- Firebase Admin SDK (auth)
- LangChain + Google Gemini (AI analysis)
- Google Cloud Speech (transcription)
- gspread (Google Sheets integration)

**Frontend**:

- React 19, Vite, React Router
- Tailwind CSS v4, daisyUI v5
- Firebase client SDK
- Recharts, Chart.js (dashboards)
- Axios

**WhatsApp Service**:

- Express 5, whatsapp-web.js (Puppeteer-based)
- CORS restricted to frontend origin

## Project Structure

```
.
├── backend/              # FastAPI server
│   ├── main.py          # Entry point
│   ├── routers/         # API endpoints
│   ├── models/          # SQLAlchemy models
│   ├── schemas/         # Pydantic schemas
│   ├── services/        # Business logic (AI, WhatsApp, Sheets)
│   └── core/            # Firebase Admin setup
├── frontend/            # Vite + React SPA
│   ├── src/
│   │   ├── pages/       # Route pages
│   │   ├── components/  # Reusable UI
│   │   ├── hooks/       # Custom hooks (useAuth)
│   │   └── services/    # API clients
│   └── firebase.json    # Firebase Hosting config
└── whatsapp-service/    # Express + whatsapp-web.js
    └── src/
        ├── index.js     # Entry point
        ├── routes/      # WhatsApp endpoints
        └── whatsapp.js  # WhatsApp client logic
```

## Environment Variables

**Backend** (`backend/.env`):

- `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`, `DB_NAME` — PostgreSQL connection
- `FIREBASE_PROJECT_ID` — Firebase project ID
- `GEMINI_API_KEY` — Google Gemini API key

**Frontend** (`frontend/.env`):

- `VITE_API_URL` — Backend URL (default: `http://localhost:8000`)
- `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`, `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID` — Firebase client config

**WhatsApp Service**: No env vars required (uses default port 3001).

## Troubleshooting

**WhatsApp won't connect**:

- Ensure whatsapp-service is running on port 3001.
- Check that `.wwebjs_auth/` exists (session persisted after first QR scan).
- Delete `.wwebjs_auth/` and restart to re-link.

**Backend can't connect to database**:

- Verify PostgreSQL is running and credentials in `.env` are correct.
- Database is auto-created on first run if it doesn't exist.

**Frontend shows "Network Error"**:

- Ensure backend is running on port 8000.
- Check `VITE_API_URL` in `frontend/.env`.

**Gemini API errors**:

- Verify `GEMINI_API_KEY` is set in `backend/.env`.
- Check Google Cloud project has Gemini API enabled.

---

# Editing this README

When you're ready to make this README your own, just edit this file and use the handy template below (or feel free to structure it however you want - this is just a starting point!). Thanks to [makeareadme.com](https://www.makeareadme.com/) for this template.
