import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useSuperAdminForgotPassword } from "../services/SuperAdminService";
import { useSubAdminForgotPassword } from "../services/SubAdminService";
import { MdAdminPanelSettings } from "react-icons/md";

const AdminForgotPasswordPage = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState({ text: "", type: "" });
  const location = useLocation();
  const initialRole = location.state?.initialRole || "super-admin";
  const superAdminForgotPassword = useSuperAdminForgotPassword();
  const subAdminForgotPassword = useSubAdminForgotPassword();
  const navigate = useNavigate();

  const handleRecoverCredentials = async (e) => {
    e.preventDefault();
    setMessage({ text: "", type: "" });
    const recoveryMutation = initialRole === "super-admin" ? superAdminForgotPassword : subAdminForgotPassword;

    try {
      const res = await recoveryMutation.mutateAsync({ email });
      setMessage({ text: res.data.message || "Credentials sent to your administrator email", type: "success" });
      setStep(3); // Go straight to success screen
    } catch (err) {
      setMessage({ text: err.response?.data?.message || "Verification failed. Please check your email.", type: "danger" });
    }
  };

  return (
    <div
      className="admin-forgot-password-wrapper"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #e0eafc 0%, #cfdef3 100%)",
        padding: "20px"
      }}
    >
      <div
        className="forgot-card shadow-lg"
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
          <Link to="/admin/login" className="position-absolute top-0 start-0 m-4 text-white opacity-75 hover-opacity-100">
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
            <MdAdminPanelSettings />
          </div>
          <h2 className="fw-bold mb-1">Admin Recovery</h2>
          <p className="opacity-75 mb-0">Restore secure portal access</p>
        </div>

        <div className="p-5">
          {message.text && (
            <div className={`alert alert-${message.type} border-0 shadow-sm mb-4 text-center rounded-3 small`}>
              {message.text}
            </div>
          )}

          {step === 1 && (
            <form onSubmit={handleRecoverCredentials}>
              <p className="text-muted small mb-4 text-center">
                Enter your official administrator email. We will verify your account and send your login credentials directly to your inbox.
              </p>
              <div className="mb-4">
                <label className="form-label fw-bold small text-muted text-uppercase">Admin Email</label>
                <div className="input-group input-group-lg">
                  <span className="input-group-text bg-light border-0 rounded-start-3 text-muted">
                    <FaEnvelope />
                  </span>
                  <input
                    type="email"
                    className="form-control bg-light border-0 rounded-end-3 fs-6 shadow-none"
                    placeholder="admin@mvassociates.org"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={superAdminForgotPassword.isPending || subAdminForgotPassword.isPending}
                className="btn btn-primary btn-lg w-100 rounded-3 py-3 fw-bold shadow-sm"
              >
                {superAdminForgotPassword.isPending || subAdminForgotPassword.isPending ? <span className="spinner-border spinner-border-sm me-2"></span> : "Recover Credentials"}
              </button>
            </form>
          )}

          {step === 3 && (
            <div className="text-center py-4">
              <FaCheckCircle size={60} className="text-success mb-3" />
              <h4 className="fw-bold text-dark">Credentials Sent!</h4>
              <p className="text-muted mb-4">Your login credentials have been recovered and sent to your registered email address along with a new temporary password.</p>
              <button
                className="btn btn-primary btn-lg w-100 rounded-3 py-3 fw-bold shadow-sm"
                onClick={() => navigate("/admin/login")}
              >
                Back to Portal Login
              </button>
            </div>
          )}

          <div className="text-center mt-5">
            <Link to="/" className="text-decoration-none small text-muted hover-opacity-100">
              Return to <strong>Dashboard Overview</strong>
            </Link>
          </div>
        </div>
      </div>
      <style>{`.hover-opacity-100:hover { opacity: 1 !important; transform: scale(1.05); transition: all 0.3s; }`}</style>
    </div>
  );
};

export default AdminForgotPasswordPage;
