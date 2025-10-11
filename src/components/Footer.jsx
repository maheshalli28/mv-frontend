import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaTwitter, FaFacebookF, FaYoutube, FaLinkedinIn } from 'react-icons/fa';
import './Footer.css'; // Optional for custom styling

const Footer = () => {
  return (
    <footer className="footer text-white mt-5 py-5 m-0" id='contact'>
      <div className="container">
        <div className="row g-5">
          {/* Company */}
          <div className="col-md-4">
            <h5 className="footer-title text-warning">MV Asscociates</h5>
            <ul className="list-unstyled">
              <li><a href="#home">› About Us</a></li>
              <li><a href="#home">› Contact Us</a></li>
              <li><a href="#home">› Privacy Policy</a></li>
              <li><a href="#home">› Terms & Condition</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="col-md-4">
            <h5 className="footer-title text-warning">Contact</h5>
            <p><FaMapMarkerAlt className="me-2" />Hyderabad, Telangana, India</p>
            <p><FaPhoneAlt className="me-2" />+91 8247675651 </p>
            <p><FaEnvelope className="me-2" />mvassociates.org@gmail.com</p>
            <div className="d-flex gap-3 mt-3">
              <a href="/home" className="social-icon"><FaTwitter /></a>
              <a href="/home" className="social-icon"><FaFacebookF /></a>
              <a href="/home" className="social-icon"><FaYoutube /></a>
              <a href="/home" className="social-icon"><FaLinkedinIn /></a>
            </div>
          </div>

          {/* Opening */}
          <div className="col-md-4">
            <h5 className="footer-title text-warning">Opening</h5>
            <p className="mb-1">Our service - 24/7</p>
            <p className="mb-1">Available 24/7 to assist you.</p>
           
          </div>
        </div>

        <hr className="border-top border-light mt-5" />
        <div className="row text-center text-md-start">
          <div className="col-md-6">
            <p className="mb-1">© MV Associates, All Right Reserved. Designed By <a target="blank" href="https://www.linkedin.com/in/alli-mahesh/" className="text-decoration-underline text-white">Alli Mahesh</a></p>

          </div>
          <div className="col-md-6 d-flex justify-content-center justify-content-md-end gap-4 mt-3 mt-md-0">
            <a href="/home" className="text-white text-decoration-none">Home</a>
            <a href="/home" className="text-white text-decoration-none">Cookies</a>
            <a href="/home" className="text-white text-decoration-none">Help</a>
            <a href="/home" className="text-white text-decoration-none">FAQs</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
