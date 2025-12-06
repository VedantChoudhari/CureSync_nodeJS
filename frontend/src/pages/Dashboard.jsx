// src/pages/Dashboard.jsx
import React from 'react';

export default function Dashboard() {
  const username = localStorage.getItem('curesync_username') || 'User';
  return (
    <div className="card">
      <h2>Dashboard</h2>
      <p>Welcome, <strong>{username}</strong> — your protected dashboard is working.</p>
      <p>Next: we can list appointments, doctors, inventory pages and call their APIs.</p>
    </div>
  );
}
