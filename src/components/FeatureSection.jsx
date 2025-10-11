import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  BsHouseDoorFill,
  BsPiggyBankFill,
  BsFileEarmarkTextFill,
  BsCashCoin,
  BsLightningFill,
} from "react-icons/bs";
import { CiBank } from "react-icons/ci";

const features = [
  {
    icon: <BsHouseDoorFill size={40} color="#ffc107" />,
    title: "Quick Approvals",
    description:
      "Get your loan application reviewed and approved in the shortest possible time.",
  },
  {
    icon: <CiBank size={40} color="#ffc107" />,
    title: "Bank Partnerships",
    description:
      "We help you get loans from any bank with complete transparency and ease.",
  },
  {
    icon: <BsFileEarmarkTextFill size={40} color="#ffc107" />,
    title: "Minimal Documentation",
    description:
      "Avail mortgage loans with minimal documentation and quick approvals.",
  },
  {
    icon: <BsCashCoin size={40} color="#ffc107" />,
    title: "Flexible Options",
    description:
      "No heavy paperwork—just simple and easy document requirements.",
  },
  {
    icon: <BsLightningFill size={40} color="#ffc107" />,
    title: "Dedicated Support",
    description:
      "Our experts are here to guide you at every step until your loan is disbursed.",
  },
    {
    icon: <BsPiggyBankFill size={40} color="#ffc107" />,
    title: "Secure & Confidential",
    description:
      "We ensure your personal and financial details are always kept safe.",
  },
  
];

const FeaturesSection = () => {
  return (
    <section className="container py-5" id="features">
      <h1 className="text-center fw-bold mb-2">Why Choose Us?</h1>
      <h5 className="text-center mb-5 fw-light fst-italic">
        Features That Set Us Apart
      </h5>
      <div className="row text-center">
        {features.map((feature, index) => (
          <div
            key={index}
            className="col-md-4 col-sm-6 mb-5 d-flex flex-column align-items-center"
          >
            {/* Icon inside circular border */}
            <div
              className="d-flex align-items-center justify-content-center rounded-circle mb-3"
              style={{
                width: "100px",
                height: "100px",
                border: "4px solid #ffc107",
                background: "#FFF7E6",
              }}
            >
              {feature.icon}
            </div>

            {/* Title */}
            <h5 className="fw-bold">{feature.title}</h5>

            {/* Description */}
            <p className="text-muted small px-3">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturesSection;
