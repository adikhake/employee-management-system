import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    country: "",
    city: "",
    birthDate: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await api.post("http://localhost:8080/api/auth/register", form);
      setMsg("Registered successfully. Please login.");
      setTimeout(() => navigate("/login"), 1200);
    } catch (err) {
      setMsg(err?.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="card">
      <h2>Register</h2>
      {msg && <div className="info">{msg}</div>}
      <form onSubmit={submit}>
        <div className="grid">
          <div>
            <label>First Name</label>
            <input
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              required
            />
          </div>
          <div>
            <label>Last Name</label>
            <input name="lastName" value={form.lastName} onChange={onChange} />
          </div>
        </div>
        <label>Email</label>
        <input name="email" value={form.email} onChange={onChange} required />
        <label>Mobile</label>
        <input name="mobile" value={form.mobile} onChange={onChange} />
        <div className="grid">
          <div>
            <label>Country</label>
            <input name="country" value={form.country} onChange={onChange} />
          </div>
          <div>
            <label>City</label>
            <input name="city" value={form.city} onChange={onChange} />
          </div>
        </div>
        <label>Date of Birth</label>
        <input
          type="date"
          name="birthDate"
          value={form.birthDate}
          onChange={onChange}
        />
        <label>Password</label>
        <input
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          required
        />
        <button className="primary" type="submit">
          Register
        </button>
      </form>
      <div>
        <button onClick={() => navigate("/login")} className="link-btn">
          Login
        </button>
      </div>
    </div>
  );
}
