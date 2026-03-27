export default function ScriptGen() {
  return (
    <div className="card">
      <h3>🤖 AI Script Generator</h3>

      <textarea
        placeholder="Describe issue..."
        style={{
          width: "100%",
          height: "120px",
          marginTop: "10px",
        }}
      />

      <button style={{
        marginTop: "10px",
        padding: "10px",
        background: "#4F46E5",
        color: "white",
        border: "none",
        borderRadius: "8px"
      }}>
        Generate Script
      </button>
    </div>
  );
}