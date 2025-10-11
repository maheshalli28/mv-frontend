import React, { useState } from "react";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const AdminRegisterPage = () => {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/register`, form);
      setMessage(res.data.message);
      setForm({ username: "", email: "", password: "" });
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
    }
    setLoading(false);
  };

  return (
    <div className="admin-register" style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)"
    }}>
      <div style={{
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "2.5rem 2rem",
        maxWidth: 400,
        width: "100%"
      }}>
        <h2 className="text-center mb-4" style={{ color: "#1976d2" }}>Admin Registration</h2>
        <form onSubmit={handleSubmit} className="mb-3">
          <input name="username" placeholder="Username" value={form.username} onChange={handleChange} required style={{ marginBottom: 16, width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #ccc" }} />
          <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required style={{ marginBottom: 16, width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #ccc" }} />
          <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required style={{ marginBottom: 16, width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #ccc" }} />
          <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.75rem", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", fontWeight: 600 }}>
            {loading ? "Registering..." : "Register"}
          </button>
          <button type="button" className="btn btn-outline-secondary w-100 mt-2" style={{ borderRadius: 8 }} onClick={() => window.location.href = "/"}>Cancel</button>
        </form>
        {message && <div className="alert alert-info mt-3 text-center">{message}</div>}
      </div>
    </div>
  );
};

export default AdminRegisterPage;
