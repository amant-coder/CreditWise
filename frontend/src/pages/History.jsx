import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import { getHistory, getCreditStats } from '../services/api';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement,
  Title, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function getCategoryColor(score) {
  if (score < 580) return '#ef4444';
  if (score < 670) return '#f97316';
  if (score < 740) return '#f59e0b';
  if (score < 800) return '#22c55e';
  return '#4f8eff';
}

function getCategory(score) {
  if (score < 580) return 'Poor';
  if (score < 670) return 'Fair';
  if (score < 740) return 'Good';
  if (score < 800) return 'Very Good';
  return 'Excellent';
}

const BADGE_CLASS = { Poor: 'badge-poor', Fair: 'badge-fair', Good: 'badge-good', 'Very Good': 'badge-very-good', Excellent: 'badge-excellent' };

export default function History() {
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [histRes, statsRes] = await Promise.all([getHistory(), getCreditStats()]);
        setHistory(histRes.data.data || []);
        setStats(statsRes.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const chartData = {
    labels: [...history].reverse().map((h, i) => {
      const d = new Date(h.createdAt);
      return `${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
    }),
    datasets: [{
      label: 'Credit Score',
      data: [...history].reverse().map(h => h.score),
      borderColor: '#4f8eff',
      backgroundColor: 'rgba(79, 142, 255, 0.08)',
      pointBackgroundColor: [...history].reverse().map(h => getCategoryColor(h.score)),
      pointBorderColor: [...history].reverse().map(h => getCategoryColor(h.score)),
      pointRadius: 6,
      pointHoverRadius: 9,
      tension: 0.4,
      fill: true,
      borderWidth: 2.5,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#0d1626',
        borderColor: 'rgba(79,142,255,0.3)',
        borderWidth: 1,
        titleColor: '#f1f5f9',
        bodyColor: '#94a3b8',
        padding: 12,
        callbacks: {
          label: ctx => `Score: ${ctx.parsed.y} — ${getCategory(ctx.parsed.y)}`,
        }
      },
    },
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: { color: '#64748b', font: { size: 11 } },
      },
      y: {
        min: 250,
        max: 900,
        grid: { color: 'rgba(255,255,255,0.04)' },
        ticks: {
          color: '#64748b',
          font: { size: 11 },
          callback: v => v,
        },
      },
    },
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Score History</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Track your credit score over time.</p>
          </div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: 80 }}>
              <div className="spinner" style={{ width: 40, height: 40, borderWidth: 3 }}></div>
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '80px 40px' }}>
              <div style={{ fontSize: '4rem', marginBottom: 24 }}>📈</div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700, marginBottom: 12 }}>No History Yet</h2>
              <p style={{ color: 'var(--text-secondary)', marginBottom: 28 }}>Check your credit score to start tracking history.</p>
              <Link to="/check" className="btn btn-primary">Check My Score →</Link>
            </div>
          ) : (
            <>
              {/* Stats */}
              {stats && (
                <div className="stats-grid" style={{ marginBottom: 28 }}>
                  {[
                    { label: 'Total Checks', value: stats.totalChecks, icon: '🔍', color: '#4f8eff' },
                    { label: 'Highest Score', value: stats.highestScore, icon: '🏆', color: '#22c55e' },
                    { label: 'Average Score', value: stats.averageScore, icon: '📊', color: '#a855f7' },
                    { label: 'Total Change', value: `${stats.improvement >= 0 ? '+' : ''}${stats.improvement}`, icon: stats.improvement >= 0 ? '📈' : '📉', color: stats.improvement >= 0 ? '#22c55e' : '#ef4444' },
                  ].map((s, i) => (
                    <div key={i} className="stat-card">
                      <div className="stat-card-icon" style={{ background: `${s.color}18` }}>{s.icon}</div>
                      <div className="stat-card-value" style={{ color: s.color }}>{s.value}</div>
                      <div className="stat-card-label">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Chart */}
              <div className="card" style={{ marginBottom: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                  <h3 style={{ fontWeight: 700, fontSize: '1rem' }}>Score Trend</h3>
                  <div style={{ display: 'flex', gap: 8 }}>
                    {[['Poor','#ef4444'],['Fair','#f97316'],['Good','#f59e0b'],['Very Good','#22c55e'],['Excellent','#4f8eff']].map(([l,c]) => (
                      <div key={l} style={{ fontSize: '0.7rem', padding: '2px 8px', background: `${c}18`, border: `1px solid ${c}33`, borderRadius: 100, color: c, fontWeight: 600 }}>{l}</div>
                    ))}
                  </div>
                </div>
                <div style={{ height: 300 }}>
                  <Line data={chartData} options={chartOptions} />
                </div>
              </div>

              {/* History Table */}
              <div className="card">
                <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>All Score Checks</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Date & Time</th>
                        <th>Score</th>
                        <th>Category</th>
                        <th>Utilization</th>
                        <th>Missed Payments</th>
                        <th>Income</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.map((h, i) => {
                        const cat = getCategory(h.score);
                        const color = getCategoryColor(h.score);
                        return (
                          <tr key={h._id || i}>
                            <td>{new Date(h.createdAt).toLocaleString()}</td>
                            <td>
                              <span style={{ fontFamily: 'Space Grotesk', fontWeight: 800, fontSize: '1.05rem', color }}>{h.score}</span>
                            </td>
                            <td>
                              <span className={`badge ${BADGE_CLASS[cat]}`}>{cat}</span>
                            </td>
                            <td>{h.creditUtilization !== undefined ? `${h.creditUtilization}%` : '—'}</td>
                            <td>{h.missedPayments !== undefined ? h.missedPayments : '—'}</td>
                            <td>{h.monthlyIncome ? `$${h.monthlyIncome.toLocaleString()}` : '—'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
