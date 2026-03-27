import { motion } from "framer-motion";

function AboutHero() {
  return (
    <section
      style={{
        padding: "80px 20px",
        textAlign: "center",
        background: "linear-gradient(to right, #e0f2fe, #dbeafe)",
      }}
    >
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ fontSize: "3rem", fontWeight: "700", color: "#2563eb" }}
      >
        About LokPulse
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        style={{
          maxWidth: "700px",
          margin: "20px auto",
          fontSize: "18px",
          color: "#374151",
        }}
      >
        LokPulse is an AI-powered Civic Intelligence Copilot that transforms
        raw public data into meaningful insights.
      </motion.p>
    </section>
  );
}

export default AboutHero;