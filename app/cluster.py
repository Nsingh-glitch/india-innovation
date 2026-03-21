import pandas as pd


def build_cluster_id(issue_category: str, geo_unit_id: str) -> str:
    safe_issue = issue_category if issue_category else "other"
    safe_geo = geo_unit_id if geo_unit_id else "unknown"
    return f"cluster_{safe_issue}_{safe_geo}"


def attach_clusters(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["cluster_id"] = df.apply(
        lambda row: build_cluster_id(row["issue_category"], row["geo_unit_id"]),
        axis=1
    )
    return df