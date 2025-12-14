import React from "react";
import AdminProfile from './../pages/AdminProfile';
import Profile from './../pages/Profile';

export default function ProfileRouter() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  if (user.roles?.includes("ROLE_ADMIN")) {
    return <AdminProfile />;
  }
  return <Profile />;
}
