# CropGuard AI — MVP

SIH 2026 submission. Early detection and management of crop diseases and pest infestations.

This is the trimmed **MVP scope**: a working demo of the core loop —

```
Home → Login/Register → Dashboard → Upload Crop Image → AI Analysis → Result + Recommendation
```

Weather risk, pest reporting, hotspot maps, multilingual support, expert
verification, and the government dashboard are documented in
`SIH_project_step.pdf` as the full vision but are **deferred to post-MVP
phases** — they're not built here so the demo stays reliable end-to-end.

## Stack (trimmed for demo reliability)

| Part | Tech |
|---|---|
| Frontend | Plain HTML/CSS/JS |
| Backend | Python FastAPI (single service — no separate Java layer for the demo) |
| Database | SQLite (swap the URL in `backend/app/database.py` for Postgres/MySQL later) |
| Auth | JWT (python-jose + passlib/bcrypt) |
| AI | Dummy inference now (`ai-model/inference.py`); swap in a real PlantVillage-trained model later without touching any other file |

> The original plan's Java Spring Boot + MySQL layer is a good Phase 2+
> addition if the problem statement specifically calls for an enterprise
> Java stack — see the "Important Advice" notes in the source PDF.

## Folder structure

```
CropGuard-AI/
├── frontend/
│   ├── index.html          Home / landing page
│   ├── login.html
│   ├── register.html
│   ├── dashboard.html      Stats + scan history
│   ├── scan.html           Upload + analyze
│   ├── result.html         Disease result + recommendation
│   ├── css/style.css
│   └── js/api.js           API base URL + fetch helpers
├── backend/
│   ├── app/
│   │   ├── main.py         FastAPI entrypoint
│   │   ├── database.py     SQLite/SQLAlchemy setup
│   │   ├── auth.py         JWT + password hashing
│   │   ├── schemas.py      Pydantic request/response models
│   │   ├── models/models.py  DB tables: users, disease_reports
│   │   └── routers/
│   │       ├── auth_router.py   /api/auth/register, /api/auth/login
│   │       └── scan_router.py   /api/scan/analyze, /api/scan/history
│   ├── uploads/             Uploaded crop images land here
│   └── requirements.txt
└── ai-model/
    └── inference.py         Dummy predictor — swap for a real model later
```

## Running it locally

**1. Backend**

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Backend runs at `http://127.0.0.1:8000`. Interactive API docs at
`http://127.0.0.1:8000/docs`.

**2. Frontend**

```bash
cd frontend
python -m http.server 5500
```

Open `http://127.0.0.1:5500/index.html` in your browser.

> If you deploy the backend somewhere else, update `API_BASE` in
> `frontend/js/api.js` — it's the only place the URL is hardcoded.

## What's already tested

Register → Login → JWT auth → image upload → dummy AI analysis → saved
report → dashboard history: verified working end-to-end via curl during
development.

## Next steps (post-MVP, per the original roadmap)

- Swap `ai-model/inference.py` dummy logic for a real model (PlantVillage
  dataset + fine-tuned MobileNet/ResNet is a fast starting point)
- Weather risk prediction (temperature/humidity/rainfall + crop → risk score)
- Pest reporting with location data
- CropMitra AI assistant chatbot
- Disease hotspot map (Leaflet.js + OpenStreetMap)
- Government dashboard for officials
- Multilingual support (English, Marathi, Hindi)
- Early warning system for report clusters
- Expert verification queue for low-confidence predictions
- Deploy: Render/Railway (backend) + Vercel/Netlify or static hosting (frontend)
