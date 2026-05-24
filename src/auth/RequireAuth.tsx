import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import RouteLoading from "../components/RouteLoading";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const { token, loading } = useAuth();

  if (loading) {
    return <RouteLoading />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
