CREATE TABLE IF NOT EXISTS raw_events (
    id TEXT PRIMARY KEY,
    source_type TEXT NOT NULL,
    source_name TEXT NOT NULL,
    collected_at TEXT NOT NULL,
    raw_text TEXT NOT NULL,
    author TEXT,
    source_url TEXT,
    ingestion_status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS processed_events (
    id SERIAL PRIMARY KEY,
    raw_event_id TEXT NOT NULL UNIQUE,
    clean_text TEXT NOT NULL,
    language TEXT NOT NULL,
    translated_text TEXT NOT NULL,
    issue_category TEXT NOT NULL,
    sentiment TEXT NOT NULL,
    urgency TEXT NOT NULL,
    location_text TEXT,
    geo_unit_type TEXT,
    geo_unit_id TEXT,
    trust_score DOUBLE PRECISION NOT NULL,
    cluster_id TEXT NOT NULL,
    processed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS geo_master (
    geo_unit_id TEXT PRIMARY KEY,
    geo_unit_type TEXT NOT NULL,
    geo_unit_name TEXT NOT NULL,
    parent_constituency TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS geo_aliases (
    alias_text TEXT PRIMARY KEY,
    geo_unit_id TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_raw_events_status ON raw_events(ingestion_status);
CREATE INDEX IF NOT EXISTS idx_processed_events_cluster ON processed_events(cluster_id);
CREATE INDEX IF NOT EXISTS idx_processed_events_geo_unit_id ON processed_events(geo_unit_id);
CREATE INDEX IF NOT EXISTS idx_processed_events_issue_category ON processed_events(issue_category);