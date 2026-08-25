"""
Core tables for the MVP loop:
Home -> Login -> Dashboard -> Upload -> AI Analysis -> Result

Kept intentionally small. weather_data, pest_reports, alerts, expert_reviews
etc. from the original 8-table plan are deferred to post-MVP phases.
"""
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    reports = relationship("DiseaseReport", back_populates="owner")


class DiseaseReport(Base):
    __tablename__ = "disease_reports"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    crop_name = Column(String, nullable=False)
    image_path = Column(String, nullable=False)
    predicted_disease = Column(String, nullable=True)
    confidence = Column(Float, nullable=True)
    severity = Column(String, nullable=True)       # low / medium / high
    recommendation = Column(String, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    owner = relationship("User", back_populates="reports")
