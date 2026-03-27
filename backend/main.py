from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase_client import supabase

app = FastAPI()

# ✅ CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔥 MODEL
class CitizenEvent(BaseModel):
    name: str | None = None
    complaint: str
    location: str


# ✅ SUBMIT ISSUE
@app.post("/submit-issue")
def submit_issue(data: CitizenEvent):

    response = supabase.table("citizen_events").insert({
        "name": data.name,
        "complaint": data.complaint,
        "location": data.location
    }).execute()

    return {
        "message": "Stored successfully",
        "data": response.data
    }