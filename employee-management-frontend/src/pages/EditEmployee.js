import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/api";

export default function EditEmployee() {
  const { id } = useParams(); 
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [gender, setGender] = useState("");
  const [birthDate, setBirthDate] = useState("");

  useEffect(() => {
    if (!id) {
      setError("No employee id provided in route.");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        console.log("EditEmployee: token =>", localStorage.getItem("token"));
        console.log("EditEmployee: user =>", JSON.parse(localStorage.getItem("user") || "null"));

        const res = await api.get(`/employees/${id}`);
        const e = res.data ?? {};
        console.log("Fetched employee (res.data):", e);

        setFirstName(e.firstName ?? e.first_name ?? "");
        setLastName(e.lastName ?? e.last_name ?? "");
        setEmail(e.email ?? e.username ?? "");
        setMobile(e.mobile ?? e.phone ?? "");
        setCountry(e.country ?? "");
        setCity(e.city ?? "");
        setGender(e.gender ?? "");
        setBirthDate(e.birthDate ?? e.birth_date ?? "");
      } catch (err) {
        console.error("Load employee error:", err);
        if (err?.response?.status === 401) {
          setError("Authentication required to load this employee. (401)");
         
        } else {
          setError(err?.response?.data?.message || err?.message || "Failed to load employee");
        }
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id, navigate]);

  const onSubmit = async (ev) => {
    ev.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    const payloadCamel = {
      firstName,
      lastName,
      email,
      mobile,
      country,
      city,
      gender,
      birthDate,
    };

    const payloadSnake = {
      first_name: firstName,
      last_name: lastName,
      email,
      mobile,
      country,
      city,
      gender,
      birth_date: birthDate,
    };
    try {
      await api.put(`/employees/${id}`, payloadCamel);
      setSuccess("Employee updated successfully.");
      setTimeout(() => navigate("/employee/search"), 700);
    } catch (err) {
      console.error("Update error:", err);
      if (err?.response?.status === 401) {
        setError("Authentication required to update this employee. (401)");       
      } else {
        setError(err?.response?.data?.message || err?.message || "Update failed");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2>Edit Employee</h2>

      {loading && <div>Loading employee...</div>}
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
      {success && <div style={{ color: "green", marginBottom: 8 }}>{success}</div>}

      {!loading && (
        <form onSubmit={onSubmit} className="employee-form">
          <div>
            <label>First Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
          </div>

          <div>
            <label>Last Name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />
          </div>

          <div>
            <label>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>

          <div>
            <label>Mobile</label>
            <input value={mobile} onChange={(e) => setMobile(e.target.value)} />
          </div>

          <div>
            <label>Country</label>
            <input value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>

          <div>
            <label>City</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} />
          </div>

          <div>
            <label>Birth Date</label>
            <input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="YYYY-MM-DD" />
          </div>

          <div>
            <label>Gender</label>
            <select value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div style={{ marginTop: 12 }}>
            <button className="primary" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => navigate("/employee/search")} style={{ marginLeft: 8 }}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
