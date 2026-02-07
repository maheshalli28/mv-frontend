import React, { useState } from "react";
import { useCreateAdmin } from "../services/SuperAdminService";
import { FaShieldAlt, FaUserShield, FaArrowLeft, FaEnvelope, FaPhone, FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CreateSuperAdminPage = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", role: "super-admin" });
    const [message, setMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();
    const createMutation = useCreateAdmin();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: "Initializing Super Admin...", type: "info" });
        try {
            await createMutation.mutateAsync(form);
            setMessage({ text: "Super Admin created successfully! Login credentials have been dispatched to the email.", type: "success" });
            setForm({ name: "", email: "", phone: "", role: "super-admin" });
        } catch (err) {
            setMessage({ text: err.response?.data?.message || "Failed to create Super Admin", type: "danger" });
        }
    };

    return (
        <div className="container-fluid p-4" style={{ background: "#fdfdfd", minHeight: "100vh" }}>
            <div className="mx-auto" style={{ maxWidth: "600px" }}>
                <button className="btn btn-link mb-3 text-secondary p-0 text-decoration-none d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Cancel
                </button>

                <div className="card shadow-lg border-0 rounded-4 overflow-hidden mt-4">
                    <div className="card-header bg-danger text-white p-5 text-center border-0">
                        <div className="icon-circle mb-3 mx-auto shadow-sm" style={{ width: "80px", height: "80px", background: "rgba(255,255,255,0.2)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px" }}>
                            <FaShieldAlt />
                        </div>
                        <h2 className="fw-bold mb-1">Grant Root Access</h2>
                        <p className="opacity-75 mb-0">Create a new Super-Administrator with full system control</p>
                    </div>

                    <div className="card-body p-5">
                        {message.text && (
                            <div className={`alert alert-${message.type} border-0 rounded-3 text-center mb-4 small`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label className="form-label fw-bold small text-muted text-uppercase">Full Legal Name</label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-light border-0"><FaUser className="text-secondary" /></span>
                                    <input name="name" type="text" className="form-control bg-light border-0 fs-6 shadow-none" placeholder="e.g. Praveen Kumar" value={form.name} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold small text-muted text-uppercase">Super Admin Email</label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-light border-0"><FaEnvelope className="text-secondary" /></span>
                                    <input name="email" type="email" className="form-control bg-light border-0 fs-6 shadow-none" placeholder="praveen@mvassociates.org" value={form.email} onChange={handleChange} required />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-bold small text-muted text-uppercase">Mobile Number</label>
                                <div className="input-group input-group-lg">
                                    <span className="input-group-text bg-light border-0"><FaPhone className="text-secondary" /></span>
                                    <input name="phone" type="tel" className="form-control bg-light border-0 fs-6 shadow-none" placeholder="10-digit number" value={form.phone} onChange={handleChange} required />
                                </div>
                                <div className="form-text mt-2 text-danger small opacity-75">
                                    <span className="fw-bold">Warning:</span> Mobile number will be the initial temporary password.
                                </div>
                            </div>

                            <div className="p-4 bg-danger-subtle rounded-3 mb-5 border border-danger-subtle">
                                <div className="d-flex align-items-center gap-3">
                                    <FaUserShield className="text-danger fs-3" />
                                    <div>
                                        <h6 className="mb-0 fw-bold text-danger">High Privilege Account</h6>
                                        <p className="mb-0 small text-danger opacity-75">Super-Admins can delete records, manage other admins, and access global financial stats.</p>
                                    </div>
                                </div>
                            </div>

                            <button type="submit" disabled={createMutation.isPending} className="btn btn-danger btn-lg w-100 py-3 fw-bold shadow-sm transition-all rounded-3">
                                {createMutation.isPending ? (<><span className="spinner-border spinner-border-sm me-2"></span> Granting Access...</>) : "Initialize Super-Admin Account"}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateSuperAdminPage;
