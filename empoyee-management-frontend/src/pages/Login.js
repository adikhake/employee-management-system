import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const navigate = useNavigate();

  function decodeJwtPayload(token) {
    try {
      const raw = token.startsWith("Bearer ") ? token.split(" ")[1] : token;
      const payload = raw.split(".")[1];
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const json = atob(base64); 
      return JSON.parse(decodeURIComponent(escape(json)));
    } catch (e) {
      return null;
    }
  }

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    try {
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      const res = await api.post("/auth/login", { email, password });
      const tokenFromServer = res?.data?.token ?? res?.data; 

      if (!tokenFromServer) {
        throw new Error("No token returned from server");
      }

      const bearer = tokenFromServer.startsWith("Bearer ")
        ? tokenFromServer
        : `Bearer ${tokenFromServer}`;

      localStorage.setItem("token", bearer);

      let userObj = res?.data?.user ?? null;

      if (!userObj) {
        const payload = decodeJwtPayload(tokenFromServer);
        if (payload) {
          const roles =
            payload.roles ||
            payload.authorities ||
            payload.role ||
            payload.roles?.map?.((r) => r) ||
            null;

          userObj = {
            id: payload.sub || payload.userId || payload.id || null,
            username: payload.sub || payload.username || payload.email || null,
            email: payload.email || null,
            roles: Array.isArray(roles)
              ? roles
              : roles
              ? [roles]
              : [],
            claims: payload,
          };
        }
      }

      if (userObj) {
        localStorage.setItem("user", JSON.stringify(userObj));
      } else {
        console.warn("Login: no user info available in response or token payload");
      }

      navigate("/home");
    } catch (error) {
      console.error(error);
      setErr(error?.response?.data?.message || error.message || "Login failed");
    }
  };

  return (
    <div className="auth-card">
      <h2>Sign In</h2>
      {err && <div className="error">{err}</div>}
      <form onSubmit={submit}>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="primary" type="submit">
          Sign In
        </button>
      </form>
      <div style={{ marginTop: 12 }}>
        <button onClick={() => navigate("/register")} className="link-btn">
          Register
        </button>
      </div>
    </div>
  );
}
