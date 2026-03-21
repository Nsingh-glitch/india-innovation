from app.config import settings
from app.pipeline import process_pending_events
from app.seed import create_tables, seed_geo_master, seed_geo_aliases, seed_raw_events


def main() -> None:
    create_tables()
    seed_geo_master(settings.geo_master_path)
    seed_geo_aliases(settings.geo_aliases_path)
    seed_raw_events(settings.raw_events_path)

    df = process_pending_events(limit=100)

    print("\nV2 pipeline completed successfully.\n")

    if df.empty:
        print("No pending rows found.")
    else:
        print(df.head(20).to_string(index=False))
        print("\nSaved latest processed batch to output/processed_events.csv\n")


if __name__ == "__main__":
    main()