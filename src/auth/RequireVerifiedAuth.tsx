import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import RouteLoading from "../components/RouteLoading";

export default function RequireVerifiedAuth({ children }: { children: React.ReactNode }) {
  const { token, user, loading } = useAuth();

  if (loading) {
    return <RouteLoading />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (user?.email_verified === false) {
    return <Navigate to="/check-email" replace />;
  }

  return <>{children}</>;
}
