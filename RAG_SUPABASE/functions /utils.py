from openai import OpenAI
from collections import Counter
import os
from dotenv import load_dotenv
from pathlib import Path
from supabase import create_client

# ==============================
# LOAD ENV
# ==============================
env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)

# ==============================
# ENV VARIABLES
# ==============================
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
LLM_MODEL = os.getenv("LLM_MODEL")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not OPENROUTER_API_KEY:
    raise ValueError("OpenRouter key missing.")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase keys missing.")

# ==============================
# INIT
# ==============================
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
    default_headers={"HTTP-Referer": "http://localhost"}
)

# ==============================
# LLM CALL
# ==============================
def call_llm(prompt, temp=0.3):
    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {"role": "user", "content": prompt}
        ],
        temperature=temp
    )
    return response.choices[0].message.content

# ==============================
# LOG STORE
# ==============================
def store_log(log_type, user_input, output, metadata=None):
    return supabase.table("logs").insert({
        "type": log_type,
        "input": user_input,
        "output": output,
        "metadata": metadata or {}
    }).execute()

# ==============================
# AGGREGATION
# ==============================
def aggregate(rows):
    issue_counts = Counter([r.get("issue_category", "unknown") for r in rows])
    urgency_counts = Counter([r.get("urgency", "unknown") for r in rows])
    return issue_counts, urgency_counts