import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

function CTASection() {
  const navigate = useNavigate();
  return (
    <section
      style={{
        padding: "70px 20px",
        textAlign: "center",
        background: "linear-gradient(to right, #e0f2fe, #dbeafe)", // ✅ FIXED
      }}
    >
      <h2
        className="fw-bold"
        style={{ color: "#1f2937" }} // dark text now
      >
        Empower Decisions with LokPulse
      </h2>

      <p style={{ color: "#374151" }}>
        Transform data into action. Lead with confidence.
      </p>

      {/* 🔥 ANIMATED BUTTON */}
      <motion.button
      onClick={() => navigate("/dashboard")} 
        whileHover={{
          scale: 1.08,
          y: -3,
          boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
        }}
        whileTap={{ scale: 0.97 }}
        style={{
          marginTop: "20px",
          padding: "14px 32px",
          borderRadius: "12px",
          border: "none",
          background: "#2563eb", // primary blue button
          color: "white",
          fontWeight: "600",
          cursor: "pointer",
          boxShadow: "0 10px 25px rgba(37,99,235,0.3)",
        }}
      >
        Explore Dashboard
      </motion.button>
    </section>
  );
}

export default CTASection;