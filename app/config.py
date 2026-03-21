from dataclasses import dataclass
from dotenv import load_dotenv
import os

load_dotenv()


@dataclass
class Settings:
    app_name: str = os.getenv("APP_NAME", "SabhaSaar Demo Pipeline V2")

    db_host: str = os.getenv("DB_HOST", "localhost")
    db_port: int = int(os.getenv("DB_PORT", "5432"))
    db_name: str = os.getenv("DB_NAME", "sabhasaar_v2")
    db_user: str = os.getenv("DB_USER", "sabha_user")
    db_password: str = os.getenv("DB_PASSWORD", "sabha_pass_123")

    raw_events_path: str = os.getenv("RAW_EVENTS_PATH", "data/raw_events.csv")
    geo_master_path: str = os.getenv("GEO_MASTER_PATH", "data/geo_master.csv")
    geo_aliases_path: str = os.getenv("GEO_ALIASES_PATH", "data/geo_aliases.csv")
    processed_output_path: str = os.getenv("PROCESSED_OUTPUT_PATH", "output/processed_events.csv")

    @property
    def database_url(self) -> str:
        return (
            f"postgresql+psycopg2://{self.db_user}:{self.db_password}"
            f"@{self.db_host}:{self.db_port}/{self.db_name}"
        )


settings = Settings()