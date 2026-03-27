import { motion } from "framer-motion";

function Testimonials() {
  const data = [
    {
      text: `"LokPulse AI transformed how I understand my constituency. The real-time sentiment maps are game-changing."`,
      name: "Rajesh Kumar",
      role: "MLA, Bihar",
    },
    {
      text: `"The AI-generated summaries save us hours every week. It's like having an analyst team on demand."`,
      name: "Priya Sharma",
      role: "District Collector",
    },
    {
      text: `"Booth-level insights helped us target resources exactly where needed. Incredible precision."`,
      name: "Anand Patel",
      role: "Campaign Manager",
    },
  ];

  return (
    <section
  style={{
    padding: "90px 60px",
    background: "linear-gradient(135deg, #dbeafe, #eef2ff)", // 🔥 darker + richer blue
  }}
>
      <h2
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "700",
          marginBottom: "50px",
          color: "#2563eb",
        }}
      >
        Trusted by leaders
      </h2>

      <div style={{ display: "flex", gap: "30px", justifyContent: "center" }}>
        {data.map((item, index) => (
          <motion.div
            key={index}
            style={{
              width: "350px",
              padding: "25px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.6)", // glass
              backdropFilter: "blur(12px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
            whileHover={{
              y: -10,
              scale: 1.02,
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
            }}
          >
            <p
              style={{
                fontStyle: "italic",
                color: "#374151",
                lineHeight: "1.7",
              }}
            >
              {item.text}
            </p>

            <hr style={{ margin: "20px 0", opacity: 0.2 }} />

            <h4 style={{ margin: 0, color: "#111827" }}>{item.name}</h4>
            <p style={{ margin: 0, color: "#6b7280", fontSize: "14px" }}>
              {item.role}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Testimonials;