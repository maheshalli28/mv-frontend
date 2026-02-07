import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaCheckCircle } from "react-icons/fa";
import { useCustomerForgotPassword } from "../services/CustomerService";
import { MdOutlineSecurity } from "react-icons/md";


const ForgotPasswordPage = () => {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState({ text: "", type: "" });
    const customerForgotPassword = useCustomerForgotPassword();
    const navigate = useNavigate();

    const handleRecoverCredentials = async (e) => {
        e.preventDefault();
        setMessage({ text: "", type: "" });
        try {
            const res = await customerForgotPassword.mutateAsync({ email });
            setMessage({ text: res.data.message || "Credentials sent to your email", type: "success" });
            setStep(3); // Go straight to success
        } catch (err) {
            setMessage({ text: err.response?.data?.message || "Failed to recover credentials. Please check your email.", type: "danger" });
        }
    };

    return (
        <div
            className="forgot-password-wrapper"
            style={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #fff9db 0%, #fff3bf 100%)",
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
                <div className="p-5 text-center bg-warning text-dark position-relative">
                    <Link to="/login" className="position-absolute top-0 start-0 m-4 text-dark opacity-75 hover-opacity-100">
                        <FaArrowLeft />
                    </Link>
                    <div
                        className="icon-circle mb-3 mx-auto shadow-sm"
                        style={{
                            width: "80px",
                            height: "80px",
                            background: "rgba(0,0,0,0.05)",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "32px"
                        }}
                    >
                        <MdOutlineSecurity className="text-dark" />
                    </div>
                    <h2 className="fw-bold mb-1">Customer Access</h2>
                    <p className="opacity-75 mb-0">Recover your secure account</p>
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
                                Enter the email address associated with your MV Associates profile. We will verify your identity and send your login credentials to your inbox.
                            </p>
                            <div className="mb-4">
                                <label className="form-label fw-bold small text-muted text-uppercase">Email Address</label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-light border-0 rounded-start-3 text-muted">
                                        <FaEnvelope />
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control bg-light border-0 rounded-end-3 fs-6 shadow-none"
                                        placeholder="your@email.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={customerForgotPassword.isPending}
                                className="btn btn-warning btn-lg w-100 rounded-3 py-3 fw-bold shadow-sm"
                            >
                                {customerForgotPassword.isPending ? <span className="spinner-border spinner-border-sm me-2"></span> : "Recover My Credentials"}
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <div className="text-center py-4">
                            <FaCheckCircle size={60} className="text-success mb-3" />
                            <h4 className="fw-bold text-dark">Check Your Inbox!</h4>
                            <p className="text-muted mb-4">Your login credentials and a new temporary password have been sent to your email address.</p>
                            <button
                                className="btn btn-warning btn-lg w-100 rounded-3 py-3 fw-bold shadow-sm"
                                onClick={() => navigate("/login")}
                            >
                                Return to Login
                            </button>
                        </div>
                    )}

                    <div className="text-center mt-5">
                        <Link to="/" className="text-decoration-none small text-muted hover-opacity-100">
                            Back to <strong>Home Page</strong>
                        </Link>
                    </div>
                </div>
            </div>
            <style>{`.hover-opacity-100:hover { opacity: 1 !important; transform: scale(1.05); transition: all 0.3s; }`}</style>
        </div>
    );
};

export default ForgotPasswordPage;
