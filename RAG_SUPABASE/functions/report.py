from functions.utils import call_llm, supabase
from collections import Counter
from datetime import datetime, timedelta

def generate_full_report(days=30):
    # ==============================
    # DATE CALCULATION
    # ==============================
    now = datetime.utcnow()
    date_filter = (now - timedelta(days=days)).isoformat()

    # ==============================
    # FETCH DATA
    # ==============================
    response = supabase.table("processed_events") \
        .select("*") \
        .gte("processed_at", date_filter) \
        .execute()

    rows = response.data

    if not rows:
        return f"No data available for last {days} days."

    sample_rows = rows[:200]

    # ==============================
    # AGGREGATIONS
    # ==============================
    issue_counts = Counter([r.get("issue_category", "unknown") for r in sample_rows])
    location_counts = Counter([r.get("location_text", "unknown") for r in sample_rows])
    urgency_counts = Counter([r.get("urgency", "unknown") for r in sample_rows])

    examples = [r.get("text", "") for r in sample_rows[:50]]

    # ==============================
    # DYNAMIC PROMPT 🔥
    # ==============================
    prompt = f"""
Write a civic report based on the last {days} days of data.

IMPORTANT:
- Focus ONLY on this time range
- Do NOT include data outside this period
- Highlight trends specific to last {days} days
- Use analytical tone

--------------------------------------

TIME RANGE:
Last {days} days

--------------------------------------

ISSUE DISTRIBUTION:
{dict(issue_counts)}

LOCATION DISTRIBUTION:
{dict(location_counts)}

URGENCY DISTRIBUTION:
{dict(urgency_counts)}

--------------------------------------

EXAMPLES:
{examples}

--------------------------------------

STRUCTURE:

1. Overview of last {days} days
2. Key issues observed
3. Location-wise patterns
4. Urgency insights
5. Key observations
6. Conclusion

--------------------------------------

Report:
"""

    report_text = call_llm(prompt, temp=0.4)

    # ==============================
    # ACTIONS (OPTIONAL)
    # ==============================
    actions_prompt = f"""
Suggest actions based ONLY on last {days} days data.

ISSUES:
{dict(issue_counts)}

URGENCY:
{dict(urgency_counts)}

Provide 8-10 actionable steps.
"""

    suggested_actions = call_llm(actions_prompt, temp=0.3)

    # ==============================
    # STORE
    # ==============================
    try:
        supabase.table("report").insert({
            "report_text": report_text,
            "suggested_actions": suggested_actions,
            "issue_counts": dict(issue_counts),
            "location_counts": dict(location_counts),
            "urgency_counts": dict(urgency_counts)
        }).execute()

    except Exception as e:
        print("DB Error:", e)

    return {
        "report": report_text,
        "suggested_actions": suggested_actions
    }