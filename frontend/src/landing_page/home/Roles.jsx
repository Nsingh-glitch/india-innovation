import { motion } from "framer-motion";
import { FaUserTie } from "react-icons/fa";
import { MdAdminPanelSettings } from "react-icons/md";
import { RiTeamFill } from "react-icons/ri";

function Roles() {
  const roles = [
    {
      icon: <FaUserTie size={28} />,
      title: "Politicians",
      desc: "Understand voter sentiment, track constituency issues, generate speeches instantly.",
    },
    {
      icon: <MdAdminPanelSettings size={28} />,
      title: "Administrators",
      desc: "Monitor public services, track complaints, make data-driven policy decisions.",
    },
    {
      icon: <RiTeamFill size={28} />,
      title: "Campaign Teams",
      desc: "Booth-level intelligence, sentiment mapping, and real-time campaign adjustments.",
    },
  ];

  return (
    <section
      style={{
        padding: "90px 60px",
        background: "linear-gradient(135deg, #ffffff, #eef2ff)", // subtle blue blend
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "2.5rem",
          fontWeight: "700",
          color: "#2563eb"
        }}
      >
        Built For Public Leaders
      </h2>

      <p
        style={{
          textAlign: "center",
          marginTop: "10px",
          marginBottom: "50px",
          color: "#6b7280",
        }}
      >
        Tailored solutions for every role in governance.
      </p>

      <div style={{ display: "flex", justifyContent: "center", gap: "50px" }}>
        {roles.map((role, index) => (
          <motion.div
            key={index}
            style={{
              width: "300px",
              textAlign: "center",
              padding: "30px",
              borderRadius: "18px",
              background: "rgba(255,255,255,0.7)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
              border: "1px solid rgba(255,255,255,0.5)",
            }}
            whileHover={{
              y: -10,
              scale: 1.03,
              boxShadow: "0 20px 50px rgba(0,0,0,0.15)",
            }}
          >
            {/* ICON */}
            <div
              style={{
                width: "75px",
                height: "75px",
                margin: "0 auto 20px",
                background: "linear-gradient(135deg, #f97316, #fb923c)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "18px",
                color: "#fff",
                boxShadow: "0 10px 25px rgba(249,115,22,0.4)",
              }}
            >
              {role.icon}
            </div>

            <h4 style={{ color: "#111827" }}>{role.title}</h4>

            <p style={{ color: "#6b7280", fontSize: "15px" }}>
              {role.desc}
            </p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export default Roles;