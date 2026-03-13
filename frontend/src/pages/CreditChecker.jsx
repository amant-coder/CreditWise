import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Navbar from '../components/Navbar/Navbar';
import Sidebar from '../components/Sidebar/Sidebar';
import ScoreGauge from '../components/ScoreGauge/ScoreGauge';
import { calculateScore } from '../services/api';
import { useAuth } from '../context/AuthContext';

const defaultForm = {
  monthlyIncome: '',
  numberOfCreditCards: '',
  creditUtilization: '',
  loanHistory: 'none',
  missedPayments: '',
  creditHistoryLength: '',
};

const FACTOR_LABELS = {
  paymentHistory: 'Payment History (35%)',
  creditUtilization: 'Credit Utilization (30%)',
  creditHistoryLength: 'Credit History Length (15%)',
  creditMix: 'Credit Mix (10%)',
  newCredit: 'New Credit (10%)',
};

const FACTOR_COLORS = {
  paymentHistory: '#4f8eff',
  creditUtilization: '#00d4ff',
  creditHistoryLength: '#a855f7',
  creditMix: '#22c55e',
  newCredit: '#f59e0b',
};

export default function CreditChecker() {
  const [form, setForm] = useState(defaultForm);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const { updateUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();

    // Validate
    for (const [key, val] of Object.entries(form)) {
      if (val === '' || val === undefined) {
        toast.error('Please fill in all fields');
        return;
      }
    }

    const parsed = {
      monthlyIncome: parseFloat(form.monthlyIncome),
      numberOfCreditCards: parseInt(form.numberOfCreditCards),
      creditUtilization: parseFloat(form.creditUtilization),
      loanHistory: form.loanHistory,
      missedPayments: parseInt(form.missedPayments),
      creditHistoryLength: parseInt(form.creditHistoryLength),
    };

    if (parsed.monthlyIncome < 0) { toast.error('Income cannot be negative'); return; }
    if (parsed.creditUtilization < 0 || parsed.creditUtilization > 100) { toast.error('Credit utilization must be between 0-100%'); return; }
    if (parsed.missedPayments < 0) { toast.error('Missed payments cannot be negative'); return; }

    setLoading(true);
    setResult(null);
    try {
      const res = await calculateScore(parsed);
      setResult(res.data.data);
      updateUser({ currentScore: res.data.data.score });
      toast.success('Credit score calculated! 🎉');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      const msg = err.response?.data?.message || err.response?.data?.errors?.[0]?.msg || 'Calculation failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat) => {
    const map = { Poor: '#ef4444', Fair: '#f97316', Good: '#f59e0b', 'Very Good': '#22c55e', Excellent: '#4f8eff' };
    return map[cat] || '#4f8eff';
  };

  return (
    <div>
      <Navbar />
      <div className="dashboard-layout">
        <Sidebar />
        <main className="dashboard-main">
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: 4 }}>Credit Score Checker</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Enter your financial information to calculate your simulated credit score.</p>
          </div>

          <div className={result ? 'dashboard-grid-equal' : ''} style={{ maxWidth: result ? '100%' : 640 }}>
            {/* Form */}
            <div className="card">
              <h3 style={{ fontWeight: 700, marginBottom: 24, fontSize: '1rem' }}>📝 Financial Information</h3>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

                <div className="form-group">
                  <label className="form-label">💰 Monthly Income ($)</label>
                  <input
                    id="monthlyIncome"
                    type="number"
                    name="monthlyIncome"
                    className="form-input"
                    placeholder="e.g. 5000"
                    min="0"
                    value={form.monthlyIncome}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">💳 Number of Credit Cards</label>
                    <input
                      id="numberOfCreditCards"
                      type="number"
                      name="numberOfCreditCards"
                      className="form-input"
                      placeholder="e.g. 2"
                      min="0"
                      value={form.numberOfCreditCards}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">📊 Credit Utilization (%)</label>
                    <input
                      id="creditUtilization"
                      type="number"
                      name="creditUtilization"
                      className="form-input"
                      placeholder="e.g. 25"
                      min="0"
                      max="100"
                      value={form.creditUtilization}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">🏦 Loan History</label>
                  <select id="loanHistory" name="loanHistory" className="form-select" value={form.loanHistory} onChange={handleChange}>
                    <option value="none">No loan history</option>
                    <option value="good">Good — Always paid on time</option>
                    <option value="average">Average — Occasional delays</option>
                    <option value="poor">Poor — Frequent missed payments</option>
                  </select>
                </div>

                <div className="form-grid">
                  <div className="form-group">
                    <label className="form-label">❌ Missed Payments (last 2 yrs)</label>
                    <input
                      id="missedPayments"
                      type="number"
                      name="missedPayments"
                      className="form-input"
                      placeholder="e.g. 0"
                      min="0"
                      value={form.missedPayments}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">📅 Credit History (months)</label>
                    <input
                      id="creditHistoryLength"
                      type="number"
                      name="creditHistoryLength"
                      className="form-input"
                      placeholder="e.g. 36"
                      min="0"
                      value={form.creditHistoryLength}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div style={{ padding: 16, background: 'rgba(79,142,255,0.06)', border: '1px solid rgba(79,142,255,0.15)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
                  ℹ️ This calculator uses a weighted algorithm based on FICO scoring factors. Results are for educational purposes only.
                </div>

                <button
                  id="calculate-btn"
                  type="submit"
                  className="btn btn-primary"
                  style={{ width: '100%', padding: 14, fontSize: '1rem' }}
                  disabled={loading}
                >
                  {loading
                    ? <><span className="spinner"></span> Calculating...</>
                    : '🔍 Calculate My Credit Score'
                  }
                </button>
              </form>
            </div>

            {/* Results Panel */}
            {result && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }} className="animate-fade-in-up">
                {/* Score Card */}
                <div className="card" style={{ textAlign: 'center' }}>
                  <h3 style={{ fontWeight: 700, marginBottom: 8, fontSize: '1rem' }}>Your Credit Score</h3>
                  <ScoreGauge score={result.score} size={200} />
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', background: `${getCategoryColor(result.category)}18`, border: `1px solid ${getCategoryColor(result.category)}44`, borderRadius: 100 }}>
                      <span style={{ fontWeight: 700, color: getCategoryColor(result.category), fontSize: '0.9rem' }}>{result.category}</span>
                    </div>
                  </div>
                </div>

                {/* Factor Breakdown */}
                <div className="card">
                  <h3 style={{ fontWeight: 700, marginBottom: 20, fontSize: '1rem' }}>Score Breakdown</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    {Object.entries(result.factors || {}).map(([key, val]) => (
                      <div key={key} className="progress-bar-container">
                        <div className="progress-bar-header">
                          <span className="progress-bar-label">{FACTOR_LABELS[key]}</span>
                          <span className="progress-bar-value" style={{ color: FACTOR_COLORS[key] }}>{Math.round(val)}%</span>
                        </div>
                        <div className="progress-bar-track">
                          <div className="progress-bar-fill" style={{ width: `${val}%`, background: `linear-gradient(90deg, ${FACTOR_COLORS[key]}, ${FACTOR_COLORS[key]}88)` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tips */}
                {result.tips && result.tips.length > 0 && (
                  <div className="card">
                    <h3 style={{ fontWeight: 700, marginBottom: 16, fontSize: '1rem' }}>💡 Improvement Tips</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {result.tips.map((tip, i) => (
                        <div key={i} className="tip-card">
                          <span className="tip-icon">{i === 0 ? '🎯' : i === 1 ? '📈' : '✅'}</span>
                          <span style={{ fontSize: '0.85rem' }}>{tip}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  onClick={() => navigate('/history')}
                  className="btn btn-secondary"
                  style={{ width: '100%' }}
                >
                  📈 View Score History
                </button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
