import { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import { useAuth } from '../context/AuthContext';
import { updateProfile } from '../services/api';

export default function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [loading, setLoading] = useState(false);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('Name is required'); return; }
    setLoading(true);
    try {
      const res = await updateProfile(form);
      updateUser({ name: res.data.user.name, phone: res.data.user.phone });
      toast.success('Profile updated successfully! ✅');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || '?';

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Profile Settings</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Manage your account information.</p>
          </div>

          <div className="dashboard-grid-reverse" style={{ maxWidth: 860 }}>
            {/* Avatar Card */}
            <div className="card" style={{ textAlign: 'center', alignSelf: 'start' }}>
              <div style={{
                width: 96, height: 96,
                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent-cyan))',
                borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 16px',
                fontSize: '2rem', fontWeight: 800, color: 'white',
                boxShadow: '0 8px 24px rgba(79,142,255,0.3)'
              }}>
                {initials}
              </div>
              <h2 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 4 }}>{user?.name}</h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 20 }}>{user?.email}</p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { label: 'Member Since', value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—' },
                  { label: 'Account Type', value: user?.role === 'admin' ? '🛡️ Admin' : '👤 User' },
                  { label: 'Current Score', value: user?.currentScore || 'Not checked' },
                  { label: 'Last Login', value: user?.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Today' },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '10px 12px', background: 'rgba(255,255,255,0.03)',
                    borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)'
                  }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.label}</span>
                    <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Edit Form*/}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>Edit Information</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input id="profile-name" type="text" name="name" className="form-input" value={form.name} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input type="email" className="form-input" value={user?.email || ''} disabled style={{ opacity: 0.5, cursor: 'not-allowed' }} />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Email cannot be changed</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input id="profile-phone" type="tel" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
                </div>
                <button id="save-profile" type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? <><span className="spinner"></span> Saving...</> : '✅ Save Changes'}
                </button>
              </form>

              {/* Security Info */}
              <div style={{ marginTop: 32, padding: '20px', background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: 'var(--radius-md)' }}>
                <h4 style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: 10, color: '#22c55e', display: 'flex', alignItems: 'center', gap: 8 }}>
                  🔒 Security
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <div>✓ Password is securely hashed (bcrypt)</div>
                  <div>✓ Sessions protected with JWT tokens</div>
                  <div>✓ Input data validated and sanitized</div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
