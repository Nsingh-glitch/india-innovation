import { motion } from "framer-motion";
import leaderImg from "../../media/abc.jpeg"; // 🔁 replace with your image path

function LeadershipStory() {
  return (
    <section
      style={{
        padding: "100px 60px",
        background: "linear-gradient(135deg, #eef2ff, #f8fafc)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "60px",
          flexWrap: "wrap",
        }}
      >
        {/* 🔥 LEFT - IMAGE */}
        <motion.div
          style={{
            flex: "1",
            minWidth: "320px",
          }}
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src={leaderImg}
            alt="Leader interacting with citizen"
            style={{
              width: "100%",
              borderRadius: "20px",
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
              objectFit: "cover",
            }}
          />
        </motion.div>

        {/* 🔥 RIGHT - TEXT */}
        <motion.div
          style={{
            flex: "1",
            minWidth: "320px",
          }}
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              marginBottom: "20px",
              color: "#2563eb",
            }}
          >
            Leadership that Listens
          </h2>

          <p
            style={{
              fontSize: "18px",
              color: "#374151",
              lineHeight: "1.7",
              marginBottom: "20px",
            }}
          >
            “True leadership begins by listening. Every voice matters — from the
            smallest concern to the biggest issue. LokPulse empowers leaders to
            understand citizens in real-time and take meaningful action.”
          </p>

          <div
            style={{
              padding: "20px",
              borderRadius: "16px",
              background: "rgba(255,255,255,0.6)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            <p style={{ margin: 0, color: "#1f2937", fontWeight: "500" }}>
              AI-driven governance bridges the gap between people and leaders —
              ensuring faster response, deeper understanding, and impactful
              decisions.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default LeadershipStory;