from functions.utils import df, upsert_with_storage

def ingest_data():
    for _, row in df.iterrows():
        data = {
            "text": row["clean_text"],
            "issue": row["issue_category"],
            "urgency": row["urgency"],
            "location": row["location_text"],
            "cluster_id": row["cluster_id"]
        }

        upsert_with_storage(data)

    print("✅ Ingestion complete")

if __name__ == "__main__":
    ingest_data()