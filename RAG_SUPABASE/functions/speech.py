from functions.utils import supabase, call_llm
from collections import Counter

def generate_speech(location, language="English"):
    location_input = location.lower().replace("_", " ")

    # ==============================
    # FETCH FROM SUPABASE (UPDATED ✅)
    # ==============================
    response = supabase.table("processed_events") \
        .select("*") \
        .ilike("location_text", f"%{location_input}%") \
        .limit(50) \
        .execute()

    rows = response.data

    if not rows:
        return f"No data for {location}"

    rows = rows[:20]

    # ==============================
    # ANALYSIS (UPDATED FIELDS ✅)
    # ==============================
    issue_counts = Counter([r.get("issue_category", "unknown") for r in rows])
    urgency_counts = Counter([r.get("urgency", "unknown") for r in rows])

    high_urgency_rows = [
        r for r in rows if str(r.get("urgency", "")).lower() == "high"
    ]

    # ==============================
    # CONTEXT
    # ==============================
    context = "\n".join([f"- {r.get('text', '')}" for r in rows[:10]])

    high_urgency_context = "\n".join(
        [f"- {r.get('text', '')}" for r in high_urgency_rows[:8]]
    )

    # ==============================
    # PROMPT (FROM FILE)
    # ==============================
    # The user has not provided the import os statement, so I will add it here.
    # In a real-world scenario, this should be at the top of the file.
    import os
    
    # Load the prompt from the text file
    with open(os.path.join(os.path.dirname(__file__), "prompt.txt"), "r") as f:
        prompt_template = f.read()

    # Format the prompt with the required variables
    prompt = prompt_template.format(
        location=location,
        language=language,
        high_urgency_context=high_urgency_context if high_urgency_context else "No high urgency issues reported",
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
        supabase.table("Speech").insert({
            "input": f"{location} | {language}",
            "output": result,
            "metadata": {
                "language": language,
                "issue_counts": dict(issue_counts),
                "urgency_counts": dict(urgency_counts),
                "total_records": len(rows)
            }
        }).execute()

    except Exception as e:
        # Log the error for debugging purposes
        print(f"❌ Speech log error: {e}")

    return result