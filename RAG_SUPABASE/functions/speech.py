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
    # PROMPT (STRONG LANGUAGE CONTROL 🔥)
    # ==============================
    prompt = f"""
Write a public speech for a leader visiting {location}.

LANGUAGE RULE (STRICT):
- The speech MUST be written entirely in {language}
- Do NOT use English unless the language is English
- Use native script of {language}
- If you use the wrong language, the answer is incorrect

TONE:
- Natural, emotional, human tone

IMPORTANT:
- PRIORITIZE urgent issues first
- Use ONLY given data

--------------------------------------

HIGH URGENCY ISSUES:
{high_urgency_context if high_urgency_context else "No high urgency issues reported"}

--------------------------------------

OTHER ISSUES:
{context}

--------------------------------------

ISSUE DISTRIBUTION:
{dict(issue_counts)}

URGENCY DISTRIBUTION:
{dict(urgency_counts)}

--------------------------------------

Make it 1000-1200 words.
No bullet points.

Speech:
"""

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