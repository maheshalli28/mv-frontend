import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginCustomer } from "../services/CustomerService";
import { MdEmail, MdPhone, MdLogin } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await loginCustomer(form.email, form.password);
      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data.customer));
        localStorage.setItem("token", res.data.token);
        navigate(`/profile/${res.data.customer.id}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials. Use your phone number as a temporary password.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate("/");
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(10, 10, 10, 0.85)",
        backdropFilter: "blur(10px)",
        split: "fixed",
        zIndex: 1050,
        padding: "1.5rem",
      }}
    >
      <div
        className="bg-white rounded-4 shadow-lg p-0 position-relative animate__animated animate__zoomIn"
        style={{ maxWidth: 450, width: "100%", overflow: "hidden", border: "none" }}
      >
        {/* Banner Section */}
        <div className="bg-warning p-4 text-center position-relative">
          <button
            type="button"
            className="btn-close position-absolute top-0 end-0 m-3"
            onClick={handleClose}
            aria-label="Close"
          ></button>

          <div
            className="bg-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3 shadow-sm"
            style={{ width: 70, height: 70 }}
          >
            <FaUserCircle size={45} className="text-warning" />
          </div>
          <h3 className="fw-bold text-dark mb-1">Customer Login</h3>
          <p className="text-dark opacity-75 small mb-0">Track your financial journey</p>
        </div>

        {/* Form Body */}
        <div className="p-4 p-md-5">
          {error && (
            <div className="alert alert-danger border-0 rounded-3 small py-2 text-center mb-4" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold text-muted text-uppercase">Email Address</label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-0">
                  <MdEmail className="text-muted" />
                </span>
                <input
                  name="email"
                  type="email"
                  className="form-control bg-light border-0 fs-6 shadow-none"
                  placeholder="your@email.com"
                  value={form.email}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label small fw-bold text-muted text-uppercase">Access Password</label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-0">
                  <MdPhone className="text-muted" />
                </span>
                <input
                  name="password"
                  type="password"
                  className="form-control bg-light border-0 fs-6 shadow-none"
                  placeholder="Password or Phone"
                  value={form.password}
                  onChange={handleChange}
                  disabled={loading}
                  required
                />
              </div>
              <div className="text-end mt-2">
                <Link to="/forgot-password" size="sm" className="text-decoration-none small fw-bold text-warning">
                  Forgot Access Details?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-warning btn-lg w-100 py-3 fw-bold rounded-3 shadow-sm transition-all d-flex align-items-center justify-content-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <span className="spinner-border spinner-border-sm" role="status"></span>
              ) : (
                <>
                  <MdLogin size={20} />
                  Enter Account
                </>
              )}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-muted mb-0">
              New to MV Associates?{" "}
              <Link to="/register" className="text-warning fw-bold text-decoration-none">
                Create your profile
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
