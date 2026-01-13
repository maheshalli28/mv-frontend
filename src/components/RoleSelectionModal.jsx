import React from "react";
import { Modal, Button, Row, Col } from "react-bootstrap";
import { FaUser, FaUserShield, FaUserTie } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const RoleSelectionModal = ({ show, onHide }) => {
    const navigate = useNavigate();

    const handleRoleSelect = (role) => {
        onHide();
        if (role === "customer") {
            navigate("/login");
        } else {
            // Navigate to admin login with role state
            navigate("/admin/login", { state: { initialRole: role } });
        }
    };

    return (
        <Modal
            show={show}
            onHide={onHide}
            centered
            backdrop="static"
            keyboard={false}
            className="role-selection-modal"
            size="lg"
        >
            <Modal.Header closeButton className="border-0 pb-0 shadow-none">
                <Modal.Title className="w-100 text-center fw-bold text-primary fs-3 mt-3">
                    Identify Your Role
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="p-4 pt-2">
                <p className="text-center text-muted mb-5 px-sm-5">
                    Select your account type to access the appropriate portal.
                </p>
                <Row className="g-4 justify-content-center">
                    {/* Customer */}
                    <Col xs={12} md={4}>
                        <div
                            className="role-card h-100 p-4 text-center border rounded-4 shadow-sm"
                            onClick={() => handleRoleSelect("customer")}
                        >
                            <div
                                className="icon-wrapper mb-3 mx-auto d-flex align-items-center justify-content-center bg-warning-subtle rounded-circle"
                                style={{ width: "70px", height: "70px" }}
                            >
                                <FaUser size={30} className="text-warning" />
                            </div>
                            <h5 className="fw-bold mb-2">Customer</h5>
                            <p className="small text-muted mb-0">Track your application status & updates</p>
                        </div>
                    </Col>

                    {/* Sub-Admin */}
                    <Col xs={12} md={4}>
                        <div
                            className="role-card h-100 p-4 text-center border rounded-4 shadow-sm"
                            onClick={() => handleRoleSelect("sub-admin")}
                        >
                            <div
                                className="icon-wrapper mb-3 mx-auto d-flex align-items-center justify-content-center bg-info-subtle rounded-circle"
                                style={{ width: "70px", height: "70px" }}
                            >
                                <FaUserTie size={30} className="text-info" />
                            </div>
                            <h5 className="fw-bold mb-2">Sub-Admin</h5>
                            <p className="small text-muted mb-0">Manage and register your customer base</p>
                        </div>
                    </Col>

                    {/* Super-Admin */}
                    <Col xs={12} md={4}>
                        <div
                            className="role-card h-100 p-4 text-center border rounded-4 shadow-sm"
                            onClick={() => handleRoleSelect("super-admin")}
                        >
                            <div
                                className="icon-wrapper mb-3 mx-auto d-flex align-items-center justify-content-center bg-primary-subtle rounded-circle"
                                style={{ width: "70px", height: "70px" }}
                            >
                                <FaUserShield size={30} className="text-primary" />
                            </div>
                            <h5 className="fw-bold mb-2">Super-Admin</h5>
                            <p className="small text-muted mb-0">Full platform configuration & control</p>
                        </div>
                    </Col>
                </Row>
            </Modal.Body>
            <Modal.Footer className="border-0 pt-0 pb-4 justify-content-center">
                <Button variant="link" className="text-muted text-decoration-none" onClick={onHide}>
                    Cancel
                </Button>
            </Modal.Footer>
            <style>{`
        .role-card {
          cursor: pointer;
          transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
          background: #fff;
        }
        .role-card:hover {
          transform: translateY(-8px);
          border-color: #0d6efd !important;
          background-color: #fbfcfe;
          box-shadow: 0 15px 30px rgba(13, 110, 253, 0.1) !important;
        }
        .role-selection-modal .modal-content {
          border-radius: 24px;
          border: none;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
        .icon-wrapper {
          transition: transform 0.3s ease;
        }
        .role-card:hover .icon-wrapper {
          transform: scale(1.1);
        }
      `}</style>
        </Modal>
    );
};

export default RoleSelectionModal;
