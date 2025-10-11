import React, { useState } from "react";
import { registerCustomer } from "../services/CustomerService";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useNavigate } from "react-router-dom";
import { IoMdClose } from "react-icons/io";

const CustomerRegisterPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    gender: "",
    dob: null,
    email: "",
    phone: "",
    address: "",
    bankname: "",
    loantype: "",
    loanamount: "",
  });

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [loading, setLoading] = useState(false); // ✅ Loading state added

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading
    setMessage("");

    try {
      const payload = {
        ...form,
        dob: form.dob ? form.dob.toISOString().substring(0, 10) : "",
      };

  await registerCustomer(payload);

      // Clear form only after success
      setForm({
        firstname: "",
        lastname: "",
        gender: "",
        dob: null,
        email: "",
        phone: "",
        address: "",
        bankname: "",
        loantype: "",
        loanamount: "",
      });

      setMessage("✅ Customer registered successfully!");
      setMessageType("success");
      setTimeout(() => {
        setMessage("");
        navigate("/");
      }, 1500);
    } catch (err) {
      // Extract best available error message(s)
      const resp = err?.response?.data;
      let details = "Server error";

      if (resp) {
        if (typeof resp === "string") {
          details = resp;
        } else if (resp.message) {
          details = resp.message;
        } else if (Array.isArray(resp.errors) && resp.errors.length > 0) {
          // common validation format: [{ msg, param, ... }]
          details = resp.errors
            .map((e) => e.msg || e.message || JSON.stringify(e))
            .join("; ");
        } else if (typeof resp === "object") {
          // try to stringify validation object
          const vals = Object.values(resp).flat?.() || Object.values(resp);
          details = vals
            .map((v) => (typeof v === "string" ? v : JSON.stringify(v)))
            .join("; ");
          if (!details) details = "Server error";
        }
      } else {
        details = err?.message || "Server error";
      }

      setMessage(`❌ Registration failed: ${details}`);
      setMessageType("danger");
    } finally {
      setLoading(false); // ✅ Stop loading
    }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleClose = () => navigate("/");

  return (
    <section>
      <div
        className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-75 d-flex justify-content-center align-items-center p-2"
        style={{ zIndex: 1050 }}
      >
        <div
          className="bg-white rounded-3 shadow px-3 px-md-4 py-3 position-relative w-100"
          style={{ maxWidth: "600px", maxHeight: "90vh", overflowY: "auto" }}
        >
          <div className="text-end">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={handleClose}
            >
              <IoMdClose size={20} />
            </button>
          </div>

          <h3 className="text-center mb-3 text-dark">Registration</h3>

          {message && (
            <div
              className={`alert alert-${messageType} text-center`}
              role="alert"
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* Input Fields */}
              <div className="col-12 col-md-6">
                <label className="form-label">
                  First Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="firstname"
                  className="form-control"
                  value={form.firstname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">
                  Last Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="lastname"
                  className="form-control"
                  value={form.lastname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={form.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">
                  Phone <span className="text-danger">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  pattern="^\\+?[0-9\\s\\-]{7,15}$"
                  title="Enter a valid phone number"
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Date of Birth</label>
                <DatePicker
                  selected={form.dob}
                  onChange={(date) => setForm({ ...form, dob: date })}
                  className="form-control"
                  placeholderText="Select date"
                  maxDate={new Date()}
                  showMonthDropdown
                  showYearDropdown
                  dropdownMode="select"
                  dateFormat="yyyy-MM-dd"
                  isClearable
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Gender</label>
                <select
                  name="gender"
                  className="form-select"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="col-12">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="2"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">
                  Bank Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  name="bankname"
                  className="form-control"
                  value={form.bankname}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Loan Type</label>
                <select
                  name="loantype"
                  className="form-select"
                  value={form.loantype}
                  onChange={handleChange}
                >
                  <option value="">Select Type</option>
                  <option value="home">Home</option>
                  <option value="mortgage">Mortgage</option>
                </select>
              </div>

              <div className="col-12 col-md-6">
                <label className="form-label">Loan Amount</label>
                <input
                  type="number"
                  name="loanamount"
                  className="form-control"
                  value={form.loanamount}
                  onChange={handleChange}
                  min="0"
                />
              </div>

              {/* Buttons */}
              <div className="col-12 mt-4">
                <div className="d-flex flex-column flex-md-row justify-content-center gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleClose}
                    disabled={loading}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="btn btn-primary d-flex align-items-center justify-content-center"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Submitting...
                      </>
                    ) : (
                      "Register"
                    )}
                  </button>
                </div>
              </div>

              <div className="col-12 text-center mt-3">
                <span className="fw-light fs-6 text-muted">
                  You agree to our <strong>Terms</strong> and{" "}
                  <strong>Privacy Policy</strong>.
                </span>
              </div>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default CustomerRegisterPage;
