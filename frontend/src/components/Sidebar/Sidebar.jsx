import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { icon: '📊', label: 'Dashboard', path: '/dashboard' },
  { icon: '🔍', label: 'Check Score', path: '/check' },
  { icon: '📈', label: 'History', path: '/history' },
  { icon: '👤', label: 'Profile', path: '/profile' },
];

export default function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div style={{ marginBottom: 32, padding: '12px 16px', background: 'rgba(79,142,255,0.08)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 44, height: 44,
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent-cyan))',
            borderRadius: '50%', display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: '1.1rem', fontWeight: 700, color: 'white',
            flexShrink: 0
          }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{ fontWeight: 700, fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</div>
          </div>
        </div>
        {user?.currentScore && (
          <div style={{ marginTop: 12, padding: '8px 12px', background: 'rgba(79,142,255,0.1)', borderRadius: 'var(--radius-sm)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Current Score</span>
            <span style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--color-primary-light)' }}>{user.currentScore}</span>
          </div>
        )}
      </div>

      <ul className="sidebar-nav">
        {navItems.map(item => (
          <li key={item.path}>
            <Link
              to={item.path}
              className={`sidebar-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
        {user?.role === 'admin' && (
          <li>
            <Link
              to="/admin"
              className={`sidebar-nav-item ${location.pathname === '/admin' ? 'active' : ''}`}
            >
              <span className="nav-icon">🛡️</span>
              Admin Panel
            </Link>
          </li>
        )}
      </ul>

      <div style={{ marginTop: 'auto', paddingTop: 32 }}>
        <button onClick={logout} className="sidebar-nav-item" style={{ color: 'var(--color-accent-red)' }}>
          <span className="nav-icon">🚪</span>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
