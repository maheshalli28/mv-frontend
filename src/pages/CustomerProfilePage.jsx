// pages/CustomerProfilePage.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getCustomerProfileById,
  updateCustomer,
} from "../services/CustomerService";

const CustomerProfilePage = () => {
  const { id } = useParams();
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const res = await getCustomerProfileById(id);
        setCustomer(res.data);
        setForm(res.data);
      } catch (error) {
        console.error("Failed to load customer", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomer();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await updateCustomer(id, form);
      // show success confirmation modal
      setShowSuccess(true);
    } catch (err) {
      // show error confirmation modal
      setShowError(true);
    }
  };

  const handleLogout = () => {
  localStorage.removeItem("token"); // or sessionStorage.clear()
  navigate("/admin"); // Redirect to root page

  };

  // modal state for confirmations
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const confirmSuccess = () => {
    setShowSuccess(false);
    navigate(-1); // return to previous page
  };

  const closeError = () => {
    setShowError(false);
  };


  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (!customer) return <div className="text-center mt-5">Customer not found</div>;

  return (
  <div className="container mt-5">
  <div className="row justify-content-center">
    <div className="col-md-8">
      <div className="card p-4 ">
        <h3 className="text-center mb-4">Edit Customer Profile</h3>
         {/* ✅ Created Date at the top */}
            <p className="text-muted small  mb-2 text-center">
              Registered On:{" "}
              {customer.createdAt
                ? new Date(customer.createdAt).toLocaleString()
                : "-"}
            </p>
        <form>
          {/* First Name */}
          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label">First Name</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                name="firstname"
                value={form.firstname || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          {/* Success Modal */}
          {showSuccess && (
            <>
              <div className="modal-backdrop fade show"></div>
              <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Update Successful</h5>
                    </div>
                    <div className="modal-body">Customer updated successfully.</div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-primary" onClick={confirmSuccess}>
                        OK
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Error Modal */}
          {showError && (
            <>
              <div className="modal-backdrop fade show"></div>
              <div className="modal fade show d-block" tabIndex="-1" role="dialog" aria-modal="true">
                <div className="modal-dialog modal-dialog-centered" role="document">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Update Failed</h5>
                    </div>
                    <div className="modal-body">Failed to update customer. Please try again.</div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-secondary" onClick={closeError}>
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Last Name */}
          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label">Last Name</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                name="lastname"
                value={form.lastname || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label">Email</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                name="email"
                value={form.email || ""}
                disabled
              />
            </div>
          </div>

          {/* Phone */}
          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label">Phone</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                name="phone"
                value={form.phone || ""}
                disabled
              />
            </div>
          </div>

          {/* Bank Name */}
          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label">Bank Name</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                name="bankname"
                value={form.bankname || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Loan Type */}
          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label">Loan Type</label>
            <div className="col-sm-8">
              <select
                className="form-select"
                name="loantype"
                value={form.loantype || ""}
                onChange={handleChange}
              >
                <option value="">Select</option>
                <option value="home">Home</option>
                <option value="mortgage">Mortgage</option>
              </select>
            </div>
          </div>
          {/* Account Number */}
          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label">Account Number</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                type="number"
                name="accountnumber"
                value={form.accountnumber || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          
          {/* IFSC Code */}
          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label">IFSC Code</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                type="text"
                name="ifsccode"
                value={form.ifsccode || ""}
                onChange={handleChange}
              />
            </div>
          </div>


          {/* Loan Amount */}
          <div className="row mb-3 align-items-center">
            <label className="col-sm-4 col-form-label">Loan Amount</label>
            <div className="col-sm-8">
              <input
                className="form-control"
                type="number"
                name="loanamount"
                value={form.loanamount || ""}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Status */}
          <div className="row mb-4 align-items-center">
            <label className="col-sm-4 col-form-label">Status</label>
            <div className="col-sm-8">
              <select
                className="form-select"
                name="status"
                value={form.status || "pending"}
                onChange={handleChange}
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Buttons */}
          <div className="text-center">
            <button
              type="button"
              className="btn btn-outline-secondary me-3"
              onClick={handleLogout}
            >
              Back
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleUpdate}
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</div>

  );
};

export default CustomerProfilePage;
