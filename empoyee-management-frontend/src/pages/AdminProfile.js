import React from "react";

export default function AdminProfile() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  return (
    <div className="card">
      <h2>Admin Profile</h2>

      <p><b>Username:</b> {user.username}</p>
      <p><b>Role:</b> {user.roles?.join(", ")}</p>

      <p style={{ marginTop: 12, color: "#666" }}>
        This is a system administrator account.
      </p>
    </div>
  );
}
