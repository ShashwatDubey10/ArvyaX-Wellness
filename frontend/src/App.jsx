// src/App.jsx
import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Sessions from "./pages/Sessions";
import Dashboard from "./pages/Dashboard";
import MySessions from "./pages/MySessions";
import SessionEditor from "./pages/SessionEditor";

import api from "./api/axios";

const ProtectedRoute = ({ children }) => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    api
      .get("/auth/check")
      .then(() => setIsAuthenticated(true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => setAuthChecked(true));
  }, []);

  if (!authChecked) {
    return <div className="p-10 text-center">Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Header />
      <Routes>
        {/* Public routes */}
        <Route path="/sessions" element={<Sessions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-sessions"
          element={
            <ProtectedRoute>
              <MySessions />
            </ProtectedRoute>
          }
        />
        {/* IMPORTANT: Place /new ABOVE /:id or it will never match */}
        <Route
          path="/my-sessions/new"
          element={
            <ProtectedRoute>
              <SessionEditor />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-sessions/:id"
          element={
            <ProtectedRoute>
              <SessionEditor />
            </ProtectedRoute>
          }
        />

        {/* Redirect root to /sessions */}
        <Route path="/" element={<Navigate to="/sessions" replace />} />

        {/* 404 fallback route */}
        <Route
          path="*"
          element={<div className="p-10 text-center">404 - Page not found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}
