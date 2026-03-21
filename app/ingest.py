import pandas as pd

REQUIRED_RAW_COLUMNS = [
    "id",
    "source_type",
    "source_name",
    "collected_at",
    "raw_text",
    "author",
    "source_url",
]

REQUIRED_GEO_COLUMNS = [
    "geo_unit_id",
    "geo_unit_type",
    "geo_unit_name",
    "parent_constituency",
]


def load_raw_events(path: str) -> pd.DataFrame:
    df = pd.read_csv(path)
    missing = [col for col in REQUIRED_RAW_COLUMNS if col not in df.columns]
    if missing:
        raise ValueError(f"Missing raw event columns: {missing}")

    df["raw_text"] = df["raw_text"].fillna("").astype(str)
    df["source_type"] = df["source_type"].fillna("unknown").astype(str)
    df["source_name"] = df["source_name"].fillna("unknown").astype(str)
    df["author"] = df["author"].fillna("").astype(str)
    df["source_url"] = df["source_url"].fillna("").astype(str)
    return df


def load_geo_master(path: str) -> pd.DataFrame:
    geo_df = pd.read_csv(path)
    missing = [col for col in REQUIRED_GEO_COLUMNS if col not in geo_df.columns]
    if missing:
        raise ValueError(f"Missing geo master columns: {missing}")

    geo_df["geo_unit_name"] = geo_df["geo_unit_name"].fillna("").astype(str)
    geo_df["geo_unit_type"] = geo_df["geo_unit_type"].fillna("").astype(str)
    geo_df["geo_unit_id"] = geo_df["geo_unit_id"].fillna("").astype(str)
    return geo_df