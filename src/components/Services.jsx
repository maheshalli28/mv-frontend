import React from "react";
import { Row, Col, Card, Button } from "react-bootstrap";
import { FaHome, FaCoins } from "react-icons/fa";
import "./Services.css";

const servicesData = [
  {
    title: "Home Loan",
    bank: "MV Associates Partner Banks",
    interest: "Rates vary based on the policies of each bank.",
    description:
      "Affordable home loans with flexible EMI options. Ideal for first-time buyers or upgrading your dream house with trusted banking partners.",
    image: "/assets/image1.png",
    icon: <FaHome size={28} className="text-primary me-2" />,
  },
  {
    title: "Mortgage Loan",
    bank: "MV Associates Finance Solutions",
    interest: "Rates vary based on the policies of each bank.",
    description:
      "Unlock the value of your gold instantly. Get hassle-free, secured loans with minimal documentation and same-day approval.",
    image: "/assets/image2.png",
    icon: <FaCoins size={28} className="text-warning me-2" />,
  },
  // {
  //   title: "Personal Loan",
  //   bank: "MV Associates Banking Partners",
  //   interest: "Starting from 10.5% p.a.",
  //   description:
  //     "Leverage your property for quick funds. Enjoy higher loan amounts with flexible repayment terms tailored to your needs.",
  //   image: "/assets/image3.png",
  //   icon: <FaLandmark size={28} className="text-success me-2" />,
  // },
];

const Services = () => {
  return (
    <section id="services" className="container py-5">
      <h1 className="text-center mb-2 fw-bold">Our Services</h1>
      <h5 className="text-center fst-italic fw-light mb-5">
        Loans Tailored for Your Needs
      </h5>

      <Row className="g-5">
        {servicesData.map((service, index) => (
          <Col md={6} lg={4} key={index}>
            <Card className="shadow h-100 border-1 rounded-1 service-card">
              <Card.Img
                variant="top"
                src={service.image}
                alt={service.title}
                style={{ height: "100px", objectFit: "cover",objectPosition: "center", }}
              />
              <Card.Body className="d-flex flex-column justify-content-between">
                <div>
                  <div className="d-flex align-items-center mb-2">
                    {service.icon}
                    <h5 className="fw-bold mb-0">{service.title}</h5>
                  </div>
                  <p className="text-primary fw-semibold">{service.bank}</p>
                  <small className="text-muted d-block mb-3">
                    Interest: {service.interest}
                  </small>
                  <Button
                  variant="outline-primary"
                  className="rounded-pill px-4 fw-semibold mx-auto "
                  href="/register"
                >
                  Apply
                </Button>
                  
                </div>

                {/* Apply Button */}
                
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </section>
  );
};

export default Services;
