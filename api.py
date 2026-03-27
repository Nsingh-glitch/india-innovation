from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime

app = FastAPI()

# ✅ CORS (IMPORTANT)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🧠 TEMP STORAGE (later replace with DB)
reports_db = []


# 🔥 MODEL
class Issue(BaseModel):
    user_id: str
    raw_text: str
    location_hint: str = None


# ✅ SUBMIT ISSUE
@app.post("/submit-issue")
def submit_issue(issue: Issue):
    report = {
        "id": len(reports_db) + 1,
        "user_id": issue.user_id,
        "text": issue.raw_text,
        "location": issue.location_hint,
        "status": "submitted",
        "created_at": str(datetime.now())
    }

    reports_db.append(report)

    return {"message": "Issue stored successfully"}


# ✅ GET MY REPORTS
@app.get("/my-reports/{user_id}")
def get_reports(user_id: str):
    return [r for r in reports_db if r["user_id"] == user_id]