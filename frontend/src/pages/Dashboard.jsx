import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import ScoreGauge from '../components/ScoreGauge/ScoreGauge';
import { useAuth } from '../context/AuthContext';
import { getLatestScore, getCreditStats } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const FACTOR_LABELS = {
  paymentHistory: 'Payment History',
  creditUtilization: 'Credit Utilization',
  creditHistoryLength: 'Credit History Length',
  creditMix: 'Credit Mix',
  newCredit: 'New Credit',
};

const FACTOR_WEIGHTS = {
  paymentHistory: 35,
  creditUtilization: 30,
  creditHistoryLength: 15,
  creditMix: 10,
  newCredit: 10,
};

const FACTOR_COLORS = {
  paymentHistory: '#4f8eff',
  creditUtilization: '#00d4ff',
  creditHistoryLength: '#a855f7',
  creditMix: '#22c55e',
  newCredit: '#f59e0b',
};

function ScoreCategory(score) {
  if (score < 580) return { label: 'Poor', color: '#ef4444' };
  if (score < 670) return { label: 'Fair', color: '#f97316' };
  if (score < 740) return { label: 'Good', color: '#f59e0b' };
  if (score < 800) return { label: 'Very Good', color: '#22c55e' };
  return { label: 'Excellent', color: '#4f8eff' };
}

export default function Dashboard() {
  const { user } = useAuth();
  const [latest, setLatest] = useState(null);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [latestRes, statsRes] = await Promise.all([
          getLatestScore(),
          getCreditStats(),
        ]);
        setLatest(latestRes.data.data);
        setStats(statsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const cat = latest ? ScoreCategory(latest.score) : null;

  const chartData = {
    labels: latest ? ['Your Score', 'Fair', 'Good', 'Very Good', 'Excellent'] : [],
    datasets: [{
      label: 'Score History',
      data: latest ? [] : [],
    }]
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>
              Welcome back, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
              <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
            </div>
          ) : !latest ? (
            /* No score yet */
            <div style={{ textAlign: 'center', padding: '80px 40px' }}>
              <div style={{ fontSize: '4rem', marginBottom: 24 }}>📊</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 700, marginBottom: 12 }}>No Credit Score Yet</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 32, maxWidth: 400, margin: '0 auto 32px' }}>
                Check your credit score for the first time to see personalized insights and recommendations.
              </p>
              <Link to="/check" className="btn btn-primary btn-lg">🔍 Check My Score Now</Link>
            </div>
          ) : (
            <>
              {/* Stats Row */}
              <div className="stats-grid">
                {[
                  { icon: '📊', label: 'Current Score', value: latest.score, color: cat.color, sub: cat.label },
                  { icon: '🔍', label: 'Total Checks', value: stats?.totalChecks || 0, color: '#a855f7' },
                  { icon: '📈', label: 'Highest Score', value: stats?.highestScore || latest.score, color: '#22c55e' },
                  { icon: '📉', label: 'Change', value: `${stats?.improvement >= 0 ? '+' : ''}${stats?.improvement || 0}`, color: stats?.improvement >= 0 ? '#22c55e' : '#ef4444' },
                ].map((s, i) => (
                  <div key={i} className="stat-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                    <div className="stat-card-icon" style={{ background: `${s.color}18`, fontSize: '1.3rem' }}>{s.icon}</div>
                    <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
                    <div className="stat-card-label">{s.label}</div>
                    {s.sub && <div style={{ fontSize: '0.75rem', color: s.color, marginTop: 4, fontWeight: 600 }}>{s.sub}</div>}
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div className="dashboard-grid-reverse" style={{ marginBottom: 24 }}>
                {/* Score Gauge Card */}
                <div className="card" style={{ textAlign: 'center' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>Your Credit Score</h3>
                  <ScoreGauge score={latest.score} size={200} />
                  <div style={{ marginTop: 20, display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
                    {[['300','Poor','#ef4444'],['580','Fair','#f97316'],['670','Good','#f59e0b'],['740','Very Good','#22c55e'],['800','Excellent','#4f8eff']].map(([min,lbl,clr]) => (
                      <div key={lbl} style={{ padding: '3px 8px', background: `${clr}18`, border: `1px solid ${clr}33`, borderRadius: 100, fontSize: '0.65rem', fontWeight: 600, color: clr }}>
                        {min}+ {lbl}
                      </div>
                    ))}
                  </div>
                  <Link to="/check" className="btn btn-primary" style={{ width: '100%', marginTop: 20 }}>
                    🔄 Recalculate Score
                  </Link>
                </div>

                {/* Score Factors */}
                <div className="card">
                  <h3 style={{ fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>Score Factor Breakdown</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                    {Object.entries(latest.factors || {}).map(([key, val]) => (
                      <div key={key} className="progress-bar-container">
                        <div className="progress-bar-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span className="progress-bar-label">{FACTOR_LABELS[key]}</span>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({FACTOR_WEIGHTS[key]}%)</span>
                          </div>
                          <span className="progress-bar-value" style={{ color: FACTOR_COLORS[key] }}>{Math.round(val)}%</span>
                        </div>
                        <div className="progress-bar-track">
                          <div className="progress-bar-fill" style={{
                            width: `${val}%`,
                            background: `linear-gradient(90deg, ${FACTOR_COLORS[key]}, ${FACTOR_COLORS[key]}aa)`
                          }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tips */}
              {latest.tips && latest.tips.length > 0 && (
                <div className="card" style={{ marginBottom: 24 }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>💡 Personalized Tips to Improve Your Score</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 12 }}>
                    {latest.tips.map((tip, i) => (
                      <div key={i} className="tip-card">
                        <span className="tip-icon">💡</span>
                        <span>{tip}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                {[
                  { icon: '📈', label: 'View Score History', desc: 'Track your progress over time', path: '/history', color: '#4f8eff' },
                  { icon: '🔍', label: 'New Score Check', desc: 'Update your financial data', path: '/check', color: '#00d4ff' },
                  { icon: '👤', label: 'Edit Profile', desc: 'Update your account info', path: '/profile', color: '#a855f7' },
                ].map((action, i) => (
                  <Link
                    key={i}
                    to={action.path}
                    style={{
                      display: 'block',
                      padding: 20,
                      background: `${action.color}0d`,
                      border: `1px solid ${action.color}25`,
                      borderRadius: 'var(--radius-md)',
                      textDecoration: 'none',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = `${action.color}55`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = `${action.color}25`; e.currentTarget.style.transform = 'translateY(0)'; }}
                  >
                    <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>{action.icon}</div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: action.color, marginBottom: 4 }}>{action.label}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{action.desc}</div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
