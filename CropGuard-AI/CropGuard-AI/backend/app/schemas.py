from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    name: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: int
    name: str
    email: EmailStr

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class DiseaseReportOut(BaseModel):
    id: int
    crop_name: str
    predicted_disease: Optional[str]
    confidence: Optional[float]
    severity: Optional[str]
    recommendation: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True
