import React from "react";

const Contact = () => {
  return (
    <>
      {/* Contact Section */}
      <section id="contact" className="contact-section py-5">
        <h1 className="text-center mb-2 fw-bold">Overview</h1>
        <h5 className="text-center fst-italic fw-light mb-4">who we are, what we do, and your mission.</h5>
      <div className="container align-items-center ">
      <div className="row align-items-center">
        {/* Right Side - Text */}
        <div className="text-center my-4">
            <h2 className="fw-bold text-danger mb-4">
              We help customers get loans from banks.
            </h2>
            <ul className="list-unstyled d-inline-block text-start " style={{  listStyleType: "disc", textAlign: "left", paddingLeft: "20px",maxWidth: "900px" }}>
              <h5> <li className="mb-4"> <strong>Home Loan Support</strong> – Helping you get the best home loan offers from banks.</li></h5>
              <h5> <li className="mb-4"><strong>Mortgage Assistance</strong> – Guiding you through mortgage applications easily.</li></h5>
              <h5> <li className="mb-4"> <strong>Loan Guidance</strong> – Compare options and choose the most suitable loan.</li></h5>
              <h5> <li className="mb-4"> <strong>Expert Help 24/7</strong> – Personalized support throughout the loan process.</li></h5>
            </ul>
            <p className="fst-italic text-muted mb-4 mt-3">
              “FinTrust helped me secure a business loan quickly and easily — excellent service!”
            </p>
          </div>
        </div>
      </div>       
     </section>
    </>
  );
};

export default Contact;
