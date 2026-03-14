import { useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const features = [
  { icon: '⚡', title: 'Instant Score Check', desc: 'Get your simulated credit score in seconds with our advanced scoring algorithm based on real FICO factors.', color: '#4f8eff' },
  { icon: '📊', title: 'Score Analytics', desc: 'Track your credit score journey over time with beautiful charts and trend analysis.', color: '#00d4ff' },
  { icon: '💡', title: 'Smart Insights', desc: 'Receive personalized tips and action plans tailored to your specific financial situation.', color: '#a855f7' },
  { icon: '🔒', title: 'Bank-Level Security', desc: 'Your financial data is encrypted and protected with industry-standard security protocols.', color: '#22c55e' },
  { icon: '📱', title: 'Mobile Friendly', desc: 'Access your credit information anywhere, anytime with our fully responsive design.', color: '#f59e0b' },
  { icon: '🎯', title: 'Improvement Plans', desc: 'Get step-by-step guidance to improve your credit score and reach your financial goals.', color: '#ef4444' },
];

const steps = [
  { num: '1', title: 'Create Account', desc: 'Sign up in under a minute with your basic information.' },
  { num: '2', title: 'Enter Financial Info', desc: 'Provide key financial details like income, utilization & payment history.' },
  { num: '3', title: 'Get Your Score', desc: 'Our algorithm calculates your simulated credit score instantly.' },
  { num: '4', title: 'Take Action', desc: 'Follow personalized tips to improve your financial health.' },
];

const faqs = [
  { q: 'How is the credit score calculated?', a: 'Our scoring algorithm mirrors the FICO scoring model, weighting payment history (35%), credit utilization (30%), credit history length (15%), credit mix (10%), and new credit (10%).' },
  { q: 'Is this my real credit score?', a: 'No, this is a simulated educational score based on the information you provide. For your actual credit score, please consult a major credit bureau like Equifax, TransUnion, or Experian.' },
  { q: 'Is my data secure?', a: 'Yes. We use AES-256 encryption, bcrypt password hashing, and industry-standard security practices to protect all your data.' },
  { q: 'How often can I check my score?', a: 'You can check your score as many times as you want. We store your history so you can track improvements over time.' },
  { q: 'What is a good credit score range?', a: 'Scores range from 300-850. Poor: 300-579, Fair: 580-669, Good: 670-739, Very Good: 740-799, Excellent: 800-850.' },
];

function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {faqs.map((faq, i) => (
        <div key={i} className="faq-item">
          <button className="faq-question" onClick={() => setOpenIdx(openIdx === i ? null : i)}>
            <span>{faq.q}</span>
            <span style={{ fontSize: '1.2rem', color: 'var(--color-primary)', transition: 'transform 0.3s', transform: openIdx === i ? 'rotate(180deg)' : 'none' }}>⌄</span>
          </button>
          <div className={`faq-answer ${openIdx === i ? 'open' : ''}`}>{faq.a}</div>
        </div>
      ))}
    </div>
  );
}

