import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const AdminLoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // 👁️ State for visibility toggle

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/login`, form);
      localStorage.setItem(
        "user",
        JSON.stringify({ ...res.data.admin, token: res.data.token, role: "admin" })
      );
      setMessage("Login successful");
      window.location.href = "/admin/dashboard";
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
    setLoading(false);
  };

  return (
    <>
      <div
        className="admin-login"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        }}
      >
        <div
          style={{
            background: "#fff",
            borderRadius: "16px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
            padding: "2.5rem 2rem",
            maxWidth: 400,
            width: "100%",
          }}
        >
          <h2 className="text-center mb-4" style={{ color: "#1976d2" }}>
            Admin Login
          </h2>

          <form onSubmit={handleSubmit} className="mb-3">
            {/* Email Field */}
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
              style={{
                marginBottom: 16,
                width: "100%",
                padding: "0.75rem",
                borderRadius: 8,
                border: "1px solid #ccc",
              }}
            />

            {/* Password Field with toggle */}
            <div style={{ position: "relative" }}>
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
                style={{
                  marginBottom: 16,
                  width: "100%",
                  padding: "0.75rem 2.5rem 0.75rem 0.75rem",
                  borderRadius: 8,
                  border: "1px solid #ccc",
                }}
              />

              {/* 👁️ Eye Icon */}
              <span
                onClick={togglePasswordVisibility}
                style={{
                  position: "absolute",
                  right: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  cursor: "pointer",
                  color: "#666",
                }}
              >
                
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: 8,
                background: "#1976d2",
                color: "#fff",
                border: "none",
                fontWeight: 600,
              }}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <div className="d-flex justify-content-center align-items-center mb-2 text-center">
            <Link
              to="/admin/forgot-password"
              style={{ color: "#1976d2", fontWeight: 500 }}
              className="text-center"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="button"
            className="btn btn-outline-secondary w-100 mt-2"
            style={{ borderRadius: 8 }}
            onClick={() => (window.location.href = "/")}
          >
            Cancel
          </button>

          {message && (
            <div className="alert alert-info mt-3 text-center">{message}</div>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminLoginPage;
