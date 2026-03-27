import { motion } from "framer-motion";

function FeatureCard({ icon, title, desc }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05, y: -8 }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        padding: "25px",
        borderRadius: "16px",
        background: "rgba(255,255,255,0.8)",
        backdropFilter: "blur(10px)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        height: "100%",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "32px", color: "#2563eb", marginBottom: "10px" }}>
        {icon}
      </div>

      <h5 className="fw-bold">{title}</h5>

      <p style={{ color: "#6b7280" }}>{desc}</p>
    </motion.div>
  );
}

export default FeatureCard;