// src/App.jsx
import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import RequireAuth from './components/RequireAuth';

export default function App() {
  const navigate = useNavigate();
  const token = localStorage.getItem('curesync_token');

  const logout = () => {
    localStorage.removeItem('curesync_token');
    localStorage.removeItem('curesync_username');
    navigate('/login');
  };

  return (
    <div>
      <nav style={{ padding: 12, background: '#0f1724', color: 'white' }}>
        <div className="container" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ fontWeight: 700 }}>CureSync</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
            {!token && <Link to="/register" style={{ color: 'white', textDecoration: 'none' }}>Register</Link>}
            {!token && <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Login</Link>}
            {token && <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>}
            {token && <button onClick={logout} style={{ background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.08)', padding: '6px 10px', borderRadius: 6 }}>Logout</button>}
          </div>
        </div>
      </nav>

      <div className="container">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <RequireAuth>
              <Dashboard />
            </RequireAuth>
          } />
          <Route path="/" element={<div className="card">Welcome. Go to <Link to="/register">Register</Link> or <Link to="/login">Login</Link>.</div>} />
        </Routes>
      </div>
    </div>
  );
}
