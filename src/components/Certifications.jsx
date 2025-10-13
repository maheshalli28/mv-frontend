import React from "react";
import "./Certifications.css";
import { FaUniversity, FaMoneyCheckAlt, FaUsers } from "react-icons/fa";
import { IoIosTime } from "react-icons/io";

const Certifications = () => {

  return (
    <section id="certifications" className="container py-5">
      {/* ✅ Banking Stats Row Below Hero */}
      <div className="container-fluid stats">
        <div className="row text-center justify-content-center g-4">
          <div className="col-6 col-md-3">
            <div
              className="d-flex flex-column justify-content-center align-items-center p-3 border border-2 rounded-circle text-white"
              style={{ width: "150px", height: "150px", margin: "auto" }}
            >
              <FaUniversity size={30} className="text-primary mb-2" />
              <h4 className="fw-bold mb-0">2+</h4>
              <small>Years</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div
              className="d-flex flex-column justify-content-center align-items-center p-3 border border-2 rounded-circle text-white"
              style={{ width: "150px", height: "150px", margin: "auto" }}
            >
              <IoIosTime size={30} className="text-success mb-2" />
              <h4 className="fw-bold mb-0">24/7</h4>
              <small>Service</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div
              className="d-flex flex-column justify-content-center align-items-center p-3 border border-2 rounded-circle text-white"
              style={{ width: "150px", height: "150px", margin: "auto" }}
            >
              <FaMoneyCheckAlt size={30} className="text-warning mb-2" />
              <h4 className="fw-bold mb-0">1000+</h4>
              <small>Loans</small>
            </div>
          </div>
          <div className="col-6 col-md-3">
            <div
              className="d-flex flex-column justify-content-center align-items-center p-3 border border-2 rounded-circle text-white"
              style={{ width: "150px", height: "150px", margin: "auto" }}
            >
              <FaUsers size={30} className="text-danger mb-2" />
              <h4 className="fw-bold mb-0">1000+</h4>
              <small>Clients</small>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Certifications;
