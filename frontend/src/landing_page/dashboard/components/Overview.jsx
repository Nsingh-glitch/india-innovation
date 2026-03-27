import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import {
  PieChart, Pie, Cell,
  BarChart, Bar,
  LineChart, Line,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#22c55e", "#ef4444", "#f59e0b"];

export default function Overview() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data } = await supabase
      .from("processed_events")
      .select("*");

    setData(data || []);
  }

  // 🔥 PROCESS DATA
  const sentiment = {};
  const category = {};
  const negativeByRegion = {};
  const trustTrend = [];

  data.forEach((d, index) => {
    // sentiment
    sentiment[d.sentiment] = (sentiment[d.sentiment] || 0) + 1;

    // category
    category[d.issue_category] =
      (category[d.issue_category] || 0) + 1;

    // ✅ FIXED REGION FIELD
    const region = d.location_text || "Unknown";

    if (d.sentiment === "negative") {
      negativeByRegion[region] =
        (negativeByRegion[region] || 0) + 1;
    }

    // trust trend
    trustTrend.push({
      index: index + 1,
      trust: d.trust_score || 0,
    });
  });

  // 🔥 FORMAT DATA
  const sentimentData = Object.entries(sentiment).map(([k, v]) => ({
    name: k,
    value: v,
  }));

  const categoryData = Object.entries(category).map(([k, v]) => ({
    name: k,
    value: v,
  }));

  const max = Math.max(...Object.values(negativeByRegion), 1);

  // 🔥 HEATMAP COLOR (RED-YELLOW-GREEN)
  function getHeatmapColor(value) {
    const ratio = value / max;

    if (ratio < 0.33) return "#22c55e"; // green
    if (ratio < 0.66) return "#facc15"; // yellow
    return "#ef4444"; // red
  }

  return (
    <div className="overview">

      {/* 🔥 STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <p>Total Issues</p>
          <h2>{data.length}</h2>
        </div>

        <div className="stat-card red">
          <p>Negative</p>
          <h2>{sentiment["negative"] || 0}</h2>
        </div>

        <div className="stat-card blue">
          <p>Regions</p>
          <h2>{Object.keys(negativeByRegion).length}</h2>
        </div>
      </div>

      {/* 🔥 CHARTS */}
      <div className="charts-grid">

        {/* PIE */}
        <div className="chart-card">
          <h3>Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={sentimentData} dataKey="value">
                {sentimentData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* BAR */}
        <div className="chart-card">
          <h3>Issue Categories</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={categoryData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* 🔥 LINE CHART */}
      <div className="chart-card">
        <h3>Trust Score Trend</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={trustTrend}>
            <XAxis dataKey="index" />
            <YAxis domain={[0, 1]} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="trust"
              stroke="#22c55e"
              strokeWidth={2}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 🔥 HEATMAP */}
      <div className="chart-card">
        <h3>🔥 Negative Sentiment by Region</h3>

        <div className="heatmap-grid">
          {Object.entries(negativeByRegion).map(([region, value]) => (
            <div
              key={region}
              className="heatmap-cell"
              style={{
                background: getHeatmapColor(value),
              }}
            >
              <span>{region}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}