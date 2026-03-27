import { motion } from "framer-motion";

function AIWorkflowSection() {
  return (
    <section
      className="text-center py-5"
      style={{ background: "linear-gradient(135deg, #dbeafe, #eef2ff)" }}
    >
      {/* 🔥 TITLE */}
      <motion.h2
        className="fw-bold mb-4"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        style={{ fontSize: "2.3rem" }}
      >
        <span style={{ color: "#2563eb" }}>
          Your AI Co-Pilot in Action
        </span>
      </motion.h2>

      {/* 🔥 CONTENT */}
      <div className="row container mx-auto">
        <div className="col-md-4">
          <h5 className="fw-bold">📊 Analyze</h5>
          <p>Monitor public sentiment</p>
        </div>

        <div className="col-md-4">
          <h5 className="fw-bold">🧠 Generate</h5>
          <p>Create AI-driven responses</p>
        </div>

        <div className="col-md-4">
          <h5 className="fw-bold">⚡ Act</h5>
          <p>Respond instantly</p>
        </div>
      </div>
    </section>
  );
}

export default AIWorkflowSection;