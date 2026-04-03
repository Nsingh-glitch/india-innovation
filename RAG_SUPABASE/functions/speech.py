import os
from collections import Counter

from functions.utils import supabase, call_llm


def generate_speech(location, language="English"):
    location_input = location.lower().replace("_", " ")

    # ==============================
    # FETCH FROM SUPABASE
    # ==============================
    response = (
        supabase.table("processed_events")
        .select("*")
        .ilike("location_text", f"%{location_input}%")
        .limit(50)
        .execute()
    )

    rows = response.data or []

    if not rows:
        return f"No data for {location}"

    rows = rows[:20]

    # ==============================
    # ANALYSIS
    # ==============================
    issue_counts = Counter([r.get("issue_category", "unknown") for r in rows])
    urgency_counts = Counter([r.get("urgency", "unknown") for r in rows])

    high_urgency_rows = [
        r for r in rows if str(r.get("urgency", "")).lower() == "high"
    ]

    # ==============================
    # CONTEXT BUILDING
    # ==============================
    context = "\n".join([f"- {r.get('text', '')}" for r in rows[:10]])

    high_urgency_context = "\n".join(
        [f"- {r.get('text', '')}" for r in high_urgency_rows[:8]]
    )

    high_urgency_text = (
        high_urgency_context
        if high_urgency_context
        else "No high urgency issues reported"
    )

    # ==============================
    # LOAD PROMPT TEMPLATE
    # ==============================
    prompt_path = os.path.join(os.path.dirname(__file__), "prompt.txt")
    with open(prompt_path, "r", encoding="utf-8") as f:
        prompt_template = f.read()

    # ==============================
    # FORMAT PROMPT
    # ==============================
    prompt = prompt_template.format(
        location=location,
        language=language,
        high_urgency_text=high_urgency_text,
        context=context,
        issue_counts=dict(issue_counts),
        urgency_counts=dict(urgency_counts),
    )

    # ==============================
    # LLM CALL
    # ==============================
    result = call_llm(prompt, temp=0.5)

    # ==============================
    # STORE IN "Speech" TABLE
    # ==============================
    try:
        supabase.table("Speech").insert(
            {
                "input": f"{location} | {language}",
                "output": result,
                "metadata": {
                    "language": language,
                    "issue_counts": dict(issue_counts),
                    "urgency_counts": dict(urgency_counts),
                    "total_records": len(rows),
                },
            }
        ).execute()

    except Exception as e:
        print(f"Speech log error: {e}")

    return result