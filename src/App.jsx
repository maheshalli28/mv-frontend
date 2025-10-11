// App.jsx
import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import PortfolioNavbar from "./components/Navbar";
import HomeSection from "./components/Home";

// Auth/logic components
// import LoginPage from "./pages/LoginPage";
// import CustomerRegisterPage from "./pages/CustomerRegisterPage";
// import CustomerListPage from "./pages/CustomerListPage";
// import CustomerProfilePage from "./pages/CustomerProfilePage";
// import CustomerPage from "./pages/CustomerPage";
// import ProtectedRoute from "./components/ProtectedRoute";

// Lazy-loaded landing page sections

const Certifications = lazy(() => import("./components/Certifications"));
const Contact = lazy(() => import("./components/Contact"));
const Services = lazy(() => import("./components/Services"));
const Customers = lazy(() => import("./components/Customers"));
const Footer = lazy(() => import("./components/Footer"));
const FeaturesSection = lazy(() => import("./components/FeatureSection"));

const LoginPage = lazy(() => import("./pages/LoginPage"));
const CustomerRegisterPage = lazy(() => import("./pages/CustomerRegisterPage"));
const CustomerListPage = lazy(() => import("./pages/CustomerListPage"));
const CustomerProfilePage = lazy(() => import("./pages/CustomerProfilePage"));
const CustomerPage = lazy(() => import("./pages/CustomerPage"));
const ProtectedRoute = lazy(() => import("./components/ProtectedRoute"));
const AdminLoginPage = lazy(() => import("./pages/AdminLoginPage"));
const AdminRegisterPage = lazy(() => import("./pages/AdminRegisterPage"));
const AdminForgotPasswordPage = lazy(() => import("./pages/AdminForgotPasswordPage"));

// ✅ LandingPageLayout with conditional overlays
function LandingPageLayout() {
  const location = useLocation();
  const isLoginRoute = location.pathname === "/login";
  const isRegisterRoute = location.pathname === "/register";

  return (
    <>
      <Suspense fallback={
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="text-center">
        <div className="spinner-border text-primary" role="status"></div>
        <div className="mt-2">Loading...</div>
      </div>
    </div>
  }>
        <PortfolioNavbar />
        <section id="home"><HomeSection /></section>
        <section id="services"><Services /></section>
        <section id="features"><FeaturesSection /></section>
        <section id="customers"><Customers /></section>
        <section id="certifications"><Certifications /></section>
        <section id="contact"><Contact /></section>
        <Footer />
      </Suspense>

      {/* ✅ Overlay Modals */}
      {isLoginRoute && <LoginPage />}
      {isRegisterRoute && <CustomerRegisterPage />}
    </>
  );
}


function App() {
  return (
    <Router>
      <Routes>
        {/* 👇 Landing + login/register overlays */}
        <Route path="/" element={<LandingPageLayout />} />
        <Route path="/login" element={<LandingPageLayout />} />
        <Route path="/register" element={<LandingPageLayout />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/register" element={<AdminRegisterPage />} />
        <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />

        {/* 🔐 Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PortfolioNavbar />
              <CustomerListPage />
           </ProtectedRoute>
          }
        />
        <Route
          path="/profile/update/:id"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PortfolioNavbar />
              <CustomerProfilePage />
              <Footer />
            </ProtectedRoute>
          }
        />

        {/* 👤 Customer Profile */}
        <Route
          path="/profile/:id"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <CustomerPage />
              <Footer />
            </ProtectedRoute>
          }
        />

        {/* 🔁 Fallback */}
        <Route path="*" element={<LandingPageLayout />} />
      </Routes>
    </Router>
  );
}

export default App;
