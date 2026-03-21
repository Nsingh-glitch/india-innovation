ISSUE_KEYWORDS = {
    "water": ["water", "paani", "jal", "supply", "shortage"],
    "electricity": ["electricity", "bijli", "power", "transformer", "outage"],
    "roads": ["road", "sadak", "pothole", "broken road", "accident"],
    "sanitation": ["garbage", "gutter", "sanitation", "drain", "safai"],
    "pensions": ["pension", "payment delay", "vridhha", "distribution"],
    "healthcare": ["health", "hospital", "doctor", "medicine", "health center"],
    "education": ["school", "teacher", "education"],
    "agriculture": ["crop", "farming", "agriculture", "irrigation"],
    "law_order": ["crime", "violence", "police", "law order"],
    "welfare": ["ration", "scheme", "subsidy", "welfare"],
}

NEGATIVE_HINTS = {
    "issue", "problem", "delay", "broken", "outage", "complaint",
    "severe", "lack", "not", "nahi", "pareshan", "kharab", "shortage"
}

POSITIVE_HINTS = {
    "good", "resolved", "improved", "successful", "restored", "fixed"
}

HIGH_URGENCY_HINTS = {
    "3 day", "3 days", "2 day", "2 days", "urgent", "severe",
    "accident", "not working", "outage", "closed", "lack"
}

MEDIUM_URGENCY_HINTS = {
    "issue", "problem", "delay", "complaint", "broken"
}


def classify_issue(text: str) -> str:
    t = text.lower()
    best_category = "other"
    best_score = 0

    for category, keywords in ISSUE_KEYWORDS.items():
        score = sum(1 for kw in keywords if kw in t)
        if score > best_score:
            best_score = score
            best_category = category

    return best_category


def classify_sentiment(text: str) -> str:
    t = text.lower()

    negative_score = sum(1 for kw in NEGATIVE_HINTS if kw in t)
    positive_score = sum(1 for kw in POSITIVE_HINTS if kw in t)

    if negative_score > positive_score and negative_score > 0:
        return "negative"
    if positive_score > negative_score and positive_score > 0:
        return "positive"
    return "neutral"


def classify_urgency(text: str) -> str:
    t = text.lower()

    high_score = sum(1 for kw in HIGH_URGENCY_HINTS if kw in t)
    medium_score = sum(1 for kw in MEDIUM_URGENCY_HINTS if kw in t)

    if high_score > 0:
        return "high"
    if medium_score > 0:
        return "medium"
    return "low"


def assign_trust_score(source_type: str) -> float:
    source_type = source_type.lower()
    mapping = {
        "demo_field": 0.80,
        "demo_meeting": 0.85,
        "demo_news": 0.70,
        "demo_social": 0.50,
    }
    return mapping.get(source_type, 0.40)