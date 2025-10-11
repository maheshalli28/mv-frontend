import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { HiMenu, HiX } from "react-icons/hi";
import { Link } from "react-router-dom";
import { isAdmin, logout, getCurrentUser } from "../utils/auth";
import "./Navbar.css";

const sections = ["home", "services", "features", "customers", "contact"];

const PortfolioNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const user = getCurrentUser();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      let current = "home";
      sections.forEach((id) => {
        const section = document.getElementById(id);
        if (section) {
          const sectionTop = section.offsetTop - 80;
          if (window.scrollY >= sectionTop) {
            current = id;
          }
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = () => setExpanded(false);

  return (
    <Navbar
      expand="lg"
      sticky="top"
      expanded={expanded}
      onToggle={(isExpanded) => setExpanded(isExpanded)}
      className={`modern-navbar ${scrolled ? "scrolled" : ""}`}
    >
      <Container>
        <Navbar.Brand
          href="#home"
          className="fw-bold d-flex align-items-center brand-name text-white"
        >
          <span>MV ASSOCIATES</span>
        </Navbar.Brand>

        <Navbar.Toggle
          aria-controls="main-navbar"
          className="border-0 text-white"
        >
          {expanded ? (
            <HiX size={28} className="toggle-icon" />
          ) : (
            <HiMenu size={28} className="toggle-icon text-white" />
          )}
        </Navbar.Toggle>

        <Navbar.Collapse id="main-navbar">
          <Nav className="ms-auto nav-links">
            {sections.map((id) => (
              <Nav.Link
                key={id}
                href={`#${id}`}
                onClick={handleNavClick}
                className={activeSection === id ? "active" : ""}
              >
                {id.charAt(0).toUpperCase() + id.slice(1)}
              </Nav.Link>
            ))}

            {/* 🚀 Sign In button */}
            {!user && (
              <Nav.Link
                as={Link}
                to="/login"
                className="btn btn-warning ms-3 px-3 py-1 border "
                onClick={handleNavClick}
              >
                Sign In
              </Nav.Link>
            )}
            {!user && (
              <Nav.Link
                as={Link}
                to="/admin/login"
                className="btn btn-primary ms-2 px-3 py-1 border "
                onClick={handleNavClick}
              >
                Admin
              </Nav.Link>
            )}
            {user && isAdmin() && (
              <Nav.Link
                as={Link}
                to="/admin"
                className="btn btn-success ms-2 px-3 py-1 border "
                onClick={handleNavClick}
              >
               Dashboard
              </Nav.Link>
            )}
            {user && (
              <Nav.Link
                as={Link}
                to="/"
                className="btn btn-danger ms-2 px-3 py-1 border "
                onClick={() => {
                  logout();
                  handleNavClick();
                  window.location.href = "/";
                }}
              >
                Logout
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default PortfolioNavbar;
