import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { MdWarning } from "react-icons/md";
import "./alerts.css";

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    fetchAlerts();
  }, []);

  async function fetchAlerts() {
    const { data, error } = await supabase
      .from("processed_events")
      .select("*");

    if (error || !data) {
      console.error(error);
      return;
    }

    const clusters = {};

    // 🔥 GROUP BY CLUSTER
    data.forEach((event) => {
      const id = event.cluster_id || "unknown";

      if (!clusters[id]) {
        clusters[id] = {
          cluster_id: id,
          issue_category: event.issue_category,
          geo_unit_id: event.geo_unit_id,
          total_events: 0,
          high_urgency_count: 0,
          medium_urgency_count: 0,
          negative_count: 0,
          trust_sum: 0,
        };
      }

      const c = clusters[id];

      c.total_events++;

      if (event.urgency === "high") c.high_urgency_count++;
      if (event.urgency === "medium") c.medium_urgency_count++;
      if (event.sentiment === "negative") c.negative_count++;

      c.trust_sum += event.trust_score || 0;
    });

    // 🔥 COMPUTE + FILTER
    const result = Object.values(clusters)
      .map((c) => {
        const avg_trust = c.trust_sum / c.total_events;

        const cluster_score =
          (c.high_urgency_count * 3 +
            c.medium_urgency_count * 2 +
            c.negative_count * 2) /
          c.total_events;

        const severity_score = Math.min(
          Math.round(cluster_score * 30), // normalize to %
          100
        );

        return {
          ...c,
          avg_trust,
          severity_score,
        };
      })
      .filter(
        (c) =>
          c.total_events >= 2 &&
          c.high_urgency_count >= 1 &&
          c.negative_count >= Math.ceil(c.total_events / 2) &&
          c.avg_trust >= 0.6 &&
          c.severity_score >= 60
      )
      .sort((a, b) => b.severity_score - a.severity_score);

    setAlerts(result);
  }

  // 🎨 COLOR LOGIC
  function getColor(score) {
    if (score >= 80) return "red";
    if (score >= 60) return "yellow";
    return "green";
  }

  return (
    <div className="alerts-page">

      {/* 🔥 HEADER */}
      <div className="alerts-header">
        <MdWarning />
        High Priority Alerts
      </div>

      {alerts.length === 0 && (
        <p style={{ marginTop: "20px", color: "#64748b" }}>
          No critical alerts
        </p>
      )}

      <div className="alerts-grid">
        {alerts.map((a) => (
          <div
            key={a.cluster_id}
            className={`alert-card ${getColor(a.severity_score)}`}
          >

            {/* HEADER */}
            <div className="alert-header">
              <h3>{a.issue_category.toUpperCase()}</h3>

              <span className="badge">
                <MdWarning className="alert-icon" />
                High Alert
              </span>
            </div>

            {/* DETAILS */}
            <div className="alert-details">
              <p><strong>📍 Location:</strong> {a.geo_unit_id}</p>
              <p><strong>📢 Complaints:</strong> {a.total_events}</p>
              <p><strong>⚡ Severity:</strong> {a.severity_score}%</p>
            </div>

            {/* PROGRESS */}
            <div className="progress">
              <div
                className="progress-bar"
                style={{ width: `${a.severity_score}%` }}
              />
            </div>

            {/* TRUST */}
            <p className="trust">
              Trust Score: {a.avg_trust.toFixed(2)}
            </p>

          </div>
        ))}
      </div>

    </div>
  );
}