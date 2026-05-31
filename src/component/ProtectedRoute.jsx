import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, requireAuth = true }) {
  const token = localStorage.getItem("user_token");

  if (requireAuth && !token) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" replace />;
  }

  if (!requireAuth && token) {
    // Redirect to landing if already authenticated
    return <Navigate to="/" replace />;
  }

  return children;
}
