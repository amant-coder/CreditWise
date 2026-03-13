import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import { getAdminStats, getAdminUsers, toggleUserStatus } from '../services/api';
import { toast } from 'react-toastify';
import {
  Chart as ChartJS,
  ArcElement, Tooltip, Legend
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

const SCORE_COLORS = { Poor: '#ef4444', Fair: '#f97316', Good: '#f59e0b', 'Very Good': '#22c55e', Excellent: '#4f8eff' };

export default function AdminPanel() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([getAdminStats(), getAdminUsers()]);
      setStats(statsRes.data.data);
      setUsers(usersRes.data.data || []);
    } catch (err) {
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleToggle = async (id) => {
    try {
      const res = await toggleUserStatus(id);
      setUsers(prev => prev.map(u => u._id === id ? { ...u, isActive: !u.isActive } : u));
      toast.success(res.data.message);
    } catch (err) {
      toast.error('Failed to toggle user status');
    }
  };

  const chartData = stats ? {
    labels: stats.scoreDistribution.map(d => d._id),
    datasets: [{
      data: stats.scoreDistribution.map(d => d.count),
      backgroundColor: stats.scoreDistribution.map(d => `${SCORE_COLORS[d._id]}aa`),
      borderColor: stats.scoreDistribution.map(d => SCORE_COLORS[d._id]),
      borderWidth: 2,
    }],
  } : null;

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
              <span style={{ fontSize: '1.5rem' }}>🛡️</span>
              <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Admin Panel</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Monitor application usage and manage users.</p>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: 4, marginBottom: 28, padding: 4, background: 'var(--color-bg-card)', borderRadius: 'var(--radius-md)', width: 'fit-content', border: '1px solid var(--color-border)' }}>
            {['overview', 'users'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '8px 20px', borderRadius: 'var(--radius-sm)', border: 'none',
                background: activeTab === tab ? 'var(--color-primary)' : 'transparent',
                color: activeTab === tab ? 'white' : 'var(--text-secondary)',
                fontFamily: 'var(--font-primary)', fontWeight: 600, fontSize: '0.88rem',
                cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
              }}>
                {tab === 'overview' ? '📊 Overview' : '👥 Users'}
              </button>
            ))}
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
              <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
            </div>
          ) : activeTab === 'overview' && stats ? (
            <>
              {/* Stats */}
              <div className="stats-grid" style={{ marginBottom: 28 }}>
                {[
                  { icon: '👥', label: 'Total Users', value: stats.totalUsers, color: '#4f8eff' },
                  { icon: '✅', label: 'Active Users', value: stats.activeUsers, color: '#22c55e' },
                  { icon: '🔍', label: 'Total Checks', value: stats.totalChecks, color: '#a855f7' },
                  { icon: '📊', label: 'Average Score', value: stats.averageScore || 'N/A', color: '#f59e0b' },
                ].map((s, i) => (
                  <div key={i} className="stat-card">
                    <div className="stat-card-icon" style={{ background: `${s.color}18` }}>{s.icon}</div>
                    <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
                    <div className="stat-card-label">{s.label}</div>
                  </div>
                ))}
              </div>

              <div className="dashboard-grid">
                {/* Recent Signups */}
                <div className="card">
                  <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Recent Signups</h3>
                  {stats.recentSignups?.length > 0 ? (
                    <table className="admin-table">
                      <thead>
                        <tr>
                          <th>User</th>
                          <th>Joined</th>
                          <th>Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.recentSignups.map((u) => (
                          <tr key={u._id}>
                            <td>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{
                                  width: 32, height: 32,
                                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent-cyan))',
                                  borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0
                                }}>
                                  {u.name?.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                            <td style={{ fontWeight: 700, color: u.currentScore ? '#4f8eff' : 'var(--text-muted)' }}>
                              {u.currentScore || '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>No signups yet.</p>
                  )}
                </div>

                {/* Score Distribution Chart */}
                <div className="card">
                  <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Score Distribution</h3>
                  {chartData && chartData.labels.length > 0 ? (
                    <div style={{ height: 240 }}>
                      <Doughnut data={chartData} options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: {
                            position: 'bottom',
                            labels: { color: '#94a3b8', font: { size: 11 }, padding: 12 }
                          },
                          tooltip: {
                            backgroundColor: '#0d1626',
                            borderColor: 'rgba(79,142,255,0.3)',
                            borderWidth: 1,
                            titleColor: '#f1f5f9',
                            bodyColor: '#94a3b8',
                          }
                        }
                      }} />
                    </div>
                  ) : (
                    <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                      No score data yet
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : activeTab === 'users' ? (
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>All Users ({users.length})</h3>
              {users.length === 0 ? (
                <p style={{ color: 'var(--text-muted)' }}>No users found.</p>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Phone</th>
                        <th>Joined</th>
                        <th>Score</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map(u => (
                        <tr key={u._id}>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              <div style={{
                                width: 32, height: 32,
                                background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent-cyan))',
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '0.8rem', fontWeight: 700, color: 'white', flexShrink: 0,
                                opacity: u.isActive ? 1 : 0.5
                              }}>
                                {u.name?.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>{u.phone || '—'}</td>
                          <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                          <td style={{ fontWeight: 700, color: u.currentScore ? '#4f8eff' : 'var(--text-muted)' }}>
                            {u.currentScore || '—'}
                          </td>
                          <td>
                            <span style={{
                              padding: '3px 10px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 700,
                              background: u.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                              color: u.isActive ? '#22c55e' : '#ef4444',
                              border: `1px solid ${u.isActive ? 'rgba(34,197,94,0.3)' : 'rgba(239,68,68,0.3)'}`
                            }}>
                              {u.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td>
                            <button
                              onClick={() => handleToggle(u._id)}
                              className="btn btn-ghost btn-sm"
                              style={{ fontSize: '0.75rem' }}
                            >
                              {u.isActive ? '🚫 Deactivate' : '✅ Activate'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
