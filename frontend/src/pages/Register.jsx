import React, { useState } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.username.trim()) return 'Username is required';
    if (!form.email.trim()) return 'Email is required';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return 'Email looks invalid';
    if (!form.password) return 'Password is required';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return "Passwords don't match";
    return null;
  };

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    const v = validate();
    if (v) { setError(v); return; }

    setLoading(true);
    try {
      const payload = {
        username: form.username.trim(),
        password: form.password,
        email: form.email.trim()
      };

      const res = await api.post('/auth/register', payload);
      setSuccessMsg('Registration successful! You can now login.');
      // optional: after short delay go to login
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      const msg = err?.response?.data?.error || err.message || 'Registration failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card" style={{ maxWidth: 520, margin: '24px auto' }}>
      <h2 style={{ marginTop: 0 }}>Register</h2>

      {error && <div className="error" style={{ marginBottom: 12 }}>{error}</div>}
      {successMsg && <div className="success" style={{ marginBottom: 12 }}>{successMsg}</div>}

      <form onSubmit={submit}>
        <div className="form-row">
          <label className="small">Username</label>
          <input name="username" value={form.username} onChange={onChange} placeholder="john_doe" />
        </div>

        <div className="form-row">
          <label className="small">Email</label>
          <input name="email" value={form.email} onChange={onChange} placeholder="you@example.com" />
        </div>

        <div className="form-row">
          <label className="small">Password</label>
          <input name="password" value={form.password} onChange={onChange} type="password" placeholder="••••••••" />
        </div>

        <div className="form-row">
          <label className="small">Confirm password</label>
          <input name="confirmPassword" value={form.confirmPassword} onChange={onChange} type="password" placeholder="••••••••" />
        </div>

        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          <button type="button" onClick={() => navigate('/login')} style={{ background: '#e5e7eb' }}>
            Go to login
          </button>
        </div>
      </form>
    </div>
  );
}
