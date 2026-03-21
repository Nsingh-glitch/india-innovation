import re
import pandas as pd


def extract_location(text: str, geo_df: pd.DataFrame, alias_map: dict) -> dict:
    text_lower = text.lower().strip()

    for alias_text, geo_unit_id in alias_map.items():
        if alias_text in text_lower:
            match = geo_df[geo_df["geo_unit_id"] == geo_unit_id]
            if not match.empty:
                row = match.iloc[0]
                return {
                    "location_text": row["geo_unit_name"],
                    "geo_unit_type": row["geo_unit_type"],
                    "geo_unit_id": row["geo_unit_id"],
                }

    ward_match = re.search(r"\bward\s+(\d+)\b", text_lower)
    if ward_match:
        ward_num = ward_match.group(1)
        ward_name = f"Ward {ward_num}"
        match = geo_df[
            (geo_df["geo_unit_type"].str.lower() == "ward") &
            (geo_df["geo_unit_name"].str.lower() == ward_name.lower())
        ]
        if not match.empty:
            row = match.iloc[0]
            return {
                "location_text": ward_name,
                "geo_unit_type": row["geo_unit_type"],
                "geo_unit_id": row["geo_unit_id"],
            }

    booth_match = re.search(r"\bbooth\s+(\d+)\b", text_lower)
    if booth_match:
        booth_num = booth_match.group(1)
        booth_name = f"Booth {booth_num}"
        match = geo_df[
            (geo_df["geo_unit_type"].str.lower() == "booth") &
            (geo_df["geo_unit_name"].str.lower() == booth_name.lower())
        ]
        if not match.empty:
            row = match.iloc[0]
            return {
                "location_text": booth_name,
                "geo_unit_type": row["geo_unit_type"],
                "geo_unit_id": row["geo_unit_id"],
            }

    for _, row in geo_df.iterrows():
        geo_name = str(row["geo_unit_name"]).strip().lower()
        if geo_name and geo_name in text_lower:
            return {
                "location_text": row["geo_unit_name"],
                "geo_unit_type": row["geo_unit_type"],
                "geo_unit_id": row["geo_unit_id"],
            }

    return {
        "location_text": "",
        "geo_unit_type": "unknown",
        "geo_unit_id": "unknown",
    }