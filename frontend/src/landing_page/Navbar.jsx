import { Link, useNavigate } from "react-router-dom";
import logo from "../media/logo-3.svg";
import { useAuth } from "./AuthContext";
import { supabase } from "./lib/supabaseClient";

function Navbar() {
  const navigate = useNavigate();

  // 🔥 SAFE AUTH (prevents crash)
  const auth = useAuth();
  const user = auth?.user;

  async function handleLogout() {
    await supabase.auth.signOut();
    navigate("/"); // redirect after logout
  }

  return (
    <>
      <nav
        className="navbar navbar-expand-lg"
        style={{
          background: "rgba(255,255,255,0.6)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
          position: "sticky",
          top: 0,
          zIndex: 1000,
        }}
      >
        <div className="container-fluid px-4">

          {/* Logo + Brand */}
          <Link className="navbar-brand d-flex align-items-center" to="/">
            <img
              src={logo}
              alt="LokPulse Logo"
              style={{ height: "40px" }}
              className="me-2"
            />
            <span className="fw-bold" style={{ color: "#2563eb" }}>
              LokPulse
            </span>
          </Link>

          {/* Mobile Toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Menu */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">

              <li className="nav-item">
                <Link className="nav-link custom-nav-link" to="/">
                  Home
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link custom-nav-link" to="/features">
                  Features
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link custom-nav-link" to="/about">
                  About
                </Link>
              </li>

              <li className="nav-item">
                <Link className="nav-link custom-nav-link" to="#">
                  Latest News
                </Link>
              </li>

              {/* 🔥 AUTH BASED UI */}

              {!user ? (
                <>
                  <li className="nav-item">
                    <Link className="nav-link custom-nav-link" to="/login">
                      Log In
                    </Link>
                  </li>

                  <li className="nav-item">
                    <Link className="nav-link custom-nav-link" to="/signup">
                      Sign Up
                    </Link>
                  </li>
                </>
              ) : (
                <>
                  {/* Optional: show email */}
                  <li className="nav-item">
                    <span className="nav-link text-dark fw-semibold">
                      {user.email}
                    </span>
                  </li>

                  <li className="nav-item">
                    <button
                      className="nav-link custom-nav-link border-0 bg-transparent"
                      onClick={handleLogout}
                    >
                      Log Out
                    </button>
                  </li>
                </>
              )}

            </ul>
          </div>
        </div>
      </nav>

      {/* 🔥 STYLES */}
      <style>
        {`
          .custom-nav-link {
            margin-right: 12px;
            padding: 8px 14px;
            border-radius: 8px;
            color: #374151;
            font-weight: 500;
            transition: all 0.3s ease;
          }

          .custom-nav-link:hover {
            background-color: rgba(37,99,235,0.1);
            color: #2563eb;
            transform: scale(1.08);
          }
        `}
      </style>
    </>
  );
}

export default Navbar;