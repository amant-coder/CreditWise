import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.password) { toast.error('Please fill in all fields'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    setLoading(true);
    try {
      await register({ name: form.name, email: form.email, phone: form.phone, password: form.password });
      toast.success('Account created successfully! 🎉');
      navigate('/check');
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const strength = () => {
    if (!form.password) return 0;
    let s = 0;
    if (form.password.length >= 6) s++;
    if (form.password.length >= 10) s++;
    if (/[A-Z]/.test(form.password)) s++;
    if (/[0-9]/.test(form.password)) s++;
    if (/[^A-Za-z0-9]/.test(form.password)) s++;
    return s;
  };

  const strengthColors = ['', '#ef4444', '#f97316', '#f59e0b', '#22c55e', '#4f8eff'];
  const strengthLabels = ['', 'Very Weak', 'Weak', 'Fair', 'Strong', 'Very Strong'];
  const s = strength();

  return (
    <div className="auth-page">
      <div className="auth-bg"></div>
      <div className="auth-card animate-fade-in-up" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">💳</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Start monitoring your credit score for free</p>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input id="name" type="text" name="name" className="form-input" placeholder="John Doe" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input id="phone" type="tel" name="phone" className="form-input" placeholder="+1 234 567 8900" value={form.phone} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input id="reg-email" type="email" name="email" className="form-input" placeholder="you@example.com" value={form.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input id="reg-password" type="password" name="password" className="form-input" placeholder="Min. 6 characters" value={form.password} onChange={handleChange} required />
            {form.password && (
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                  {[1,2,3,4,5].map(i => (
                    <div key={i} style={{ flex: 1, height: 3, borderRadius: 2, background: i <= s ? strengthColors[s] : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }}></div>
                  ))}
                </div>
                <span style={{ fontSize: '0.75rem', color: strengthColors[s] }}>{strengthLabels[s]}</span>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <input id="confirm-password" type="password" name="confirmPassword" className="form-input" placeholder="Repeat your password" value={form.confirmPassword} onChange={handleChange} required />
            {form.confirmPassword && form.password !== form.confirmPassword && (
              <span className="form-error">⚠ Passwords don't match</span>
            )}
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            By creating an account you agree to our <a href="#" style={{ color: 'var(--color-primary-light)' }}>Terms of Service</a> and <a href="#" style={{ color: 'var(--color-primary-light)' }}>Privacy Policy</a>.
          </div>

          <button id="register-submit" type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px' }} disabled={loading}>
            {loading ? <><span className="spinner"></span> Creating account...</> : 'Create Account ✨'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login">Sign in →</Link></p>
          <p style={{ marginTop: 8 }}><Link to="/">← Back to Home</Link></p>
        </div>
      </div>
    </div>
  );
}
