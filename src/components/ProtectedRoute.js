// components/ProtectedRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getCurrentUser();
  if (!user) {
    // If admin route, redirect to admin login
    if (allowedRoles.includes("admin")) {
      return <Navigate to="/admin/login" />;
    }
    // Otherwise, redirect to customer login
    return <Navigate to="/login" />;
  }
  if (!allowedRoles.includes(user.role)) {
    // If logged in but not allowed, redirect to home
    return <Navigate to="/" />;
  }
  return children;
};

export default ProtectedRoute;
