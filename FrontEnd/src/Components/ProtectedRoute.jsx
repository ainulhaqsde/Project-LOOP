import React from "react";

import {
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";

// =====================================================
// READ USER FROM JWT
// =====================================================

function getUserFromToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    return null;
  }

  try {
    const payload = JSON.parse(
      atob(token.split(".")[1])
    );

    return payload;
  } catch (error) {
    console.error(
      "Unable to decode authentication token:",
      error
    );

    return null;
  }
}

// =====================================================
// PROTECTED ROUTE
// =====================================================

function ProtectedRoute({
  allowedRoles = [],
}) {
  const location = useLocation();

  const token = localStorage.getItem("token");

  // ===================================================
  // NO TOKEN
  // ===================================================

  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // ===================================================
  // READ JWT
  // ===================================================

  const user = getUserFromToken();

  if (!user) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ===================================================
  // TOKEN EXPIRATION
  // ===================================================

  if (
    user.exp &&
    Date.now() >= user.exp * 1000
  ) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // ===================================================
  // ROLE CHECK
  // ===================================================

  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  // ===================================================
  // AUTHORIZED
  // ===================================================

  return <Outlet />;
}

export default ProtectedRoute;