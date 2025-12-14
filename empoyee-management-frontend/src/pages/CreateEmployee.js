import React, { useState } from "react";
import api from "../api/api";
import { useNavigate } from "react-router-dom";

export default function CreateEmployee() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    country: "",
    city: "",
    birthDate: "",
    gender: "",
    password: "",
  });
  const [msg, setMsg] = useState("");
  const navigate = useNavigate();

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/employees", form);
      setMsg("Saved successfully");
      setTimeout(() => navigate("/employee/search"), 900);
    } catch (error) {
      setMsg(error?.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="card">
      <h2>Create Employee</h2>
      {msg && <div className="info">{msg}</div>}
      <form onSubmit={submit}>
        <div className="grid">
          <div>
            <label>First Name</label>
            <input name="firstName" value={form.firstName} onChange={onChange} required />
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
        <input type="date" name="birthDate" value={form.birthDate} onChange={onChange} />
        <label>Gender</label>
        <select name="gender" value={form.gender} onChange={onChange}>
          <option value="">--select--</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <label>Password</label>
        <input type="password" name="password" value={form.password} onChange={onChange} />

        <div style={{ marginTop: 12 }}>
          <button type="submit" className="primary">Save</button>
        </div>
      </form>
    </div>
  );
}
