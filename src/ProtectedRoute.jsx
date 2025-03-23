// src/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";

const ProtectedRoute = ({ children }) => {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return (
      <div className="loading-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    console.error("Auth error:", error);
    return <Navigate to="/" />;
  }

  return user ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
