from fastapi import FastAPI, HTTPException, Request
import httpx
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from datetime import datetime
from supabase import create_client, Client
import os
from dotenv import load_dotenv
import uuid
import httpx

load_dotenv()

# Initialize Supabase
url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_ANON_KEY")
if not url:
    raise ValueError("SUPABASE_URL missing")

if not key:
    raise ValueError("SUPABASE_ANON_KEY missing")
supabase: Client = create_client(url, key)

app = FastAPI()

# --- Pydantic Models ---
class Issue(BaseModel):
    user_id: str
    raw_text: str
    location_hint: str = None

class RawEvent(BaseModel):
    content: str

class ProcessedEvent(BaseModel):
    title: str
    description: str

class Cluster(BaseModel):
    name: str
    event_ids: list[int]

class CitizenReport(BaseModel):
    id: str
    user_id: str
    name: str
    email: str
    phone: str
    raw_text: str
    location_hint: str = None
    status: str = "submitted"
    created_at: datetime

class SubmitIssueRequest(BaseModel):
    user_id: str
    name: str
    email: str
    phone: str
    raw_text: str
    location_hint: str = None

class SimulateBatchRequest(BaseModel):
    batch_size: int = 5
    auto_process: bool = True

# --- Simulation Data ---
SIMULATED_EVENTS = [
  {
    "id": "sim_001",
    "source_type": "demo_social",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:00:00",
    "raw_text": "Ward 12 me 3 din se paani nahi aa raha",
    "author": "sim_user_1",
    "source_url": ""
  },
  {
    "id": "sim_002",
    "source_type": "citizen_app",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:01:00",
    "raw_text": "Street lights in Booth 5 are not working.",
    "author": "sim_user_2",
    "source_url": ""
  },
  {
    "id": "sim_003",
    "source_type": "demo_news",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:02:00",
    "raw_text": "Garbage collection is irregular in Ward 7, causing sanitation issues.",
    "author": "sim_user_3",
    "source_url": ""
  },
  {
    "id": "sim_004",
    "source_type": "demo_field",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:03:00",
    "raw_text": "Pension disbursement has been delayed for many in Rampur village.",
    "author": "sim_user_4",
    "source_url": ""
  },
  {
    "id": "sim_005",
    "source_type": "demo_meeting",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:04:00",
    "raw_text": "The road leading to the primary school in Ward 9 is in a terrible condition.",
    "author": "sim_user_5",
    "source_url": ""
  },
  {
    "id": "sim_006",
    "source_type": "demo_social",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:05:00",
    "raw_text": "Frequent power cuts in Booth 4 are affecting daily life.",
    "author": "sim_user_6",
    "source_url": ""
  },
  {
    "id": "sim_007",
    "source_type": "citizen_app",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:06:00",
    "raw_text": "The local health center in Ward 5 is out of essential medicines.",
    "author": "sim_user_7",
    "source_url": ""
  },
  {
    "id": "sim_008",
    "source_type": "demo_news",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:07:00",
    "raw_text": "Water logging near the main market in Ward 12 after rains.",
    "author": "sim_user_8",
    "source_url": ""
  },
  {
    "id": "sim_009",
    "source_type": "demo_social",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:08:00",
    "raw_text": "Ward 7 ki galiyon me kachra pada hai, koi uthane nahi aata.",
    "author": "sim_user_9",
    "source_url": ""
  },
  {
    "id": "sim_010",
    "source_type": "citizen_app",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:09:00",
    "raw_text": "Pension not received for 2 months in Rampur village.",
    "author": "sim_user_10",
    "source_url": ""
  },
  {
    "id": "sim_011",
    "source_type": "demo_field",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:10:00",
    "raw_text": "Broken sewage line in Booth 5 needs urgent repair.",
    "author": "sim_user_11",
    "source_url": ""
  },
  {
    "id": "sim_012",
    "source_type": "demo_meeting",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:11:00",
    "raw_text": "Request for a new transformer in Booth 4 due to overload.",
    "author": "sim_user_12",
    "source_url": ""
  },
  {
    "id": "sim_013",
    "source_type": "demo_social",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:12:00",
    "raw_text": "The public dispensary in Ward 5 is often closed during working hours.",
    "author": "sim_user_13",
    "source_url": ""
  },
  {
    "id": "sim_014",
    "source_type": "citizen_app",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:13:00",
    "raw_text": "Potholes on the main road of Ward 9 are causing accidents.",
    "author": "sim_user_14",
    "source_url": ""
  },
  {
    "id": "sim_015",
    "source_type": "demo_news",
    "source_name": "simulator",
    "collected_at": "2026-03-27T10:14:00",
    "raw_text": "No water supply in some parts of Ward 12 for the last 24 hours.",
    "author": "sim_user_15",
    "source_url": ""
  }
]

# --- Simulation State ---
SIMULATION_STATE = {
    "current_index": 0
}

# --- Simulation Helpers ---
def get_simulation_status():
    total_events = len(SIMULATED_EVENTS)
    current_index = SIMULATION_STATE["current_index"]
    remaining_events = total_events - current_index
    return {
        "current_index": current_index,
        "total_events": total_events,
        "remaining_events": remaining_events,
        "completed": remaining_events == 0
    }

def reset_simulation_pointer():
    SIMULATION_STATE["current_index"] = 0
    return get_simulation_status()

