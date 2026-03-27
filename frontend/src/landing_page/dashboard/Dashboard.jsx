import { useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "./Sidebar";
import Overview from "./components/Overview";
import Alerts from "./components/Alerts";
import ScriptGen from "./components/ScriptGen";
import Reports from "./components/Reports"; // ✅ NEW

import "./dashboard.css";

export default function Dashboard() {
  const [active, setActive] = useState("overview");
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="dashboard">

      {/* 🔥 TOPBAR */}
      <div className="topbar">
        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
        >
          {open ? "✖" : "☰"}
        </button>

        <h2
          className="title clickable"
          onClick={() => navigate("/")}
        >
          LokPulse
        </h2>
      </div>

      {/* 🔥 SIDEBAR */}
      <Sidebar
        open={open}
        setOpen={setOpen}
        active={active}
        setActive={setActive}
      />

      {/* 🔥 OVERLAY */}
      {open && (
        <div
          className="overlay"
          onClick={() => setOpen(false)}
        />
      )}

      {/* 🔥 MAIN CONTENT */}
      <div className={`main ${open ? "shifted" : ""}`}>

        {active === "overview" && <Overview />}

        {active === "alerts" && <Alerts />}

        {active === "scripts" && <ScriptGen />}

        {active === "reports" && <Reports />} {/* ✅ NEW */}

      </div>

    </div>
  );
}