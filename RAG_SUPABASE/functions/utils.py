from sentence_transformers import SentenceTransformer
from pinecone import Pinecone
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
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")
INDEX_NAME = os.getenv("INDEX_NAME")
LLM_MODEL = os.getenv("LLM_MODEL")
EMBED_MODEL = os.getenv("EMBED_MODEL")

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not PINECONE_API_KEY or not OPENROUTER_API_KEY:
    raise ValueError("API keys not found.")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase keys missing.")

# ==============================
# INIT
# ==============================
embed_model = SentenceTransformer(EMBED_MODEL)

pc = Pinecone(api_key=PINECONE_API_KEY)
index = pc.Index(INDEX_NAME)

supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=OPENROUTER_API_KEY,
    default_headers={"HTTP-Referer": "http://localhost"}
)

# ==============================
# STORE DATA
# ==============================
def store_in_supabase(row):
    data = {
        "text": row.get("text"),
        "issue_category": row.get("issue_category"),
        "urgency": row.get("urgency"),
        "location_text": row.get("location_text"),
        "cluster_id": row.get("cluster_id")
    }
    return supabase.table("processed_events").insert(data).execute()

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
# UPSERT
# ==============================
def upsert_with_storage(row):
    embedding = embed_model.encode(row["text"]).tolist()

    res = store_in_supabase(row)
    if not res.data:
        return

    record_id = res.data[0]["id"]

    index.upsert([
        (record_id, embedding)
    ])

# ==============================
# LLM CALL
# ==============================
def call_llm(prompt, temp=0.3):
    response = client.chat.completions.create(
        model=LLM_MODEL,
        messages=[
            {
                "role": "system",
                "content": "Follow the requested language strictly."
            },
            {
                "role": "user",
                "content": prompt
            }
        ],
        temperature=temp
    )
    return response.choices[0].message.content

# ==============================
# AGGREGATION
# ==============================
def aggregate(rows):
    issue_counts = Counter([r.get("issue_category", "unknown") for r in rows])
    urgency_counts = Counter([r.get("urgency", "unknown") for r in rows])
    return issue_counts, urgency_counts

# ==============================
# FILTER EXTRACTION (NO df 🔥)
# ==============================

def extract_filters(query):
    query = query.lower()
    filters = {}

    # simple keyword-based filters (can improve later)
    if "delhi" in query:
        filters["location_text"] = {"$eq": "delhi"}

    if "water" in query:
        filters["issue_category"] = {"$eq": "water"}

    if "road" in query:
        filters["issue_category"] = {"$eq": "road"}

    if "high" in query:
        filters["urgency"] = {"$eq": "high"}

    return filters


# ==============================
# FETCH FROM SUPABASE
# ==============================
def fetch_from_supabase(ids):
    if not ids:
        return []

    response = supabase.table("processed_events") \
        .select("*") \
        .in_("id", ids) \
        .execute()

    return response.data

# ==============================
# RETRIEVE
# ==============================
def retrieve(query, filters, top_k=5):
    query_embedding = embed_model.encode(query).tolist()

    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=False,
        filter=filters if filters else None
    )

    matches = results.get("matches", [])

    if not matches:
        results = index.query(
            vector=query_embedding,
            top_k=top_k,
            include_metadata=False
        )
        matches = results.get("matches", [])

    ids = [m["id"] for m in matches]

    return fetch_from_supabase(ids)

# ==============================
# EXPAND CLUSTERS
# ==============================
def expand_clusters(rows):
    if not rows:
        return []

    cluster_ids = list(set([
        r.get("cluster_id") for r in rows if r.get("cluster_id")
    ]))

    if not cluster_ids:
        return rows

    expanded = index.query(
        vector=embed_model.encode(rows[0]["text"]).tolist(),
        top_k=30,
        include_metadata=False,
        filter={"cluster_id": {"$in": cluster_ids}}
    )

    ids = [m["id"] for m in expanded.get("matches", [])]

    return fetch_from_supabase(ids)