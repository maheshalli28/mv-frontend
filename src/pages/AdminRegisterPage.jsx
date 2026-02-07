import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaEnvelope, FaIdBadge, FaArrowLeft, FaShieldAlt } from "react-icons/fa";

const BASE_URL = "https://mv-backend-apz8.onrender.com" || "http://localhost:5001";

const AdminRegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", username: "", email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ text: "", type: "" });
    try {
      const res = await axios.post(`${BASE_URL}/api/super-admin/register`, form);
      setMessage({ text: res.data.message || "Admin registered successfully!", type: "success" });
      setForm({ name: "", username: "", email: "", password: "" });
      setTimeout(() => navigate("/admin/login"), 2000);
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Registration failed", type: "danger" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="admin-register-wrapper"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        padding: "20px"
      }}
    >
      <div
        className="register-card shadow-lg"
        style={{
          background: "#fff",
          borderRadius: "24px",
          overflow: "hidden",
          maxWidth: "500px",
          width: "100%",
          border: "none"
        }}
      >
        {/* Header */}
        <div className="p-4 text-center bg-dark text-white position-relative">
          <Link to="/" className="position-absolute top-0 start-0 m-3 text-white opacity-75 hover-opacity-100">
            <FaArrowLeft />
          </Link>
          <div
            className="icon-circle mb-2 mx-auto"
            style={{
              width: "60px",
              height: "60px",
              background: "rgba(255,255,255,0.1)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "24px"
            }}
          >
            <FaShieldAlt className="text-warning" />
          </div>
          <h3 className="fw-bold mb-0">System Setup</h3>
          <p className="small opacity-75 mb-0">Initialize Super Admin Account</p>
        </div>

        <div className="p-4 p-md-5">
          {message.text && (
            <div className={`alert alert-${message.type} border-0 rounded-3 text-center mb-4`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase">Full Name</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FaUser className="text-muted" />
                </span>
                <input
                  name="name"
                  className="form-control bg-light border-0"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase">Username</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FaIdBadge className="text-muted" />
                </span>
                <input
                  name="username"
                  className="form-control bg-light border-0"
                  placeholder="admin_root"
                  value={form.username}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FaEnvelope className="text-muted" />
                </span>
                <input
                  name="email"
                  type="email"
                  className="form-control bg-light border-0"
                  placeholder="admin@mvassociates.org"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted text-uppercase">Secure Password</label>
              <div className="input-group">
                <span className="input-group-text bg-light border-0">
                  <FaLock className="text-muted" />
                </span>
                <input
                  name="password"
                  type="password"
                  className="form-control bg-light border-0"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-dark btn-lg w-100 rounded-3 py-3 fw-bold shadow-sm"
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : "Create Administrator Account"}
            </button>
          </form>

          <div className="text-center mt-4">
            <Link to="/admin/login" className="text-decoration-none small text-muted hover-primary">
              Already have an account? <strong>Sign In</strong>
            </Link>
          </div>
        </div>
      </div>
      <style>{`.hover-opacity-100:hover { opacity: 1 !important; transform: scale(1.1); transition: all 0.3s; }`}</style>
    </div>
  );
};

export default AdminRegisterPage;
