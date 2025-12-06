// src/components/RequireAuth.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
  const token = localStorage.getItem('curesync_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}
