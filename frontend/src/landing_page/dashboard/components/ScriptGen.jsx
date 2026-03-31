import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { API_URL } from "../../../config";
import { MdCampaign } from "react-icons/md";
import "./scriptgen.css";

export default function ScriptGen() {
  const [scripts, setScripts] = useState([]);
  const [latest, setLatest] = useState(null);
  const [location, setLocation] = useState("ward_1");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({}); // 🔥 for Read More

  useEffect(() => {
    fetchScripts();
  }, []);

  async function fetchScripts() {
    const { data } = await supabase
      .from("Speech")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) {
      setScripts(data);
      setLatest(data[0]);
    }
  }

async function generateScript() {
  setLoading(true);

  try {
    await fetch(`${API_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        type: "speech",
        location,
        language,
      }),
    });

    setTimeout(() => {
      fetchScripts();
      setLoading(false);
    }, 1000);
  } catch (err) {
    console.error(err);
    setLoading(false);
  }
}
  return (
    <div className="script-page">

      {/* HEADER */}
      <div className="script-header">
        <MdCampaign />
        AI Speech Generator
      </div>

      {/* INPUT */}
      <div className="script-input-box">

        {/* LOCATION */}
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          {[1,2,3,4,5,6,7,8].map(i => (
            <option key={i} value={`ward_${i}`}>
              ward_{i}
            </option>
          ))}
        </select>

        {/* LANGUAGE */}
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Hindi</option>
          <option>Tamil</option>
          <option>Hinglish</option>
        </select>

        {/* BUTTON */}
        <button onClick={generateScript}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {/* 🔥 LATEST */}
      {latest && (
        <div className="latest-card">
          <h2>✨ Latest Generated Speech</h2>

          <div className="script-card highlight">
            <div className="script-top">
              <h3>📍 {latest.input}</h3>
              <span>
                {new Date(latest.created_at).toLocaleString()}
              </span>
            </div>

            <p className="speech-text expanded">
              {latest.output}
            </p>
          </div>
        </div>
      )}

      {/* 🔥 RECENT */}
      <h2 className="section-title">Recent Speeches</h2>

      <div className="script-grid">
        {scripts.slice(1).map((s) => {
          const isOpen = expanded[s.id];

          return (
            <div key={s.id} className="script-card">

              <div className="script-top">
                <h3>📍 {s.input}</h3>
                <span>
                  {new Date(s.created_at).toLocaleString()}
                </span>
              </div>

              {/* TEXT */}
              <p className={`speech-text ${isOpen ? "expanded" : ""}`}>
                {s.output}
              </p>

              {/* READ MORE */}
              {s.output.length > 120 && (
                <span
                  className="read-more"
                  onClick={() =>
                    setExpanded((prev) => ({
                      ...prev,
                      [s.id]: !prev[s.id],
                    }))
                  }
                >
                  {isOpen ? "Show Less ▲" : "Read More ▼"}
                </span>
              )}

            </div>
          );
        })}
      </div>

    </div>
  );
}