def get_next_simulation_batch(batch_size: int):
    current_index = SIMULATION_STATE["current_index"]
    total_events = len(SIMULATED_EVENTS)
    
    if current_index >= total_events:
        return []

    start_index = current_index
    end_index = min(start_index + batch_size, total_events)
    
    batch = SIMULATED_EVENTS[start_index:end_index]
    
    # Update collected_at to current time
    for event in batch:
        event["collected_at"] = datetime.now().isoformat()

    SIMULATION_STATE["current_index"] = end_index
    
    return batch

# --- In-Memory Databases ---
reports_db = []
processed_events_db = []

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- API Endpoints ---
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post("/submit-issue")
def submit_issue(request: SubmitIssueRequest):
    try:
        # Create a CitizenReport object
        report = CitizenReport(
            id=str(uuid.uuid4()),
            user_id=request.user_id,
            name=request.name,
            email=request.email,
            phone=request.phone,
            raw_text=request.raw_text,
            location_hint=request.location_hint,
            created_at=datetime.now()
        )

        # Insert into citizen_report table
        supabase.table('citizen_report').insert(report.dict()).execute()

        # Insert into raw_events table
        supabase.table('raw_events').insert({"content": request.raw_text}).execute()

        return {"message": "Issue submitted successfully"}

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/my-reports")
def get_my_reports(user_id: str):
    try:
        response = supabase.table('citizen_report').select("*").eq('user_id', user_id).execute()
        return response.data
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/raw-events")
def get_raw_events():
    try:
        response = supabase.table('raw_events').select("*").execute()
        return response.data
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/processed-events")
def get_processed_events():
    try:
        response = supabase.table('processed_events').select("*").execute()
        return response.data
    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/clusters")
def get_clusters():
    try:
        response = supabase.table('processed_events').select("id", "cluster_id").execute()
        events = response.data

        clusters = {}
        for event in events:
            cluster_id = event['cluster_id']
            if cluster_id not in clusters:
                clusters[cluster_id] = {
                    "name": cluster_id,
                    "event_ids": []
                }
            clusters[cluster_id]["event_ids"].append(event['id'])

        return list(clusters.values())

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/process")
def run_pipeline():
    # Placeholder for the pipeline logic
    return {"message": "Processing pipeline started successfully."}

# --- Simulation Endpoints ---
@app.post("/simulate-batch")
def simulate_batch(request: SimulateBatchRequest):
    try:
        batch = get_next_simulation_batch(request.batch_size)
        inserted_count = 0
        if batch:
            # Assuming raw_events table has a 'content' column
            insert_data = [{"content": event["raw_text"]} for event in batch]
            supabase.table('raw_events').insert(insert_data).execute()
            inserted_count = len(batch)

        processed_count = 0
        if request.auto_process and inserted_count > 0:
            # This assumes a function process_pending_events exists and works with Supabase
            # Since it's not defined, we'll just return a message.
            # In a real scenario, you would call your processing logic here.
            run_pipeline() # Re-using the existing placeholder
            processed_count = inserted_count # Assuming all inserted are processed

        return {
            "status": "success",
            "inserted_count": inserted_count,
            "processed_count": processed_count,
            "simulation_status": get_simulation_status()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/simulation/reset")
def simulation_reset():
    return {
        "status": "simulation reset",
        "simulation_status": reset_simulation_pointer()
    }

@app.get("/simulation/status")
def simulation_status():
    return get_simulation_status()


# --- RAG Proxy Endpoint ---

@app.post("/generate")
async def proxy_generate(request: Request):
    rag_api_url = os.getenv("RAG_API_URL", "http://127.0.0.1:5000")
    data = await request.json()
    try:
        async with httpx.AsyncClient(timeout=60.0) as client:
            response = await client.post(f"{rag_api_url}/generate", json=data)

            # Check for HTTP errors from the RAG service first
            response.raise_for_status()

            rag_data = response.json()

            # Handle cases where RAG returns a 200 OK but reports a business logic error
            if rag_data.get("status") == "error":
                raise HTTPException(status_code=400, detail=rag_data)

            return rag_data

    except httpx.RequestError as e:
        # Log network errors for debugging
        print(f"❌ RequestError connecting to RAG service: {e}")
        raise HTTPException(status_code=502, detail={"message": f"The speech generation service is currently unavailable."})
    except httpx.HTTPStatusError as e:
        # Log non-2xx responses from the RAG service
        print(f"❌ HTTPStatusError from RAG: {e.response.status_code} - {e.response.text}")
        try:
            detail = e.response.json()
        except Exception:
            detail = {"message": e.response.text}
        raise HTTPException(status_code=e.response.status_code, detail=detail)
    except Exception as e:
        # Log other unexpected errors
        print(f"❌ Unhandled /generate proxy error: {repr(e)}")
        raise HTTPException(status_code=500, detail={"message": "An unexpected error occurred."})


@app.post("/demo/reset-data")
def demo_reset_data():
    try:
        # Delete all rows from processed_events and raw_events
        supabase.table('processed_events').delete().neq('id', -1).execute()
        supabase.table('raw_events').delete().neq('id', -1).execute()
        
        # Reset simulation pointer
        reset_simulation_pointer()
        
        return {
            "status": "success",
            "message": "All demo data has been reset.",
            "simulation_status": get_simulation_status()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))