from sqlalchemy import Column, String, Text, Float, Integer, DateTime
from sqlalchemy.sql import func

from app.db import Base


class RawEvent(Base):
    __tablename__ = "raw_events"

    id = Column(String, primary_key=True)
    source_type = Column(String, nullable=False)
    source_name = Column(String, nullable=False)
    collected_at = Column(String, nullable=False)
    raw_text = Column(Text, nullable=False)
    author = Column(String, nullable=True)
    source_url = Column(Text, nullable=True)
    ingestion_status = Column(String, nullable=False, default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class ProcessedEvent(Base):
    __tablename__ = "processed_events"

    id = Column(Integer, primary_key=True, autoincrement=True)
    raw_event_id = Column(String, nullable=False, unique=True)
    clean_text = Column(Text, nullable=False)
    language = Column(String, nullable=False)
    translated_text = Column(Text, nullable=False)
    issue_category = Column(String, nullable=False)
    sentiment = Column(String, nullable=False)
    urgency = Column(String, nullable=False)
    location_text = Column(String, nullable=True)
    geo_unit_type = Column(String, nullable=True)
    geo_unit_id = Column(String, nullable=True)
    trust_score = Column(Float, nullable=False)
    cluster_id = Column(String, nullable=False)
    processed_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class GeoMaster(Base):
    __tablename__ = "geo_master"

    geo_unit_id = Column(String, primary_key=True)
    geo_unit_type = Column(String, nullable=False)
    geo_unit_name = Column(String, nullable=False)
    parent_constituency = Column(String, nullable=False)


class GeoAlias(Base):
    __tablename__ = "geo_aliases"

    alias_text = Column(String, primary_key=True)
    geo_unit_id = Column(String, nullable=False)