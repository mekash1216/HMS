import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const isAuthenticated = () => !!localStorage.getItem("sessionToken");

export const PrivateRoute = () => {
  return isAuthenticated() ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicRoute = () => {
  return !isAuthenticated() ? <Outlet /> : <Navigate to="/" replace />;
};
