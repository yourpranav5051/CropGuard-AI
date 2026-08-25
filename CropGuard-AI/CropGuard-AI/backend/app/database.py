"""
Database connection setup.
Uses SQLite for the hackathon demo — zero setup, single file (cropguard.db).
Swap SQLALCHEMY_DATABASE_URL to a Postgres/MySQL URL later without touching
any other code, since everything goes through this same `engine`/`SessionLocal`.
"""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "sqlite:///./cropguard.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}  # needed only for SQLite
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """FastAPI dependency — yields a DB session per-request and closes it after."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
