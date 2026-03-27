import { motion } from "framer-motion";
import { FaBrain, FaChartLine, FaUsers } from "react-icons/fa";

function FeaturesOverview() {
  const data = [
    {
      icon: <FaBrain size={35} color="#2563eb" />,
      title: "AI Intelligence",
      desc: "LLM-powered insights and summaries.",
    },
    {
      icon: <FaChartLine size={35} color="#2563eb" />,
      title: "Real-Time Analytics",
      desc: "Track trends and sentiment instantly.",
    },
    {
      icon: <FaUsers size={35} color="#2563eb" />,
      title: "Public Impact",
      desc: "Understand citizens and act faster.",
    },
  ];

  return (
    <section
      style={{
        padding: "60px 20px",
        background: "linear-gradient(to right, #e0f2fe, #dbeafe)",
      }}
    >
      <div className="container">
        <div className="row g-4 text-center">
          {data.map((item, index) => (
            <div className="col-md-4" key={index}>
              <motion.div
                whileHover={{ scale: 1.05 }}
                style={{
                  padding: "30px",
                  borderRadius: "16px",
                  background: "white",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                }}
              >
                {item.icon}
                <h5 className="fw-bold mt-3">{item.title}</h5>
                <p style={{ color: "#6b7280" }}>{item.desc}</p>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesOverview;