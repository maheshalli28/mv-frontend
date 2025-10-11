import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCustomerProfile } from "../services/CustomerService";
import { IoMdClose } from "react-icons/io";
import { MdEmail, MdPhone } from "react-icons/md";

const LoginPage = () => {
  const [form, setForm] = useState({ email: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await getCustomerProfile(form.email, form.phone);
      if (res.data) {
        localStorage.setItem("user", JSON.stringify({ role: "customer", id: res.data._id }));
        navigate(`/profile/${res.data._id}`);
      }
    } catch (err) {
      setError("Invalid customer credentials");
    }
    finally {
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
        backgroundColor: "rgba(0,0,0,0.7)",
        zIndex: 1050,
        padding: "1rem",
      }}
    >
      <div className="bg-white rounded-4 shadow p-4 position-relative" style={{ maxWidth: 420, width: "100%" }}>
        {/* Close button */}
        <button
          type="button"
          className="btn btn-link position-absolute top-0 end-0 mt-2 me-4"
          onClick={handleClose}
          aria-label="Close login form"
          title="Close"
          style={{ fontSize: "1.5rem", color: "#151616ff" }}
        >
          <IoMdClose />
        </button>

        <h3 className="text-center mt-4 mb-4">Customer Login</h3>

        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          {/* Email input with icon */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white">
              <MdEmail />
            </span>
            <input
              name="email"
              type="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
                onChange={handleChange}
                disabled={loading}
              required
            />
          </div>

          {/* Phone input with icon */}
          <div className="input-group mb-3">
            <span className="input-group-text bg-white">
              <MdPhone />
            </span>
            <input
              name="phone"
              type="tel"
              className="form-control"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              disabled={loading}
              required
            />
          </div>

          <div className="text-center">
            <button type="submit" className="btn btn-outline-dark w-auto" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Logging in...
                </>
              ) : (
                'Login'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
