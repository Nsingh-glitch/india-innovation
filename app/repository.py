from typing import List, Dict, Any

from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.models import RawEvent, ProcessedEvent, GeoMaster, GeoAlias


def get_pending_raw_events(db: Session, limit: int = 100) -> List[RawEvent]:
    stmt = (
        select(RawEvent)
        .where(RawEvent.ingestion_status == "pending")
        .limit(limit)
    )
    return list(db.scalars(stmt).all())


def mark_raw_event_processed(db: Session, raw_event_id: str) -> None:
    raw_event = db.get(RawEvent, raw_event_id)
    if raw_event:
        raw_event.ingestion_status = "processed"
        db.add(raw_event)


def insert_processed_event(db: Session, payload: Dict[str, Any]) -> None:
    existing = db.execute(
        select(ProcessedEvent).where(ProcessedEvent.raw_event_id == payload["raw_event_id"])
    ).scalar_one_or_none()

    if existing:
        return

    db.add(ProcessedEvent(**payload))


def get_geo_master_df(db: Session):
    rows = db.execute(select(GeoMaster)).scalars().all()
    import pandas as pd
    return pd.DataFrame([
        {
            "geo_unit_id": r.geo_unit_id,
            "geo_unit_type": r.geo_unit_type,
            "geo_unit_name": r.geo_unit_name,
            "parent_constituency": r.parent_constituency,
        }
        for r in rows
    ])


def get_geo_aliases(db: Session) -> Dict[str, str]:
    rows = db.execute(select(GeoAlias)).scalars().all()
    return {r.alias_text.lower(): r.geo_unit_id for r in rows}


def get_processed_events(db: Session):
    stmt = select(ProcessedEvent)
    return list(db.scalars(stmt).all())


def get_cluster_summary(db: Session):
    stmt = (
        select(
            ProcessedEvent.cluster_id,
            ProcessedEvent.issue_category,
            ProcessedEvent.geo_unit_id,
            ProcessedEvent.sentiment,
            func.count(ProcessedEvent.id).label("count"),
        )
        .group_by(
            ProcessedEvent.cluster_id,
            ProcessedEvent.issue_category,
            ProcessedEvent.geo_unit_id,
            ProcessedEvent.sentiment,
        )
        .order_by(func.count(ProcessedEvent.id).desc())
    )
    rows = db.execute(stmt).all()
    return [
        {
            "cluster_id": row.cluster_id,
            "issue_category": row.issue_category,
            "geo_unit_id": row.geo_unit_id,
            "sentiment": row.sentiment,
            "count": row.count,
        }
        for row in rows
    ]