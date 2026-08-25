import os
import shutil
import sys
import uuid
from typing import List

from fastapi import APIRouter, Depends, UploadFile, File, Form, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import User, DiseaseReport
from app.schemas import DiseaseReportOut
from app.auth import get_current_user

# ai-model/ lives one level up from backend/ — see project root layout.
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "..", "..", "ai-model"))
from inference import predict  # noqa: E402

router = APIRouter(prefix="/api/scan", tags=["scan"])

UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png"}


@router.post("/analyze", response_model=DiseaseReportOut)
def analyze_crop_image(
    crop_name: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    ext = os.path.splitext(image.filename)[1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Only .jpg, .jpeg, .png images are allowed")

    filename = f"{uuid.uuid4().hex}{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)

    result = predict(image_path=filepath, crop_name=crop_name)

    report = DiseaseReport(
        user_id=current_user.id,
        crop_name=crop_name,
        image_path=filepath,
        predicted_disease=result["disease"],
        confidence=result["confidence"],
        severity=result["severity"],
        recommendation=result["recommendation"],
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/history", response_model=List[DiseaseReportOut])
def get_scan_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return (
        db.query(DiseaseReport)
        .filter(DiseaseReport.user_id == current_user.id)
        .order_by(DiseaseReport.created_at.desc())
        .all()
    )
