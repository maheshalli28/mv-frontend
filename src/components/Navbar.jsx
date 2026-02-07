import React, { useState, useEffect } from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";
import { logout, getCurrentUser } from "../utils/auth";
import RoleSelectionModal from "./RoleSelectionModal";

const sections = ["home", "services", "features", "customers", "contact"];

const PortfolioNavbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [showRoleModal, setShowRoleModal] = useState(false);

  const location = useLocation();
  const [user, setUser] = useState(getCurrentUser());
  const isHomePage = location.pathname === "/";

  // Refresh user state whenever location changes
  useEffect(() => {
    const currentUser = getCurrentUser();

    // 🛡️ User session synchronization
    if (currentUser && !currentUser.role) {
      console.warn("🛡️ Access session incomplete: Role information missing.");
    }

    setUser(currentUser);

    if (currentUser) {
      console.log("Navbar Auth Sync:", currentUser.email, "| Role:", currentUser.role);
    }
  }, [location.pathname]);

  useEffect(() => {
    if (!isHomePage) return;

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
  }, [isHomePage]);

  const handleNavClick = () => setExpanded(false);

  const handleLogout = () => {
    logout();
    handleNavClick();
    window.location.href = "/";
  };

  return (
    <>
      <Navbar
        expand="lg"
        sticky="top"
        expanded={expanded}
        onToggle={(isExpanded) => setExpanded(isExpanded)}
        className={`modern-navbar ${scrolled || !isHomePage ? "scrolled shadow-sm" : ""}`}
        variant="dark"
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold d-flex align-items-center brand-name text-white"
          >
            <span>MV ASSOCIATES</span>
          </Navbar.Brand>

          <Navbar.Toggle
            aria-controls="main-navbar"
            className="border-0 text-white shadow-none"
          >
            {expanded ? (
              <HiX size={28} />
            ) : (
              <HiMenu size={28} />
            )}
          </Navbar.Toggle>

          <Navbar.Collapse id="main-navbar">
            <Nav className="ms-auto nav-links align-items-center">
              {isHomePage && sections.map((id) => (
                <Nav.Link
                  key={id}
                  href={`#${id}`}
                  onClick={handleNavClick}
                  className={activeSection === id ? "active" : ""}
                >
                  {id.charAt(0).toUpperCase() + id.slice(1)}
                </Nav.Link>
              ))}

              {!isHomePage && (
                <Nav.Link as={Link} to="/" onClick={handleNavClick}>
                  Home
                </Nav.Link>
              )}

              {/* 🚀 Role-based buttons */}
              {!user ? (
                <Nav.Link
                  className="btn btn-warning ms-lg-3 px-4 py-1 border-0 fw-bold text-dark"
                  onClick={() => {
                    setShowRoleModal(true);
                    handleNavClick();
                  }}
                  style={{ borderRadius: '50px' }}
                >
                  Sign In
                </Nav.Link>
              ) : (
                <>
                  {/* Super Admin Links */}
                  {user.role?.toLowerCase() === "super-admin" && (
                    <>
                      <Nav.Link
                        as={Link}
                        to="/admin/dashboard"
                        className="btn btn-warning ms-lg-2 px-3 py-1 border-0 text-dark fw-bold"
                        style={{ borderRadius: '8px' }}
                        onClick={handleNavClick}
                      >
                        Dashboard
                      </Nav.Link>
                      <Nav.Link
                        as={Link}
                        to="/admin/sub-admins"
                        className="btn btn-outline-info ms-lg-2 px-3 py-1 border-2 text-white"
                        style={{ borderRadius: '8px' }}
                        onClick={handleNavClick}
                      >
                        Manage Team
                      </Nav.Link>
                    </>
                  )}

                  {/* Sub-Admin Links */}
                  {user.role?.toLowerCase() === "sub-admin" && (
                    <>
                      <Nav.Link
                        as={Link}
                        to="/admin/dashboard"
                        className="btn btn-warning ms-lg-2 px-3 py-1 border-0 text-dark fw-bold"
                        style={{ borderRadius: '8px' }}
                        onClick={handleNavClick}
                      >
                        My Customers
                      </Nav.Link>

                      <Nav.Link
                        as={Link}
                        to="/register"
                        className="btn btn-outline-warning ms-lg-2 px-3 py-1 border-2 text-white"
                        style={{ borderRadius: '8px' }}
                        onClick={handleNavClick}
                      >
                        Add New
                      </Nav.Link>
                    </>
                  )}

                  {/* Customer Links */}
                  {user.role === "customer" && (
                    <Nav.Link
                      as={Link}
                      to={`/profile/${user.id}`}
                      className="btn btn-info ms-lg-2 px-4 py-1 border-0 text-white fw-bold shadow-sm"
                      style={{ borderRadius: '50px' }}
                      onClick={handleNavClick}
                    >
                      My Profile
                    </Nav.Link>
                  )}

                  <Nav.Link
                    className="btn btn-danger ms-lg-3 px-3 py-1 border-0 shadow-sm"
                    style={{ borderRadius: '8px' }}
                    onClick={handleLogout}
                  >
                    Logout
                  </Nav.Link>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <RoleSelectionModal
        show={showRoleModal}
        onHide={() => setShowRoleModal(false)}
      />
    </>
  );
};

export default PortfolioNavbar;
