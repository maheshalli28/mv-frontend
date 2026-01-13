import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaUserShield, FaUserTie, FaLock, FaEnvelope, FaEye, FaEyeSlash, FaArrowLeft } from "react-icons/fa";
import { useSuperAdminLogin } from "../services/SuperAdminService";
import { useSubAdminLogin } from "../services/SubAdminService";

const AdminLoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialRole = location.state?.initialRole || "admin";

  const [form, setForm] = useState({ email: "", password: "" });
  const [message, setMessage] = useState({ text: "", type: "" });
  const superAdminLogin = useSuperAdminLogin();
  const subAdminLogin = useSubAdminLogin();
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    const loginMutation = initialRole === "super-admin" ? superAdminLogin : subAdminLogin;

    try {
      const res = await loginMutation.mutateAsync(form);
      const userData = { ...res.data.admin, token: res.data.token };

      console.log("Admin session initiated:", userData.username, "| Role:", userData.role);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("token", res.data.token);

      setMessage({ text: "Login successful! Redirecting...", type: "success" });

      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 1000);
    } catch (err) {
      console.error("Login failed:", err);
      setMessage({
        text: err.response?.data?.message || "Invalid credentials. Please try again.",
        type: "danger"
      });
    }
  };

  return (
    <div
      className="admin-login-wrapper"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "20px"
      }}
    >
      <div
        className="login-card shadow-lg"
        style={{
          background: "#fff",
          borderRadius: "24px",
          overflow: "hidden",
          maxWidth: "450px",
          width: "100%",
          border: "none"
        }}
      >
        {/* Header Section */}
        <div className="p-5 text-center bg-primary text-white position-relative">
          <Link to="/" className="position-absolute top-0 start-0 m-4 text-white opacity-75 hover-opacity-100">
            <FaArrowLeft />
          </Link>
          <div
            className="icon-circle mb-3 mx-auto shadow-sm"
            style={{
              width: "80px",
              height: "80px",
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "32px"
            }}
          >
            {initialRole === "super-admin" ? <FaUserShield /> : <FaUserTie />}
          </div>
          <h2 className="fw-bold mb-1">
            {initialRole === "super-admin" ? "Super Admin" : "Sub-Admin"}
          </h2>
          <p className="opacity-75 mb-0">Secure Portal Login</p>
        </div>

        {/* Form Section */}
        <div className="p-5">
          {message.text && (
            <div className={`alert alert-${message.type} border-0 shadow-sm mb-4 text-center rounded-3`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold small text-muted text-uppercase">Email Address</label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                  <FaEnvelope />
                </span>
                <input
                  name="email"
                  type="email"
                  className="form-control bg-light border-start-0 rounded-end-3 fs-6 shadow-none"
                  placeholder="admin@example.com"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold small text-muted text-uppercase">Password</label>
              <div className="input-group input-group-lg">
                <span className="input-group-text bg-light border-end-0 rounded-start-3 text-muted">
                  <FaLock />
                </span>
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  className="form-control bg-light border-start-0 fs-6 shadow-none"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={handleChange}
                  required
                />
                <span
                  className="input-group-text bg-light border-start-0 rounded-end-3 text-muted cursor-pointer"
                  onClick={togglePasswordVisibility}
                  style={{ cursor: "pointer" }}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
              <div className="text-end mt-2">
                <Link to="/admin/forgot-password" state={{ initialRole }} size="sm" className="text-decoration-none small fw-bold">
                  Forgot Password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={superAdminLogin.isPending || subAdminLogin.isPending}
              className="btn btn-primary btn-lg w-100 rounded-3 py-3 fw-bold shadow-sm transition-all"
            >
              {superAdminLogin.isPending || subAdminLogin.isPending ? (
                <span className="spinner-border spinner-border-sm me-2"></span>
              ) : "Sign In to Dashboard"}
            </button>
          </form>

          <div className="text-center mt-5">
            {/* <Link to="/admin/register" className="text-decoration-none small fw-bold text-primary">
              Don't have an account? Sign Up
            </Link> */}
            <p className="text-muted small mb-0 mt-3">
              By signing in, you agree to our Terms of Service.
            </p>
          </div>
        </div>
      </div>
      <style>{`
                .cursor-pointer { cursor: pointer; }
                .hover-opacity-100:hover { opacity: 1 !important; transition: opacity 0.3s; }
                .login-card { transition: transform 0.3s; }
                .login-card:hover { transform: translateY(-5px); }
                .input-group-text { border: 1px solid #ced4da; }
                .form-control:focus + .input-group-text { border-color: #86b7fe; }
            `}</style>
    </div>
  );
};

export default AdminLoginPage;
