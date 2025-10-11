import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCustomerProfileById } from "../services/CustomerService";
import {
  FaPhoneAlt,
  FaEnvelope,
  FaUserCircle,
  FaCalendarAlt,
  FaHome,
  FaUniversity,
  FaFileInvoiceDollar,
  FaIdBadge
} from "react-icons/fa";
import { CiLogout } from "react-icons/ci";
import { GiCash } from "react-icons/gi";

const CustomerPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCustomer() {
      try {
        const res = await getCustomerProfileById(id);
        setCustomer(res.data);
      } catch (err) {
        setError("Customer not found.");
      } finally {
        setLoading(false);
      }
    }
    fetchCustomer();
  }, [id]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-success";
      case "rejected":
        return "text-danger";
      default:
        return "text-secondary";
    }
  };

  if (loading) return <div className="text-center mt-5">Loading customer data...</div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;
  if (!customer) return null;

  return (
    <div className="container py-4" style={{ minHeight: "auto" }}>
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
              padding: "2rem 1.8rem",
              
            }}
          >
            {/* Header */}
            <div className="d-flex align-items-center mb-4">
              <FaUserCircle size={48} style={{ color: "#1976d2" }} />
              <h3 className="ms-3 mb-0" style={{ fontWeight: 600 }}>
                {customer.firstname} {customer.lastname}
              </h3>
            </div>

            {/* Customer Details */}
            <div className="mb-3">
              <FaCalendarAlt className="me-2" /> <span className="fw-bold">Registered On:</span>{" "}
              {customer.createdAt ? new Date(customer.createdAt).toLocaleString() : "-"}
            </div>

            <div className="mb-3">
              <FaIdBadge className="me-2" /> <span className="fw-bold">Gender:</span> {customer.gender}
            </div>
            <div className="mb-3">
              <FaCalendarAlt className="me-2" /> <span className="fw-bold">Date of Birth:</span>{" "}
              {customer.dob ? new Date(customer.dob).toLocaleDateString() : "-"}
            </div>
            <div className="mb-3">
              <FaEnvelope className="me-2" /> <span className="fw-bold">Email:</span> {customer.email}
            </div>
            <div className="mb-3">
              <FaPhoneAlt className="me-2" /> <span className="fw-bold">Phone:</span> {customer.phone}
            </div>
            <div className="mb-3">
              <FaHome className="me-2" /> <span className="fw-bold">Address:</span> {customer.address}
            </div>
            <div className="mb-3">
              <FaUniversity className="me-2" /> <span className="fw-bold">Bank Name:</span> {customer.bankname}
            </div>
            <div className="mb-3">
              <FaFileInvoiceDollar className="me-2" /> <span className="fw-bold">Loan Type:</span> {customer.loantype}
            </div>
            <div className="mb-3">
              <GiCash className="me-2" /> <span className="fw-bold">Loan Amount:</span> ₹{customer.loanamount?.toLocaleString()}
            </div>
            <div className="mb-3">
              <span className="fw-bold">Status:</span>{" "}
              <span className={getStatusColor(customer.status)} style={{ fontWeight: 600 }}>
                {customer.status}
              </span>
            </div>
            
            {/* Action Buttons */}
            <div className="mt-4 d-flex justify-content-center">  
              <button
                className="btn btn-danger px-4 d-flex align-items-center"
                style={{ borderRadius: 8 }}
                onClick={() => {
                  localStorage.removeItem("user");
                  navigate("/");
                }}
              >
                Logout <CiLogout className="ms-2" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPage;
