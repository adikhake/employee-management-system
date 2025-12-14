import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";

export default function SearchEmployee() {
  const navigate = useNavigate();

  const [employees, setEmployees] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();
 
  
  console.log("SearchEmployee - user from localStorage:", user);

  const isAdmin = (() => {
    if (!user) return false;

    if (user.role && (user.role === "ADMIN" || user.role === "ROLE_ADMIN")) return true;

    if (Array.isArray(user.roles)) {
      if (user.roles.includes("ADMIN") || user.roles.includes("ROLE_ADMIN")) return true;
    }

    if (Array.isArray(user.authorities)) {
      if (user.authorities.includes("ROLE_ADMIN") || user.authorities.includes("ADMIN")) return true;

      for (const a of user.authorities) {
        if (!a) continue;
        if (typeof a === "string" && (a === "ROLE_ADMIN" || a === "ADMIN")) return true;
        if (typeof a === "object" && (a.authority === "ROLE_ADMIN" || a.authority === "ADMIN")) return true;
      }
    }

    if (user?.grantedAuthorities && Array.isArray(user.grantedAuthorities)) {
      if (user.grantedAuthorities.includes("ROLE_ADMIN")) return true;
    }

    return false;
  })();

  const idOf = (e) => e?.id ?? e?.userId ?? e?.employeeId ?? e?.employee_id;

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      setError(null);

      try {
        if (isAdmin) {
          const res = await api.get("/employees");
          const data = res.data ?? [];
          setEmployees(Array.isArray(data) ? data : (data ? [data] : []));
        } else {
          try {
            const res = await api.get("/employees/me");
            const data = res.data ?? [];
            setEmployees(Array.isArray(data) ? data : (data ? [data] : []));
          } catch (meErr) {
            if (user?.id) {
              const r2 = await api.get(`/employees/${user.id}`);
              const d2 = r2.data ?? [];
              setEmployees(Array.isArray(d2) ? d2 : (d2 ? [d2] : []));
            } else {
              setEmployees([]);
              setError("No user info found.");
            }
          }
        }
      } catch (err) {
        console.error("fetchAll error:", err);
        if (err?.response?.status === 401) {
          setError("Full authentication is required to access this resource");
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        } else {
          setError(err.response?.data?.message || err.message || "Failed to load employees");
        }
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []); 

  const onSearch = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Search is available for admin users only.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/employees", { params: { q } });
      setEmployees(res.data ?? []);
    } catch (err) {
      console.error("search error:", err);
      if (err?.response?.status === 401) {
        setError("Full authentication is required to access this resource");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      } else {
        setError(err.response?.data?.message || "Search failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id) => {
    if (!isAdmin) {
      alert("Only admin can delete employees.");
      return;
    }
    if (!window.confirm("Delete this employee?")) return;
    try {
      await api.delete(`/employees/${id}`);
      setEmployees((prev) => prev.filter((p) => idOf(p) !== id));
    } catch (err) {
      console.error("delete error:", err);
      alert("Delete failed");
    }
  };

  const onEdit = (employee) => {
    const eid = idOf(employee);
    if (isAdmin) {
      navigate(`/employee/edit/${eid}`);
    } else {
      navigate("/profile");
    }
  };

  return (
    <div className="card">
      <h2>Search Employee</h2>

      <form onSubmit={onSearch} className="search-form" style={{ marginBottom: 12 }}>
        <input
          placeholder="Name or email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="primary" type="submit" style={{ marginLeft: 8 }}>
          Search
        </button>
        <button
          type="button"
          onClick={() => { setQ(""); window.location.reload(); }}
          style={{ marginLeft: 8 }}
        >
          Clear
        </button>
        {!isAdmin && <small style={{ marginLeft: 12, color: "#666" }}>Search & delete reserved for admins</small>}
      </form>

      {loading && <div>Loading...</div>}
      {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}

      <table className="table">
        <thead>
          <tr>
            <th>First</th>
            <th>Last</th>
            <th>Mobile</th>
            <th>Email</th>
            <th>Gender</th>
            <th>BirthDate</th>
            <th>Country</th>
            <th>City</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {!loading && employees.length === 0 && <tr><td colSpan="9">No records</td></tr>}
          {employees.map((e, idx) => {
            const eid = idOf(e) ?? idx;
            return (
              <tr key={eid}>
                <td>{e.firstName}</td>
                <td>{e.lastName}</td>
                <td>{e.mobile}</td>
                <td>{e.email}</td>
                <td>{e.gender}</td>
                <td>{e.birthDate}</td>
                <td>{e.country}</td>
                <td>{e.city}</td>
                <td>
                  <button onClick={() => onEdit(e)}>Edit</button>
                  <button
                    onClick={() => deleteEmployee(eid)}
                    style={{ marginLeft: 6 }}
                    disabled={!isAdmin}
                    title={!isAdmin ? "Only admin can delete" : "Delete"}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
