import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { toast.error('Please fill in all fields'); return; }
    setLoading(true);
    try {
      await login(form);
      toast.success('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed. Please try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-bg"></div>
      <div className="auth-card animate-fade-in-up">
        <div className="auth-logo">
          <div className="auth-logo-icon">💳</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your CreditWise account</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              id="password"
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button id="login-submit" type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? <><span className="spinner"></span> Signing in...</> : 'Sign In →'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: 24 }}>
          <p>Don't have an account? <Link to="/register">Create one →</Link></p>
          <p style={{ marginTop: 8 }}><Link to="/">← Back to Home</Link></p>
        </div>

        {/* Demo credentials hint */}
        <div style={{
          marginTop: 20, padding: 16,
          background: 'rgba(79,142,255,0.06)',
          border: '1px solid rgba(79,142,255,0.2)',
          borderRadius: 'var(--radius-md)',
          fontSize: '0.8rem', color: 'var(--text-muted)',
          lineHeight: 1.5
        }}>
          <strong style={{ color: 'var(--color-primary-light)' }}>💡 New user?</strong> Create a free account to get started with your credit score check.
        </div>
      </div>
    </div>
  );
}
