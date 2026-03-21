from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from sqlalchemy import select

from app.config import settings
from app.db import get_db
from app.models import RawEvent, ProcessedEvent
from app.pipeline import process_pending_events
from app.repository import get_cluster_summary
from app.seed import create_tables, seed_geo_master, seed_geo_aliases, seed_raw_events

app = FastAPI(title=settings.app_name)


@app.on_event("startup")
def startup_event():
    create_tables()
    seed_geo_master(settings.geo_master_path)
    seed_geo_aliases(settings.geo_aliases_path)
    seed_raw_events(settings.raw_events_path)


@app.get("/")
def root():
    return {"message": "SabhaSaar V2 API is running"}


@app.post("/process")
def run_processing():
    df = process_pending_events(limit=100)
    return {
        "status": "success",
        "rows_processed": len(df),
    }


@app.get("/raw-events")
def list_raw_events(db: Session = Depends(get_db)):
    rows = db.execute(select(RawEvent)).scalars().all()
    return [
        {
            "id": r.id,
            "source_type": r.source_type,
            "source_name": r.source_name,
            "collected_at": r.collected_at,
            "raw_text": r.raw_text,
            "ingestion_status": r.ingestion_status,
        }
        for r in rows
    ]


@app.get("/processed-events")
def list_processed_events(db: Session = Depends(get_db)):
    rows = db.execute(select(ProcessedEvent)).scalars().all()
    return [
        {
            "id": r.id,
            "raw_event_id": r.raw_event_id,
            "issue_category": r.issue_category,
            "sentiment": r.sentiment,
            "urgency": r.urgency,
            "geo_unit_id": r.geo_unit_id,
            "cluster_id": r.cluster_id,
            "trust_score": r.trust_score,
        }
        for r in rows
    ]


@app.get("/clusters")
def list_clusters(db: Session = Depends(get_db)):
    return get_cluster_summary(db)