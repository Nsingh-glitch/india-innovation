import pandas as pd
from sqlalchemy import text

from app.config import settings
from app.db import engine, SessionLocal
from app.models import Base, GeoAlias, GeoMaster, RawEvent


def create_tables() -> None:
    Base.metadata.create_all(bind=engine)


def seed_geo_master(csv_path: str) -> None:
    df = pd.read_csv(csv_path)
    db = SessionLocal()
    try:
        for _, row in df.iterrows():
            existing = db.get(GeoMaster, row["geo_unit_id"])
            if not existing:
                db.add(
                    GeoMaster(
                        geo_unit_id=row["geo_unit_id"],
                        geo_unit_type=row["geo_unit_type"],
                        geo_unit_name=row["geo_unit_name"],
                        parent_constituency=row["parent_constituency"],
                    )
                )
        db.commit()
    finally:
        db.close()


def seed_geo_aliases(csv_path: str) -> None:
    df = pd.read_csv(csv_path)
    db = SessionLocal()
    try:
        for _, row in df.iterrows():
            existing = db.get(GeoAlias, row["alias_text"])
            if not existing:
                db.add(
                    GeoAlias(
                        alias_text=row["alias_text"],
                        geo_unit_id=row["geo_unit_id"],
                    )
                )
        db.commit()
    finally:
        db.close()


def seed_raw_events(csv_path: str) -> None:
    df = pd.read_csv(csv_path)
    db = SessionLocal()
    try:
        for _, row in df.iterrows():
            existing = db.get(RawEvent, row["id"])
            if not existing:
                db.add(
                    RawEvent(
                        id=row["id"],
                        source_type=row["source_type"],
                        source_name=row["source_name"],
                        collected_at=row["collected_at"],
                        raw_text=row["raw_text"],
                        author=row.get("author", ""),
                        source_url=row.get("source_url", ""),
                        ingestion_status="pending",
                    )
                )
        db.commit()
    finally:
        db.close()


def reset_tables() -> None:
    db = SessionLocal()
    try:
        db.execute(text("DELETE FROM processed_events;"))
        db.execute(text("DELETE FROM raw_events;"))
        db.execute(text("DELETE FROM geo_aliases;"))
        db.execute(text("DELETE FROM geo_master;"))
        db.commit()
    finally:
        db.close()


if __name__ == "__main__":
    create_tables()
    seed_geo_master(settings.geo_master_path)
    seed_geo_aliases(settings.geo_aliases_path)
    seed_raw_events(settings.raw_events_path)
    print("Database initialized and seeded successfully.")