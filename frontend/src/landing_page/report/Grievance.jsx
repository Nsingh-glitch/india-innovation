import { useState } from "react";

function Grievance() {
  const [name, setName] = useState("");
  const [complaint, setComplaint] = useState("");
  const [location, setLocation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();

    if (!complaint || !location) {
      setMessage("❌ Complaint and location are required");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:8000/submit-issue", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name || null,
          complaint,
          location,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Issue submitted successfully");
        setName("");
        setComplaint("");
        setLocation("");
      } else {
        setMessage("❌ Failed to submit issue");
      }
    } catch (error) {
      setMessage("❌ Network error. Backend not running?");
    }

    setLoading(false);
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #e0f2fe, #bfdbfe)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: "500px",
          padding: "30px",
          borderRadius: "20px",
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.15)",
        }}
      >
        <h2 style={{ marginBottom: "20px", textAlign: "center" }}>
          Submit Issue
        </h2>

        {/* NAME */}
        <input
          type="text"
          placeholder="Name (optional)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          style={inputStyle}
        />

        {/* COMPLAINT */}
        <textarea
          placeholder="Describe your issue..."
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          rows={4}
          style={inputStyle}
        />

        {/* LOCATION */}
        <input
          type="text"
          placeholder="Location (required)"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          style={inputStyle}
        />

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: "14px",
            borderRadius: "12px",
            border: "none",
            background: "#2563eb",
            color: "white",
            fontWeight: "600",
            cursor: "pointer",
            transition: "0.3s",
          }}
          onMouseEnter={(e) =>
            (e.target.style.transform = "scale(1.05)")
          }
          onMouseLeave={(e) =>
            (e.target.style.transform = "scale(1)")
          }
        >
          {loading ? "Submitting..." : "Submit Issue"}
        </button>

        {/* MESSAGE */}
        {message && (
          <p
            style={{
              marginTop: "15px",
              textAlign: "center",
              fontWeight: "500",
            }}
          >
            {message}
          </p>
        )}
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "10px",
  border: "1px solid #ccc",
  outline: "none",
};

export default Grievance;