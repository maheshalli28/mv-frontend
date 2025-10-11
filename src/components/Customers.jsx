import React, { useState, useEffect } from "react";
import "./Customers.css";
import { BsPersonCircle } from "react-icons/bs";
import { RiDoubleQuotesL,RiDoubleQuotesR } from "react-icons/ri";

const Customers = [
  {
    id: 1,
    name: "Ravi Kumar",
    loan: "Home Loan",
    comment: "MV Associates made the loan process smooth and stress-free. Highly recommend their services!"
  },
  {
    id: 2,
    name: "Ananya Sharma",
    loan: "Gold Loan",
    comment: "Quick approval and excellent customer support. I got my gold loan processed within a day."
  },
  {
    id: 3,
    name: "Vikram Singh",
    loan: "Mortgage Loan",
    comment: "The interest rates were fair and the team guided me throughout the documentation."
  },
  {
    id: 4,
    name: "Priya Reddy",
    loan: "Education Loan",
    comment: "I was able to pursue my higher studies thanks to the flexible repayment plans."
  },
];

const Clints = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // Update isMobile on resize
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto slide every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + (isMobile ? 1 : 2)) % Customers.length);
    }, 10000);
    return () => clearInterval(interval);
  }, [isMobile]);

  // Determine visible customers
  const visibleCustomers = isMobile
    ? [Customers[currentIndex]]
    : [
        Customers[currentIndex],
        Customers[(currentIndex + 1) % Customers.length],
      ];

  return (
    <section id="customers" className="container py-5">
      <h1 className="text-center fw-bold mb-2">Our Customers</h1>
      <h5 className="text-center mb-5 fw-light fst-italic">
        Hear from Our Happy Clients
      </h5>

      <div className="customer-slider d-flex justify-content-center gap-4 text-white flex-wrap">
        {visibleCustomers.map((cust) => (
          <div className="cert-card rounded-3 py-0  shadow" key={cust.id}>
            <div className="d-flex align-items-center">
              <div className="icon-box me-3">
                < BsPersonCircle size={45} className="text-secondary" />
              </div>
              <div>
                <h5 className="fw-bold mb-1">{cust.name}</h5>
                <h6 className="text-muted">{cust.loan}</h6>
              </div>
            </div>

            <p className="text-secondary fs-italic mb-3"><RiDoubleQuotesL className="mb-4"/>{cust.comment}<RiDoubleQuotesR className="mb-4"/></p>
          </div>
        ))}
      </div>

      {/* Status Dots */}
      <div className="customer-dots text-center mt-4">
        {Customers.map((_, index) => {
          const isActive = visibleCustomers.some(cust => cust.id === Customers[index].id);
          return (
            <span
              key={index}
              className={`dot ${isActive ? "active" : ""}`}
              onClick={() => setCurrentIndex(index)}
            ></span>
          );
        })}
      </div>
    </section>
  );
};

export default Clints;
