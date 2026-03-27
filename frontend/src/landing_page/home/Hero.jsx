import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
function Hero() {
  const navigate = useNavigate();
  return (
    <section
      style={{
        minHeight: "90vh",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",

        /* 🔥 PURE GLASS BACKGROUND */
        background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
      }}
    >
      {/* 🔥 GLASS TEXTURE LAYER */}
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          background:
            "linear-gradient(120deg, rgba(255,255,255,0.6), rgba(255,255,255,0.3))",
        }}
      />

      {/* 🔥 SOFT GLOW (depth) */}
      <motion.div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          background: "rgba(37,99,235,0.15)",
          borderRadius: "50%",
          filter: "blur(120px)",
          top: "-120px",
          left: "-120px",
        }}
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ repeat: Infinity, duration: 8 }}
      />

      <motion.div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background: "rgba(249,115,22,0.12)",
          borderRadius: "50%",
          filter: "blur(120px)",
          bottom: "-100px",
          right: "-100px",
        }}
        animate={{ scale: [1, 1.15, 1] }}
        transition={{ repeat: Infinity, duration: 10 }}
      />

      {/* 🔥 FLOATING CHIPS */}
      {[
        { text: "🧠 AI Processing Social Signals", pos: { top: "25%", left: "15%" } },
        { text: "📊 Sentiment Rising", pos: { top: "20%", right: "12%" } },
        { text: "📡 Live Data Syncing", pos: { bottom: "25%", left: "12%" } },
        { text: "🔔 New Alert Generated", pos: { bottom: "25%", right: "15%" }, red: true },
      ].map((item, i) => (
        <motion.div
          key={i}
          style={{
            position: "absolute",
            padding: "8px 16px",
            background: "rgba(255,255,255,0.6)",
            backdropFilter: "blur(16px)",
            borderRadius: "20px",
            fontSize: "14px",
            boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
            border: "1px solid rgba(255,255,255,0.4)",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            ...item.pos,
          }}
          animate={{ y: [0, i % 2 === 0 ? -8 : 8, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
        >
          <span className={item.red ? "pulse-dot-red" : "pulse-dot"}></span>
          {item.text}
        </motion.div>
      ))}

      {/* 🔥 MAIN CONTENT */}
      <div style={{ position: "relative", zIndex: 2 }}>
        <motion.h1
          style={{
            fontSize: "3.5rem",
            fontWeight: "700",
            color: "#0f172a",
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Analyze, Act, and Lead
          <br />
          <span style={{ color: "#2563eb" }}>
            with AI-Driven Insights
          </span>
        </motion.h1>

        <motion.p
          style={{
            maxWidth: "650px",
            margin: "20px auto",
            fontSize: "18px",
            color: "#334155",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          LokPulse empowers leaders to track public sentiment, generate
          intelligent responses, and take action in real time.
        </motion.p>

        <motion.div
          style={{ marginTop: "20px" }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {/* PRIMARY */}
          <button
            style={{
                background: "rgba(37,99,235,0.9)",
                color: "#fff",
                padding: "14px 28px",
                borderRadius: "12px",
                border: "none",
                fontWeight: "500",
                boxShadow: "0 10px 25px rgba(37,99,235,0.3)",
                marginRight: "10px",
                backdropFilter: "blur(6px)",
                transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px) scale(1.08)";
                e.target.style.boxShadow =
                "0 20px 40px rgba(37,99,235,0.5)";
            }}
            onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow =
                "0 10px 25px rgba(37,99,235,0.3)";
            }}
            >
            Explore Dashboard
            </button>

          {/* SECONDARY */}
          <button
            onClick={() => navigate("/grievance")} // 🔥 ROUTE HERE
            style={{
              padding: "14px 28px",
              borderRadius: "12px",
              border: "1px solid rgba(0,0,0,0.1)",
              background: "rgba(255,255,255,0.6)",
              fontWeight: "500",
              backdropFilter: "blur(6px)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-3px) scale(1.05)";
              e.target.style.background = "rgba(255,255,255,0.8)";
              e.target.style.boxShadow = "0 15px 30px rgba(0,0,0,0.15)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0) scale(1)";
              e.target.style.background = "rgba(255,255,255,0.6)";
              e.target.style.boxShadow = "none";
            }}
          >
            Raise Grievance
          </button>
        </motion.div>
      </div>

      {/* 🔥 Pulse */}
      <style>
        {`
          .pulse-dot {
            width: 8px;
            height: 8px;
            background: #22c55e;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }

          .pulse-dot-red {
            width: 8px;
            height: 8px;
            background: #ef4444;
            border-radius: 50%;
            animation: pulse 1.5s infinite;
          }

          @keyframes pulse {
            0% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.6); opacity: 0.5; }
            100% { transform: scale(1); opacity: 1; }
          }
        `}
      </style>
    </section>
  );
}

export default Hero;