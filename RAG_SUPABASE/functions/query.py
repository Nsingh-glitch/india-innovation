from functions.utils import extract_filters, retrieve, expand_clusters, call_llm, aggregate
from functions.utils import store_log

def rag_pipeline(query):
    # ==============================
    # STEP 1: FILTER EXTRACTION
    # ==============================
    filters = extract_filters(query)

    # ==============================
    # STEP 2: RETRIEVE (Supabase-backed)
    # ==============================
    rows = retrieve(query, filters)

    if not rows:
        return "No relevant data found."

    # ==============================
    # STEP 3: CLUSTER EXPANSION
    # ==============================
    rows = expand_clusters(rows)[:20]

    if not rows:
        return "No relevant clustered data found."

    # ==============================
    # STEP 4: AGGREGATION
    # ==============================
    issue_counts, urgency_counts = aggregate(rows)

    # ==============================
    # STEP 5: CONTEXT BUILDING
    # ==============================
    context = "\n".join([f"- {r['text']}" for r in rows[:15]])

    summary = "\n".join([
        f"{k}: {v}" for k, v in issue_counts.items()
    ])

    urgency_summary = "\n".join([
        f"{k}: {v}" for k, v in urgency_counts.items()
    ])

    # ==============================
    # STEP 6: PROMPT
    # ==============================
    prompt = f"""
Answer the question using ONLY the provided data.

IMPORTANT:
- Do NOT hallucinate
- Base answer strictly on context
- Prioritize high urgency issues if relevant

--------------------------------------

CONTEXT:
{context}

--------------------------------------

ISSUE SUMMARY:
{summary}

URGENCY SUMMARY:
{urgency_summary}

--------------------------------------

QUESTION:
{query}

--------------------------------------

Provide a clear, structured answer.
"""

    # ==============================
    # STEP 7: LLM CALL
    # ==============================
    response = call_llm(prompt, temp=0.4)

    # ==============================
    # STEP 8: STORE LOG (SAFE)
    # ==============================
    try:
        store_log(
            log_type="qa",
            user_input=query,
            output=response,
            metadata={
                "issue_summary": dict(issue_counts),
                "urgency_summary": dict(urgency_counts),
                "result_count": len(rows)
            }
        )
    except Exception as e:
        print("Log error:", e)

    return response