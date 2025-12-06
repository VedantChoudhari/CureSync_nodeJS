// src/pages/Login.jsx
import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.username || !form.password) {
      setError('Please enter username and password');
      return;
    }
    setLoading(true);
    try {
      const res = await api.post('/auth/login', {
        username: form.username.trim(),
        password: form.password
      });

      // Backend expected to return token in res.data.token
      const token = res?.data?.token;
      if (!token) {
        setError('Login succeeded but no token returned by server.');
        setLoading(false);
        return;
      }

      // Save token and optional user info
      localStorage.setItem('curesync_token', token);
      localStorage.setItem('curesync_username', res.data.username || form.username);

      // Redirect to dashboard (or home)
      navigate('/dashboard');
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Login failed';
      setError(msg);
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 520, margin: '24px auto' }}>
      <h2 style={{ marginTop: 0 }}>Login</h2>

      {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}

      <form onSubmit={submit}>
        <div className="form-row">
          <label className="small">Username</label>
          <input name="username" value={form.username} onChange={onChange} placeholder="username" />
        </div>

        <div className="form-row">
          <label className="small">Password</label>
          <input name="password" value={form.password} onChange={onChange} type="password" placeholder="••••••••" />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
          <button type="button" onClick={() => navigate('/register')} style={{ background: '#e5e7eb' }}>
            Go to register
          </button>
        </div>
      </form>
    </div>
  );
}
