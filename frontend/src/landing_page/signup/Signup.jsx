import { useState } from "react";
import { signUp, signIn } from "../lib/auth";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // 🔥 NEW
  const navigate = useNavigate();

  async function handleSignup() {
    setLoading(true); // 🔥 start loading

    const { error } = await signUp(email, password);

    if (error) {
      alert(error.message);
      setLoading(false);
      return;
    }

    const { error: loginError } = await signIn(email, password);

    if (loginError) {
      alert(loginError.message);
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
        <h2 style={{ marginBottom: "10px", color: "#1f2937" }}>
          Create Account
        </h2>

        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "25px" }}>
          Join LokPulse and get started 🚀
        </p>

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

        {/* 🔥 BUTTON WITH LOADING */}
        <button
          onClick={handleSignup}
          disabled={loading}
          style={{
            ...buttonStyle,
            opacity: loading ? 0.7 : 1,
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Signing in..." : "Sign Up"} {/* 🔥 TEXT CHANGE */}
        </button>

        <p style={{ marginTop: "20px", fontSize: "14px" }}>
          Already have an account?{" "}
          <span
            style={{ color: "#2563eb", cursor: "pointer" }}
            onClick={() => navigate("/login")}
          >
            Log In
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

export default Signup;