export default function Landing() {
  return (
    <div>
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-bg"></div>
        <div className="hero-grid"></div>
        <div className="container">
          <div className="hero-content animate-fade-in-up">
            <div className="hero-badge">🚀 Smart Credit Monitoring Platform</div>
            <h1 className="hero-title">
              Check Your Credit Score<br />
              <span className="gradient-text">Instantly</span>
            </h1>
            <p className="hero-subtitle">
              Get a simulated credit score based on real FICO factors. Understand what affects your score
              and get personalized tips to improve your financial health.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">
                ✨ Check My Score Free
              </Link>
              <Link to="/login" className="btn btn-secondary btn-lg">
                Sign In
              </Link>
            </div>

            <div className="hero-stats">
              {[
                { num: '850', label: 'Max Score' },
                { num: '5+', label: 'Score Factors' },
                { num: '100%', label: 'Free to Use' },
                { num: '⚡', label: 'Instant Results' },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="hero-stat-number">{stat.num}</div>
                  <div className="hero-stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section">
        <div className="container">
          <div className="section-header">
            <div className="section-tag">✦ Features</div>
            <h2 className="section-title">Everything You Need to<br /><span className="gradient-text">Monitor Your Credit</span></h2>
            <p className="section-subtitle">Powerful tools and insights to take control of your financial future.</p>
          </div>
          <div className="features-grid">
            {features.map((f, i) => (
              <div key={i} className="feature-card animate-fade-in-up" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="feature-icon" style={{ background: `${f.color}18`, color: f.color, border: `1px solid ${f.color}33` }}>
                  {f.icon}
                </div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How Credit Scores Work */}
      <section className="section" style={{ background: 'rgba(79,142,255,0.03)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">📚 Education</div>
            <h2 className="section-title">How Credit Scores <span className="gradient-text">Work</span></h2>
            <p className="section-subtitle">Credit scores are calculated using 5 key factors. Understanding them helps you improve your score.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {[
              { label: 'Payment History', pct: '35%', desc: 'The most critical factor — timely payments show lenders you are reliable.', color: '#4f8eff' },
              { label: 'Credit Utilization', pct: '30%', desc: 'Keep your balance below 30% of your credit limit for best results.', color: '#00d4ff' },
              { label: 'Credit History', pct: '15%', desc: 'Longer history shows lenders a consistent financial track record.', color: '#a855f7' },
              { label: 'Credit Mix', pct: '10%', desc: 'Having different types of credit (cards, loans) can boost your score.', color: '#22c55e' },
              { label: 'New Credit', pct: '10%', desc: 'Applying for too much new credit in a short time can lower your score.', color: '#f59e0b' },
            ].map((factor, i) => (
              <div key={i} className="card" style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                <div style={{
                  width: 64, height: 64, borderRadius: '50%', flexShrink: 0,
                  background: `${factor.color}18`, border: `2px solid ${factor.color}44`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontFamily: 'Space Grotesk, sans-serif', fontWeight: 800,
                  fontSize: '1rem', color: factor.color
                }}>
                  {factor.pct}
                </div>
                <div>
                  <div style={{ fontWeight: 700, marginBottom: 4 }}>{factor.label}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{factor.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="section">
        <div className="container">
          <div className="dashboard-grid-equal" style={{ alignItems: 'center' }}>
            <div>
              <div className="section-tag" style={{ textAlign: 'left' }}>💎 Benefits</div>
              <h2 className="section-title" style={{ textAlign: 'left', marginTop: 16 }}>
                Why Monitor Your<br /><span className="gradient-text">Credit Score?</span>
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 32 }}>
                {[
                  { icon: '🏠', title: 'Better Loan Rates', desc: 'Higher credit scores unlock significantly lower interest rates on mortgages and personal loans.' },
                  { icon: '💳', title: 'Credit Card Perks', desc: 'Qualify for premium rewards cards with better cashback, travel points, and benefits.' },
                  { icon: '📉', title: 'Lower Insurance Premiums', desc: 'Many insurers use credit scores to determine your premium rates.' },
                  { icon: '🔮', title: 'Financial Future', desc: 'Build a solid credit foundation for future financial opportunities and goals.' },
                ].map((b, i) => (
                  <div key={i} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                    <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{b.icon}</div>
                    <div>
                      <div style={{ fontWeight: 700, marginBottom: 4 }}>{b.title}</div>
                      <div style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{b.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ position: 'relative' }}>
              <div style={{
                background: 'linear-gradient(135deg, rgba(79,142,255,0.1), rgba(0,212,255,0.05))',
                border: '1px solid var(--color-border)',
                borderRadius: 'var(--radius-xl)',
                padding: 40,
                textAlign: 'center'
              }}>
                <div style={{ fontFamily: 'Space Grotesk', fontSize: '4rem', fontWeight: 800, color: '#4f8eff', textShadow: '0 0 40px rgba(79,142,255,0.4)', marginBottom: 16 }}>785</div>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: 24 }}>Sample Excellent Score</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {[
                    { label: 'Payment History', val: 98, color: '#4f8eff' },
                    { label: 'Credit Utilization', val: 82, color: '#00d4ff' },
                    { label: 'Credit History', val: 90, color: '#a855f7' },
                  ].map((f, i) => (
                    <div key={i} className="progress-bar-container">
                      <div className="progress-bar-header">
                        <span className="progress-bar-label">{f.label}</span>
                        <span className="progress-bar-value">{f.val}%</span>
                      </div>
                      <div className="progress-bar-track">
                        <div className="progress-bar-fill" style={{ width: `${f.val}%`, background: `linear-gradient(90deg, ${f.color}, ${f.color}aa)` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="section" style={{ background: 'rgba(79,142,255,0.02)' }}>
        <div className="container">
          <div className="section-header">
            <div className="section-tag">🗺️ Process</div>
            <h2 className="section-title">How It <span className="gradient-text">Works</span></h2>
            <p className="section-subtitle">Get your credit score in 4 simple steps.</p>
          </div>
          <div className="how-it-works">
            <div className="steps">
              {steps.map((s, i) => (
                <div key={i} className="step animate-fade-in-up" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="step-number">{s.num}</div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 8 }}>{s.title}</h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <Link to="/register" className="btn btn-primary btn-lg">Start Now — It's Free ✨</Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="section">
        <div className="container">
          <div style={{
            background: 'linear-gradient(135deg, rgba(79,142,255,0.15) 0%, rgba(0,212,255,0.08) 100%)',
            border: '1px solid rgba(79,142,255,0.25)',
            borderRadius: 'var(--radius-2xl)',
            padding: '64px 48px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ position: 'absolute', top: -60, right: -60, width: 200, height: 200, background: 'radial-gradient(circle, rgba(79,142,255,0.15), transparent)', borderRadius: '50%' }}></div>
            <h2 className="section-title">Ready to Take Control of<br /><span className="gradient-text">Your Financial Future?</span></h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 36, fontSize: '1rem' }}>Join thousands of users monitoring their credit health with CreditWise.</p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to="/register" className="btn btn-primary btn-lg">Get Started Free</Link>
              <Link to="/login" className="btn btn-secondary btn-lg">Sign In</Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="section" style={{ background: 'rgba(0,0,0,0.2)' }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <div className="section-header">
            <div className="section-tag">❓ FAQ</div>
            <h2 className="section-title">Frequently Asked <span className="gradient-text">Questions</span></h2>
          </div>
          <FAQ />
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent-cyan))', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem' }}>💳</div>
                <span style={{ fontFamily: 'Space Grotesk', fontSize: '1.3rem', fontWeight: 700 }} className="gradient-text">CreditWise</span>
              </div>
              <p className="footer-brand-desc">Smart credit monitoring platform that helps you understand, track, and improve your credit health.</p>
            </div>
            <div>
              <p className="footer-heading">Product</p>
              <ul className="footer-links">
                <li><Link to="/register">Get Started</Link></li>
                <li><a href="#features">Features</a></li>
                <li><a href="#how-it-works">How It Works</a></li>
                <li><a href="#faq">FAQ</a></li>
              </ul>
            </div>
            <div>
              <p className="footer-heading">Account</p>
              <ul className="footer-links">
                <li><Link to="/login">Sign In</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/dashboard">Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <p className="footer-heading">Legal</p>
              <ul className="footer-links">
                <li><a href="#">Privacy Policy</a></li>
                <li><a href="#">Terms of Service</a></li>
                <li><a href="#">Cookie Policy</a></li>
                <li><a href="#">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>© 2024 CreditWise. All rights reserved.</p>
            <p>Built by <b>Aman Thakur</b> with <span style={{ color: 'var(--color-accent-pink)' }}>👌</span></p>
            <p>⚠️ Educational tool only — not a substitute for official credit reports.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
