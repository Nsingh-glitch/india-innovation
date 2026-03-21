import re
from langdetect import detect, DetectorFactory

DetectorFactory.seed = 0

HINGLISH_HINTS = {
    "paani", "sadak", "bijli", "pareshan", "gaon", "ward", "booth",
    "nahi", "din", "bahut", "kharab", "safai", "aspataal"
}


def detect_language(text: str) -> str:
    if not text.strip():
        return "unknown"

    devanagari_count = len(re.findall(r"[\u0900-\u097F]", text))
    latin_count = len(re.findall(r"[a-zA-Z]", text))

    if devanagari_count > 0 and latin_count == 0:
        return "hi"

    words = set(text.lower().split())
    if latin_count > 0 and len(words.intersection(HINGLISH_HINTS)) >= 2:
        return "hinglish"

    try:
        lang = detect(text)
        if lang == "hi":
            return "hi"
        if lang == "en":
            return "en"
        return lang
    except Exception:
        return "unknown"