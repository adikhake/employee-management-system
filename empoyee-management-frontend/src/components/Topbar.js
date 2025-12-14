import React from "react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <header className="topbar">
      <div className="brand">Employee Dashboard</div>

      <div className="top-actions">
        {token ? (
          <>
            <button onClick={() => navigate("/profile")} className="link-btn">
              Profile
            </button>
            <button onClick={logout} className="link-btn">
              Logout
            </button>
          </>
        ) : (
          <button onClick={() => navigate("/login")} className="link-btn">
            Login
          </button>
        )}
      </div>
    </header>
  );
}
