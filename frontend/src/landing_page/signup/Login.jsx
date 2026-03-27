import { useState } from "react";
import { signIn } from "../lib/auth";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 loading state
  const navigate = useNavigate();

  async function handleLogin() {
    setLoading(true);

    const { error } = await signIn(email, password);

    if (error) {
      alert(error.message);
      setLoading(false);
    } else {
      navigate("/");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #dbeafe, #f0f9ff)",
      }}
    >
      {/* 🔥 CARD */}
      <div
        style={{
          width: "380px",
          padding: "35px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(12px)",
          boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
          border: "1px solid rgba(255,255,255,0.4)",
          textAlign: "center",
        }}
      >
        {/* 🔥 TITLE */}
        <h2 style={{ marginBottom: "10px", color: "#1f2937" }}>
          Welcome Back
        </h2>

        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "25px" }}>
          Login to continue to LokPulse 🚀
        </p>

        {/* 🔥 INPUTS */}
        <input
          type="email"
          placeholder="Email"
          disabled={loading}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />

        <input
          type="password"
          placeholder="Password"
          disabled={loading}
          onChange={(e) => setPassword(e.target.value)}
          style={inputStyle}
        />

        {/* 🔥 BUTTON */}
        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.target.style.transform = "scale(1.05)";
              e.target.style.boxShadow =
                "0 12px 30px rgba(37,99,235,0.4)";
            }
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "scale(1)";
            e.target.style.boxShadow =
              "0 6px 15px rgba(37,99,235,0.2)";
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* 🔥 FOOTER */}
        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Don’t have an account?{" "}
          <span
            style={{ color: "#2563eb", cursor: "pointer" }}
            onClick={() => navigate("/signup")}
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  marginBottom: "15px",
  borderRadius: "8px",
  border: "1px solid #d1d5db",
  outline: "none",
  fontSize: "14px",
};

const buttonStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "10px",
  border: "none",
  background: "#2563eb",
  color: "white",
  fontWeight: "600",
  transition: "all 0.3s ease",
  boxShadow: "0 6px 15px rgba(37,99,235,0.2)",
};

export default Login;