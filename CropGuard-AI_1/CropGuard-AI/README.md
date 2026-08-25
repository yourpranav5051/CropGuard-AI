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
| Backend | Node.js + Express (single service — no separate Java layer for the demo) |
| Database | SQLite via better-sqlite3 (swap the driver in `backend/src/db.js` for Postgres/MySQL later) |
| Auth | JWT (jsonwebtoken + bcryptjs) |
| AI | Dummy inference now (`ai-model/inference.js`); swap in a real model later without touching any other file |

> The original plan's Java Spring Boot + MySQL layer is a good Phase 2+
> addition if the problem statement specifically calls for an enterprise
> Java stack — see the "Important Advice" notes in the source PDF.
> (An earlier FastAPI/Python version of this backend also exists in git
> history if you ever want to compare or revert.)

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
│   ├── server.js            Express entrypoint
│   ├── src/
│   │   ├── db.js             SQLite setup (better-sqlite3)
│   │   ├── auth.js           JWT signing + requireAuth middleware
│   │   └── routes/
│   │       ├── auth.js         POST /api/auth/register, /api/auth/login
│   │       └── scan.js         POST /api/scan/analyze, GET /api/scan/history
│   ├── uploads/              Uploaded crop images land here
│   └── package.json
└── ai-model/
    └── inference.js          Dummy predictor — swap for a real model later
```

## Running it locally

**1. Backend**

```bash
cd backend
npm install
node server.js
```

Backend runs at `http://127.0.0.1:8000`.

**2. Frontend**

```bash
cd frontend
python -m http.server 5500
```

(Any static file server works — e.g. `npx serve` if you'd rather stay
in the Node ecosystem.)

Open `http://127.0.0.1:5500/index.html` in your browser.

> If you deploy the backend somewhere else, update `API_BASE` in
> `frontend/js/api.js` — it's the only place the URL is hardcoded.

## What's already tested

Register → Login → JWT auth → image upload → dummy AI analysis → saved
report → dashboard history → rejected unauthenticated request: verified
working end-to-end via curl during development.

## Next steps (post-MVP, per the original roadmap)

- Swap `ai-model/inference.js` dummy logic for a real model (either an
  ONNX/TF.js model loaded directly in Node, or a small Python inference
  microservice called over HTTP from the Node backend)
- Weather risk prediction (temperature/humidity/rainfall + crop → risk score)
- Pest reporting with location data
- CropMitra AI assistant chatbot
- Disease hotspot map (Leaflet.js + OpenStreetMap)
- Government dashboard for officials
- Multilingual support (English, Marathi, Hindi)
- Early warning system for report clusters
- Expert verification queue for low-confidence predictions
- Deploy: Render/Railway (backend) + Vercel/Netlify or static hosting (frontend)
