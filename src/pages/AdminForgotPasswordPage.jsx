import React, { useState } from "react";

import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5001";

const AdminForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Step 1: Request OTP

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/forgot-password`, { email });
      setMessage(res.data.message || "OTP sent to your email");
      setStep(2);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to send OTP");
    }
    setLoading(false);
  };

  // Step 2: Verify OTP and reset password

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await axios.post(`${BASE_URL}/api/admin/reset-password`, { email, otp, newPassword });
      setMessage(res.data.message || "Password reset successful");
      setStep(3);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to reset password");
    }
    setLoading(false);
  };

  return (
    <div className="admin-forgot-password" style={{
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
        <h2 className="text-center mb-4" style={{ color: "#1976d2" }}>Admin Forgot Password</h2>
        {step === 1 && (
          <form onSubmit={handleRequestOtp} className="mb-3">
            <input
              type="email"
              placeholder="Enter your admin email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ marginBottom: 16, width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #ccc" }}
            />
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.75rem", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", fontWeight: 600 }}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>
        )}
        {step === 2 && (
          <form onSubmit={handleResetPassword} className="mb-3">
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              style={{ marginBottom: 16, width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #ccc" }}
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              style={{ marginBottom: 16, width: "100%", padding: "0.75rem", borderRadius: 8, border: "1px solid #ccc" }}
            />
            <button type="submit" disabled={loading} style={{ width: "100%", padding: "0.75rem", borderRadius: 8, background: "#1976d2", color: "#fff", border: "none", fontWeight: 600 }}>
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>
        )}
        {step === 3 && (
          <div className="text-center">
            <p>{message}</p>
            <a href="/admin/login" style={{ color: "#1976d2", fontWeight: 500 }}>Go to Admin Login</a>
          </div>
        )}
        {message && step !== 3 && <div className="alert alert-info mt-3 text-center">{message}</div>}
        <button type="button" className="btn btn-outline-secondary w-100 mb-2" style={{ borderRadius: 8 }} onClick={() => window.location.href = "/"}>Cancel</button>
      </div>
    </div>
  );
};

export default AdminForgotPasswordPage;
