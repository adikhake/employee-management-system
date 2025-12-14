import React, { useEffect, useState } from "react";
import api from "../api/api";

export default function Profile() {
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

  // Load logged-in user's profile
  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await api.get("/employees/me");
        const e = res.data;

        setFirstName(e.firstName || "");
        setLastName(e.lastName || "");
        setMobile(e.mobile || "");
        setCountry(e.country || "");
        setCity(e.city || "");
        setGender(e.gender || "");
        setBirthDate(e.birthDate || "");
      } catch (err) {
        console.error(err);
        setError("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  // Update profile
  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    const payload = {
      firstName,
      lastName,
      mobile,
      country,
      city,
      gender,
      birthDate
    };

    try {
      await api.put("/employee/me", payload);
      setSuccess("Profile updated successfully");
    } catch (err) {
      console.error(err);
      setError("Profile update failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="card">
      <h2>My Profile</h2>

      {loading && <div>Loading profile...</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
      {success && <div style={{ color: "green" }}>{success}</div>}

      {!loading && (
        <form onSubmit={onSubmit}>
          <label>First Name</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} required />

          <label>Last Name</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} required />

          <label>Mobile</label>
          <input value={mobile} onChange={(e) => setMobile(e.target.value)} />

          <label>Country</label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} />

          <label>City</label>
          <input value={city} onChange={(e) => setCity(e.target.value)} />

          <label>Birth Date</label>
          <input value={birthDate} onChange={(e) => setBirthDate(e.target.value)} placeholder="YYYY-MM-DD" />

          <label>Gender</label>
          <select value={gender} onChange={(e) => setGender(e.target.value)}>
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>

          <br />
          <button className="primary" type="submit" disabled={saving}>
            {saving ? "Saving..." : "Update Profile"}
          </button>
        </form>
      )}
    </div>
  );
}
