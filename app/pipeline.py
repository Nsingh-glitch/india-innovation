import os
import pandas as pd

from app.clean import clean_text
from app.classify import (
    classify_issue,
    classify_sentiment,
    classify_urgency,
    assign_trust_score,
)
from app.cluster import build_cluster_id
from app.db import SessionLocal
from app.extract_location import extract_location
from app.language import detect_language
from app.repository import (
    get_pending_raw_events,
    mark_raw_event_processed,
    insert_processed_event,
    get_geo_master_df,
    get_geo_aliases,
)


def process_pending_events(limit: int = 100) -> pd.DataFrame:
    db = SessionLocal()
    processed_rows = []

    try:
        raw_events = get_pending_raw_events(db, limit=limit)
        geo_df = get_geo_master_df(db)
        alias_map = get_geo_aliases(db)

        for event in raw_events:
            clean = clean_text(event.raw_text)
            language = detect_language(clean)
            translated_text = clean

            issue_category = classify_issue(translated_text)
            sentiment = classify_sentiment(translated_text)
            urgency = classify_urgency(translated_text)

            location_info = extract_location(translated_text, geo_df, alias_map)
            trust_score = assign_trust_score(event.source_type)
            cluster_id = build_cluster_id(issue_category, location_info["geo_unit_id"])

            processed_payload = {
                "raw_event_id": event.id,
                "clean_text": clean,
                "language": language,
                "translated_text": translated_text,
                "issue_category": issue_category,
                "sentiment": sentiment,
                "urgency": urgency,
                "location_text": location_info["location_text"],
                "geo_unit_type": location_info["geo_unit_type"],
                "geo_unit_id": location_info["geo_unit_id"],
                "trust_score": trust_score,
                "cluster_id": cluster_id,
            }

            insert_processed_event(db, processed_payload)
            mark_raw_event_processed(db, event.id)
            processed_rows.append(
                {
                    "raw_event_id": event.id,
                    **processed_payload,
                }
            )

        db.commit()

        result_df = pd.DataFrame(processed_rows)

        if not result_df.empty:
            os.makedirs("output", exist_ok=True)
            result_df.to_csv("output/processed_events.csv", index=False)

        return result_df

    finally:
        db.close()