import React, { useState } from "react";
import { useAdmins, useCreateAdmin, useDeleteAdmin, useUpdateAdmin } from "../services/SuperAdminService";
import { FaTrash, FaUserPlus, FaArrowLeft, FaShieldAlt, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminManagementPage = () => {
    const [form, setForm] = useState({ name: "", email: "", phone: "", role: "sub-admin", username: "", password: "" });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState({ text: "", type: "" });
    const navigate = useNavigate();

    const { data: adminsData, isLoading } = useAdmins();
    const createMutation = useCreateAdmin();
    const updateMutation = useUpdateAdmin();
    const deleteMutation = useDeleteAdmin();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleEdit = (admin) => {
        setEditingId(admin._id);
        setForm({
            name: admin.name || "",
            email: admin.email || "",
            phone: admin.phone || "",
            role: admin.role || "sub-admin",
            username: admin.username || "",
            password: "" // Keep password blank unless changing
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setForm({ name: "", email: "", phone: "", role: "sub-admin", username: "", password: "" });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage({ text: editingId ? "Updating account..." : "Creating account...", type: "info" });
        try {
            if (editingId) {
                // Remove password if empty string (don't update password)
                const updateData = { ...form };
                if (!updateData.password) delete updateData.password;
                await updateMutation.mutateAsync({ id: editingId, data: updateData });
                setMessage({ text: "Administrator account updated successfully!", type: "success" });
                setEditingId(null);
            } else {
                await createMutation.mutateAsync(form);
                setMessage({ text: "Administrator account created successfully! Credentials sent to email.", type: "success" });
            }
            setForm({ name: "", email: "", phone: "", role: "sub-admin", username: "", password: "" });
        } catch (err) {
            setMessage({ text: err.response?.data?.message || "Operation failed", type: "danger" });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this admin? This action cannot be undone.")) {
            try {
                await deleteMutation.mutateAsync(id);
                setMessage({ text: "Admin deleted successfully", type: "success" });
            } catch (err) {
                setMessage({ text: err.response?.data?.message || "Failed to delete admin", type: "danger" });
            }
        }
    };

    return (
        <div className="container-fluid p-4" style={{ background: "#f8f9fa", minHeight: "100vh" }}>
            <div className="max-width-container mx-auto" style={{ maxWidth: "1400px" }}>
                <button className="btn btn-link mb-4 text-secondary p-0 text-decoration-none d-flex align-items-center gap-2" onClick={() => navigate(-1)}>
                    <FaArrowLeft /> Back to Dashboard
                </button>

                <div className="row g-4">
                    <div className="col-lg-4">
                        <div className="card shadow-lg border-0 rounded-4 overflow-hidden sticky-top" style={{ top: "2rem" }}>
                            <div className="card-header bg-dark text-white p-4 border-0">
                                <h4 className="mb-0 d-flex align-items-center">
                                    <FaUserPlus className="me-2 text-warning" />
                                    {editingId ? "Update Credentials" : "Account Provisioning"}
                                </h4>
                                <p className="small opacity-75 mb-0 mt-1">{editingId ? `Editing access for ${form.username}` : "Create new system access credentials"}</p>
                            </div>
                            <div className="card-body p-4">
                                {message.text && (
                                    <div className={`alert alert-${message.type} alert-dismissible fade show border-0 rounded-3 shadow-sm`} role="alert">
                                        {message.text}
                                        <button type="button" className="btn-close" onClick={() => setMessage({ text: "", type: "" })}></button>
                                    </div>
                                )}

                                <form onSubmit={handleSubmit}>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold small text-muted text-uppercase mb-3">System Role</label>
                                        <div className="d-flex gap-2">
                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="role"
                                                id="role-sub"
                                                value="sub-admin"
                                                checked={form.role === "sub-admin"}
                                                onChange={handleChange}
                                            />
                                            <label className="btn btn-outline-primary flex-fill py-2 rounded-3 fw-bold" htmlFor="role-sub">
                                                <FaUserTie className="me-2" /> Sub-Admin
                                            </label>

                                            <input
                                                type="radio"
                                                className="btn-check"
                                                name="role"
                                                id="role-super"
                                                value="super-admin"
                                                checked={form.role === "super-admin"}
                                                onChange={handleChange}
                                            />
                                            <label className="btn btn-outline-danger flex-fill py-2 rounded-3 fw-bold" htmlFor="role-super">
                                                <FaShieldAlt className="me-2" /> Super-Admin
                                            </label>
                                        </div>
                                    </div>

                                    {editingId && (
                                        <div className="mb-3">
                                            <label className="form-label fw-bold small text-muted text-uppercase">Username</label>
                                            <input
                                                name="username"
                                                type="text"
                                                className="form-control form-control-lg border-2 shadow-none bg-light"
                                                value={form.username}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Legal Full Name</label>
                                        <input
                                            name="name"
                                            type="text"
                                            className="form-control form-control-lg border-2 shadow-none bg-light"
                                            placeholder="e.g. John Doe"
                                            value={form.name}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Official Email</label>
                                        <input
                                            name="email"
                                            type="email"
                                            className="form-control form-control-lg border-2 shadow-none bg-light"
                                            placeholder="john@mvassociates.org"
                                            value={form.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="form-label fw-bold small text-muted text-uppercase">Primary Phone</label>
                                        <input
                                            name="phone"
                                            type="tel"
                                            className="form-control form-control-lg border-2 shadow-none bg-light"
                                            placeholder="9876543210"
                                            value={form.phone}
                                            onChange={handleChange}
                                            required
                                        />
                                        <div className="form-text mt-2 text-muted fw-light">
                                            Used as the initial secure entry key.
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <label className="form-label fw-bold small text-muted text-uppercase">{editingId ? "Change Password" : "Secure Password"}</label>
                                        <input
                                            name="password"
                                            type="password"
                                            className="form-control form-control-lg border-2 shadow-none bg-light"
                                            placeholder={editingId ? "Leave blank to keep current" : "Minimum 6 characters"}
                                            value={form.password}
                                            onChange={handleChange}
                                            required={!editingId}
                                        />
                                    </div>

                                    <div className="d-flex gap-2">
                                        {editingId && (
                                            <button
                                                type="button"
                                                className="btn btn-light btn-lg flex-fill py-3 fw-bold border"
                                                onClick={handleCancelEdit}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                        <button
                                            type="submit"
                                            className={`btn btn-${form.role === 'super-admin' ? 'danger' : 'primary'} btn-lg flex-fill py-3 fw-bold shadow-sm transition-all`}
                                            disabled={createMutation.isPending || updateMutation.isPending}
                                        >
                                            {createMutation.isPending || updateMutation.isPending ? (
                                                <><span className="spinner-border spinner-border-sm me-2"></span> {editingId ? "Updating..." : "Provisioning..."}</>
                                            ) : editingId ? "Save Changes" : `Create ${form.role === 'super-admin' ? 'Super-Admin' : 'Sub-Admin'}`}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-8">
                        <div className="card shadow-sm border-0 rounded-4">
                            <div className="card-body p-4">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h4 className="card-title mb-0">Platform Administrators</h4>
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-hover align-middle">
                                        <thead className="bg-light text-muted small text-uppercase">
                                            <tr>
                                                <th>Admin</th>
                                                <th>Role</th>
                                                <th>Email / Phone</th>
                                                <th className="text-center">Customers</th>
                                                <th className="text-end">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {isLoading ? (
                                                <tr><td colSpan="5" className="text-center py-5">
                                                    <div className="spinner-border text-primary" role="status"></div>
                                                </td></tr>
                                            ) : adminsData?.data?.length === 0 ? (
                                                <tr><td colSpan="5" className="text-center py-5 text-muted">No administrators found.</td></tr>
                                            ) : (
                                                adminsData?.data?.map((admin) => (
                                                    <tr key={admin._id}>
                                                        <td>
                                                            <div className="fw-bold text-dark">{admin.name}</div>
                                                            <code className="small text-muted">{admin.username}</code>
                                                        </td>
                                                        <td>
                                                            {admin.role === 'super-admin' ? (
                                                                <span className="badge bg-danger-subtle text-danger border border-danger-subtle px-3 py-2">
                                                                    <FaShieldAlt className="me-1" /> Super
                                                                </span>
                                                            ) : (
                                                                <span className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2">
                                                                    <FaUserTie className="me-1" /> Sub
                                                                </span>
                                                            )}
                                                        </td>
                                                        <td>
                                                            <div className="small font-monospace">{admin.email}</div>
                                                            <div className="small text-muted">{admin.phone}</div>
                                                        </td>
                                                        <td className="text-center">
                                                            <span className="badge rounded-pill bg-dark px-3 py-2">
                                                                {admin.customerCount || 0}
                                                            </span>
                                                        </td>
                                                        <td className="text-end">
                                                            <div className="d-flex justify-content-end gap-2">
                                                                <button
                                                                    className="btn btn-sm btn-outline-primary"
                                                                    onClick={() => handleEdit(admin)}
                                                                    title="Edit Details"
                                                                >
                                                                    Edit
                                                                </button>

                                                                {admin.role !== 'super-admin' && (
                                                                    <>
                                                                        <button
                                                                            className="btn btn-sm btn-outline-dark"
                                                                            onClick={() => navigate(`/admin/dashboard?subAdminId=${admin._id}`)}
                                                                            title="View assigned customers"
                                                                        >
                                                                            View Map
                                                                        </button>
                                                                        <button
                                                                            className="btn btn-sm btn-light border text-danger"
                                                                            onClick={() => handleDelete(admin._id)}
                                                                            disabled={deleteMutation.isPending}
                                                                            title="Remove Admin"
                                                                        >
                                                                            <FaTrash />
                                                                        </button>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminManagementPage;
