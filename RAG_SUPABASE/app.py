from flask import Flask, request, jsonify
from flask_cors import CORS

from functions.query import rag_pipeline
from functions.report import generate_full_report
from functions.speech import generate_speech
from functions.utils import upsert_with_storage

app = Flask(__name__)
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:5173",
            "https://india-innovation-tau.vercel.app"
        ]
    }
})

# ==============================
# 🔥 ENABLE CORS (VERY IMPORTANT)
# ==============================
CORS(app)

# ==============================
# HEALTH CHECK
# ==============================
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "message": "RAG API is running 🚀",
        "status": "healthy",
        "endpoints": {
            "POST /generate": {
                "type": ["qa", "report", "speech"]
            },
            "POST /ingest": "Ingest dataset into Supabase + Pinecone"
        }
    })


# ==============================
# MAIN GENERATE API
# ==============================
@app.route("/generate", methods=["POST"])
def generate():
    data = request.json

    if not data or "type" not in data:
        return jsonify({
            "status": "error",
            "message": "Missing 'type' in request"
        }), 400

    try:
        req_type = data.get("type")

        # 🔹 QA
        if req_type == "qa":
            result = rag_pipeline(data.get("query", ""))

        # 🔹 REPORT
        elif req_type == "report":
            result = generate_full_report(
                data.get("days", 30)
            )

        # 🔹 SPEECH (🔥 MAIN FEATURE)
        elif req_type == "speech":
            result = generate_speech(
                data.get("location", ""),
                data.get("language", "English")
            )

        else:
            return jsonify({
                "status": "error",
                "message": "Invalid type"
            }), 400

        return jsonify({
            "status": "success",
            "result": result
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500


# ==============================
# INGEST API (OPTIONAL)
# ==============================
@app.route("/ingest", methods=["POST"])
def ingest():
    try:
        from functions.data_loader import df  # 🔥 ensure this exists

        count = 0

        for _, row in df.iterrows():
            data = {
                "text": row["clean_text"],
                "issue": row["issue_category"],
                "urgency": row["urgency"],
                "location": row["location_text"],
                "cluster_id": row["cluster_id"]
            }

            upsert_with_storage(data)
            count += 1

            if count >= 200:
                break

        return jsonify({
            "status": "success",
            "message": "Ingestion completed",
            "records_processed": count
        })

    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500



# ==============================
# RUN SERVER
# ==============================
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)