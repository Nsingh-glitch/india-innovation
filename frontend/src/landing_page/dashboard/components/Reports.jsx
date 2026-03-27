import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { MdInsights } from "react-icons/md";
import "./reports.css";

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [filterDays, setFilterDays] = useState(30);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchReports();
  }, [filterDays]);

  async function fetchReports() {
    try {
      const now = new Date();
      const pastDate = new Date();
      pastDate.setDate(now.getDate() - filterDays);

      const { data, error } = await supabase
        .from("report")
        .select("*")
        .gte("created_at", pastDate.toISOString())
        .order("created_at", { ascending: false });

      if (!error) setReports(data);
    } catch (err) {
      console.error(err);
    }
  }

  // 🔥 GENERATE REPORT (MAIN FEATURE)
  async function generateReport() {
    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:5000/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "report",
          days: filterDays,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Generation failed");
      }

      // 🔥 INSTANT UI UPDATE
      const newReport = {
        id: Date.now(),
        report_text: data.result.report,
        suggested_actions: data.result.suggested_actions,
        created_at: new Date().toISOString(),
      };

      setReports((prev) => [newReport, ...prev]);

      // 🔥 Sync with DB later
      setTimeout(fetchReports, 2000);

    } catch (err) {
      console.error(err);
      alert("Report generation failed");
    }

    setLoading(false);
  }

  return (
    <div className="reports-page">

      {/* HEADER */}
      <div className="reports-header">
        <MdInsights />
        Reports & Suggestions
      </div>

      {/* FILTER + BUTTON */}
      <div className="report-filter">

        <select
          value={filterDays}
          onChange={(e) => setFilterDays(Number(e.target.value))}
        >
          <option value={30}>Last 30 Days</option>
          <option value={60}>Last 60 Days</option>
          <option value={180}>Last 180 Days</option>
        </select>

        {/* 🔥 GENERATE BUTTON */}
        <button
          className="generate-btn"
          onClick={generateReport}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>

      </div>

      {/* GRID */}
      <div className="report-grid">
        {reports.map((r) => (
          <div key={r.id} className="report-card">

            {/* DATE */}
            <div className="report-date">
              {new Date(r.created_at).toLocaleDateString()}
            </div>

            {/* TWO COLUMN */}
            <div className="report-content">

              <div className="report-box">
                <h3>📊 Report</h3>
                <p>{r.report_text}</p>
              </div>

              <div className="action-box">
                <h3>💡 Suggested Actions</h3>
                <p>{r.suggested_actions}</p>
              </div>

            </div>

          </div>
        ))}
      </div>

    </div>
  );
}