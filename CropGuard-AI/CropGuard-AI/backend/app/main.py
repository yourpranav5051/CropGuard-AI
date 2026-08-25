from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import engine, Base
from app.routers import auth_router, scan_router

# Creates cropguard.db + tables on first run. For schema changes later,
# switch to Alembic migrations instead of relying on create_all.
Base.metadata.create_all(bind=engine)

app = FastAPI(title="CropGuard AI", version="0.1.0")

# Wide-open CORS for local dev / demo day. Tighten allow_origins before
# any real deployment.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router.router)
app.include_router(scan_router.router)


@app.get("/")
def root():
    return {"status": "CropGuard AI backend running"}
