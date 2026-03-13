import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">
          <Link to="/" className="navbar-logo">
            <div className="navbar-logo-icon">💳</div>
            <span className="gradient-text">CreditWise</span>
          </Link>

          {!user && (
            <ul className="navbar-links">
              <li><a href="#features">Features</a></li>
              <li><a href="#how-it-works">How It Works</a></li>
              <li><a href="#faq">FAQ</a></li>
            </ul>
          )}

          {user && (
            <ul className="navbar-links">
              <li><Link to="/dashboard" className={location.pathname === '/dashboard' ? 'active' : ''}>Dashboard</Link></li>
              <li><Link to="/check" className={location.pathname === '/check' ? 'active' : ''}>Check Score</Link></li>
              <li><Link to="/history" className={location.pathname === '/history' ? 'active' : ''}>History</Link></li>
              {user.role === 'admin' && <li><Link to="/admin" className={location.pathname === '/admin' ? 'active' : ''}>Admin</Link></li>}
            </ul>
          )}

          <div className="navbar-actions">
            {user ? (
              <>
                <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 14px', background: 'rgba(79,142,255,0.1)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', cursor: 'pointer', textDecoration: 'none' }}>
                  <div style={{ width: 32, height: 32, background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent-cyan))', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{user.name?.split(' ')[0]}</span>
                </Link>
                <button onClick={logout} className="btn btn-ghost btn-sm">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
                <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
