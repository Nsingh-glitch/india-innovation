from flask import Flask, request, jsonify

from functions.report import generate_full_report
from functions.speech import generate_speech


app = Flask(__name__)

# ==============================
# HEALTH CHECK
# ==============================
@app.route("/", methods=["GET"])
def home():
    return {
        "message": "RAG API is running 🚀",
        "status": "healthy",
        "endpoints": {
            "POST /generate": {
                "type": ["qa", "report", "speech"]
            },
            "POST /ingest": "Ingest dataset into Supabase + Pinecone"
        }
    }


# ==============================
# MAIN GENERATE API
# ==============================
@app.route("/generate", methods=["POST"])
def generate():
    data = request.json

    if not data or "type" not in data:
        return jsonify({"error": "Missing 'type' in request"}), 400

    try:
        if data["type"] == "qa":
            pass
            # return jsonify({
            #     "result": rag_pipeline(data.get("query", ""))
            # })

        elif data["type"] == "report":
            return jsonify({
                "result": generate_full_report(
                    data.get("days", 30)   # 🔥 dynamic input
                )
            })

        elif data["type"] == "speech":
            return jsonify({
                "result": generate_speech(
                    data.get("location", ""),
                    data.get("language", "English")   # 🔥 added
                )
            })

        else:
            return jsonify({"error": "Invalid type"}), 400

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==============================
# INGEST API (🔥 VERY USEFUL)
# ==============================
@app.route("/ingest", methods=["POST"])
def ingest():
    try:
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

            # optional limit for safety
            if count >= 200:
                break

        return jsonify({
            "message": "Ingestion completed",
            "records_processed": count
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ==============================
# RUN
# ==============================
if __name__ == "__main__":
    app.run(debug=True)
