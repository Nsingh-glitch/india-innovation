import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import { API_URL } from "../../../config";
import { MdCampaign } from "react-icons/md";
import toast from "react-hot-toast";
import "./scriptgen.css";

export default function ScriptGen() {
  const [scripts, setScripts] = useState([]);
  const [latest, setLatest] = useState(null);
  const [location, setLocation] = useState("ward_1");
  const [language, setLanguage] = useState("English");
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchScripts();
  }, []);

  async function fetchScripts() {
    try {
      const { data, error } = await supabase
        .from("Speech")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase fetch error:", error);
        setErrorMessage("Could not load generated speeches.");
        return [];
      }

      const rows = data || [];
      setScripts(rows);
      setLatest(rows[0] || null);
      return rows;
    } catch (err) {
      console.error("fetchScripts error:", err);
      setErrorMessage("Something went wrong while loading speeches.");
      return [];
    }
  }

  function parseWardFromInput(input) {
    if (!input) return "";
    return input.split("|")[0].trim();
  }

  function matchesGeneratedSpeech(speech, requestedWard, requestedLanguage) {
    if (!speech) return false;

    const dbWard = parseWardFromInput(speech.input);
    const dbLanguage = speech.metadata?.language || "";

    const wardMatches = dbWard.toLowerCase() === requestedWard.toLowerCase();
    const langMatches = dbLanguage.toLowerCase() === requestedLanguage.toLowerCase();

    return wardMatches && langMatches;
  }

  async function waitForMatchingSpeech(previousLatestId, requestedWard, requestedLanguage) {
    const MAX_ATTEMPTS = 10;
    const DELAY_MS = 1000;

    for (let i = 0; i < MAX_ATTEMPTS; i++) {
      await new Promise((resolve) => setTimeout(resolve, DELAY_MS));

      const { data, error } = await supabase
        .from("Speech")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error) {
        console.error("Polling error:", error);
        continue;
      }

      if (
        data &&
        data.id !== previousLatestId &&
        matchesGeneratedSpeech(data, requestedWard, requestedLanguage)
      ) {
        return data;
      }
    }

    return null;
  }

  async function generateScript() {
    setLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    const requestedLocation = location;
    const requestedLanguage = language;
    const previousLatestId = latest?.id ?? null;

    const loadingToast = toast.loading("Generating speech...");

    try {
      const response = await fetch(`${API_URL}/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "speech",
          location: requestedLocation,
          language: requestedLanguage,
        }),
      });

      let responseData = null;
      try {
        responseData = await response.json();
      } catch {
        responseData = null;
      }

      if (!response.ok) {
        const message =
          responseData?.detail?.message ||
          responseData?.detail ||
          responseData?.message ||
          responseData?.error ||
          "Speech generation failed.";
        throw new Error(message);
      }

      const matchedSpeech = await waitForMatchingSpeech(
        previousLatestId,
        requestedLocation,
        requestedLanguage
      );

      await fetchScripts();

      if (!matchedSpeech) {
        const msg = `No new speech was found for ${requestedLocation} in ${requestedLanguage}.`;
        setSuccessMessage("");
        setErrorMessage(msg);
        toast.dismiss(loadingToast);
        toast.error(msg);
        return;
      }

      setLatest(matchedSpeech);

      const msg = `Speech generated successfully for ${requestedLocation} in ${requestedLanguage}.`;
      setSuccessMessage(msg);
      setErrorMessage("");
      toast.dismiss(loadingToast);
      toast.success(msg);
    } catch (err) {
      console.error("generateScript error:", err);
      const msg = err.message || "Speech could not be generated.";
      setSuccessMessage("");
      setErrorMessage(msg);
      toast.dismiss(loadingToast);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="script-page">
      <div className="script-header">
        <MdCampaign />
        AI Speech Generator
      </div>

      <div className="script-input-box">
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 12].map((i) => (
            <option key={i} value={`ward_${i}`}>
              ward_{i}
            </option>
          ))}
        </select>

        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          <option>English</option>
          <option>Hindi</option>
          <option>Tamil</option>
          <option>Hinglish</option>
        </select>

        <button onClick={generateScript} disabled={loading}>
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>

      {successMessage && (
        <div className="status-message success">{successMessage}</div>
      )}

      {errorMessage && (
        <div className="status-message error">{errorMessage}</div>
      )}

      {latest && (
        <div className="latest-card">
          <h2>✨ Latest Generated Speech</h2>

          <div className="script-card highlight">
            <div className="script-top">
              <h3>📍 {latest.input}</h3>
              <span>{new Date(latest.created_at).toLocaleString()}</span>
            </div>

            <p
              className="speech-text expanded"
              style={{ fontFamily: '"Noto Sans Tamil", system-ui, sans-serif' }}
            >
              {latest.output}
            </p>
          </div>
        </div>
      )}

      <h2 className="section-title">Recent Speeches</h2>

      <div className="script-grid">
        {scripts.slice(1).map((s) => {
          const isOpen = expanded[s.id];

          return (
            <div key={s.id} className="script-card">
              <div className="script-top">
                <h3>📍 {s.input}</h3>
                <span>{new Date(s.created_at).toLocaleString()}</span>
              </div>

              <p
                className={`speech-text ${isOpen ? "expanded" : ""}`}
                style={{ fontFamily: '"Noto Sans Tamil", system-ui, sans-serif' }}
              >
                {s.output}
              </p>

              {s.output?.length > 120 && (
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