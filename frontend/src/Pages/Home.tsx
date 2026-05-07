import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const features = [
  { icon: '🧠', title: 'ML-Powered Scoring', desc: 'Our scikit-learn model evaluates your answers and predicts readiness with a 0–100 score.' },
  { icon: '💬', title: 'Instant AI Feedback', desc: 'Get feedback on technical accuracy, communication clarity, strengths, and improvement tips.' },
  { icon: '🎯', title: 'Multi-Domain Practice', desc: 'Practice across MERN, Node.js, Java, Python, DSA, and HR/Behavioral with real questions.' },
];

const stats = [
  { value: '6+', label: 'Interview Domains' },
  { value: '100+', label: 'Practice Questions' },
  { value: 'ML', label: 'Powered Scoring' },
  { value: '0–100', label: 'Readiness Score' },
];

export const Home = () => (
  <PAGE>
    {/* Hero */}
    <section className="hero">
      <div className="hero-badge"><span className="badge-dot" />ML-Powered Interview Predictor</div>
      <h1 className="hero-title">
        Predict Your<br />
        <span className="gradient-text">Interview Readiness</span><br />
        with AI
      </h1>
      <p className="hero-desc">
        Answer real interview questions. Get an ML-computed readiness score, instant feedback on
        technical accuracy and communication skills, and know exactly where to improve.
      </p>
      <div className="hero-actions">
        <Link to="/interviews" className="btn-primary">Start Practicing Free →</Link>
        <Link to="/about" className="btn-ghost">How it works</Link>
      </div>
      <div className="stats-row">
        {stats.map(s => (
          <div className="stat-item" key={s.label}>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>
    </section>

    {/* Preview card */}
    <section className="preview-section">
      <div className="preview-card">
        <div className="preview-header">
          <span className="preview-label">Sample Readiness Report</span>
          <span className="preview-badge">ML Result</span>
        </div>
        <div className="preview-score-row">
          <div className="preview-ring">
            <svg viewBox="0 0 120 120" className="ring-svg">
              <circle cx="60" cy="60" r="50" fill="none" stroke="var(--ring-track)" strokeWidth="10" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="url(#sg)" strokeWidth="10"
                strokeDasharray="314" strokeDashoffset="75" strokeLinecap="round" transform="rotate(-90 60 60)" />
              <defs>
                <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="var(--accent)" />
                  <stop offset="100%" stopColor="var(--accent-3)" />
                </linearGradient>
              </defs>
            </svg>
            <div className="ring-center">
              <span className="ring-score">76</span>
              <span className="ring-label">/ 100</span>
            </div>
          </div>
          <div className="preview-metrics">
            <div className="metric-row">
              <span className="metric-name">Technical Knowledge</span>
              <div className="metric-bar-wrap"><div className="metric-bar" style={{ width: '80%' }} /></div>
              <span className="metric-val">8.0</span>
            </div>
            <div className="metric-row">
              <span className="metric-name">Communication</span>
              <div className="metric-bar-wrap"><div className="metric-bar cyan" style={{ width: '70%' }} /></div>
              <span className="metric-val">7.0</span>
            </div>
            <div className="metric-level">✓ Ready</div>
          </div>
        </div>
        <div className="preview-tags">
          <span className="tag green">✓ Strong technical explanation</span>
          <span className="tag green">✓ Clear communication</span>
          <span className="tag amber">↑ Add more examples</span>
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="features">
      <h2 className="section-title">Why use SIRP?</h2>
      <p className="section-sub">No fluff. Just ML-powered insight on your real interview performance.</p>
      <div className="features-grid">
        {features.map(f => (
          <div className="feature-card" key={f.title}>
            <div className="feature-icon">{f.icon}</div>
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>
    </section>

    {/* CTA */}
    <section className="cta-section">
      <h2>Ready to know your interview score?</h2>
      <p>Pick a domain, answer questions, and get your ML readiness report in seconds.</p>
      <Link to="/interviews" className="btn-primary">Choose Your Domain →</Link>
    </section>
  </PAGE>
);

const PAGE = styled.div`
  min-height: 100vh;
  background: var(--bg);
  transition: background 0.3s ease;

  .hero {
    max-width: 900px; margin: 0 auto;
    padding: 90px 28px 60px; text-align: center;
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 16px; border-radius: 999px;
    border: 1px solid var(--border-hover);
    background: var(--accent-light);
    font-size: 13px; font-weight: 500; color: var(--accent);
    margin-bottom: 28px;
  }

  .badge-dot {
    width: 8px; height: 8px; border-radius: 50%;
    background: var(--success);
    box-shadow: 0 0 8px var(--success);
    animation: pulse 2s infinite;
  }

  @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }

  .hero-title {
    font-size: clamp(38px,6vw,66px); font-weight: 900;
    line-height: 1.1; letter-spacing: -0.03em;
    color: var(--text-1); margin-bottom: 24px;
    transition: color 0.3s ease;
  }

  .gradient-text {
    background: var(--gradient-text);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .hero-desc {
    font-size: 18px; color: var(--text-2); max-width: 600px;
    margin: 0 auto 40px; line-height: 1.7;
  }

  .hero-actions {
    display: flex; gap: 16px; justify-content: center;
    flex-wrap: wrap; margin-bottom: 60px;
  }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 14px 28px; border-radius: 12px;
    background: var(--gradient); color: white;
    font-size: 15px; font-weight: 600;
    box-shadow: var(--shadow-glow);
    transition: all 0.25s ease;
    &:hover { transform: translateY(-2px); box-shadow: 0 0 40px var(--accent-glow); }
  }

  .btn-ghost {
    display: inline-flex; align-items: center;
    padding: 14px 28px; border-radius: 12px;
    border: 1px solid var(--border);
    color: var(--text-2); font-size: 15px; font-weight: 500;
    transition: all 0.25s ease;
    &:hover { border-color: var(--border-hover); color: var(--text-1); background: var(--accent-light); }
  }

  .stats-row { display: flex; justify-content: center; gap: 48px; flex-wrap: wrap; }

  .stat-item { display: flex; flex-direction: column; align-items: center; }

  .stat-value {
    font-size: 28px; font-weight: 800;
    background: var(--gradient-text);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  }

  .stat-label {
    font-size: 12px; color: var(--text-3);
    text-transform: uppercase; letter-spacing: 0.08em; margin-top: 2px;
  }

  /* Preview */
  .preview-section { max-width: 760px; margin: 0 auto 80px; padding: 0 28px; }

  .preview-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 20px; padding: 28px;
    box-shadow: var(--shadow);
    transition: background 0.3s ease, border-color 0.3s ease;
  }

  .preview-header {
    display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px;
  }

  .preview-label {
    font-size: 12px; font-weight: 600; color: var(--text-3);
    text-transform: uppercase; letter-spacing: 0.08em;
  }

  .preview-badge {
    padding: 4px 10px; border-radius: 6px;
    background: var(--badge-bg); color: var(--badge-color);
    font-size: 11px; font-weight: 600;
  }

  .preview-score-row { display: flex; gap: 32px; align-items: center; margin-bottom: 20px; }

  .preview-ring { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
  .ring-svg { width: 100%; height: 100%; }

  .ring-center {
    position: absolute; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
  }

  .ring-score { font-size: 30px; font-weight: 900; color: var(--text-1); line-height: 1; }
  .ring-label { font-size: 11px; color: var(--text-3); }

  .preview-metrics { flex: 1; display: flex; flex-direction: column; gap: 14px; }

  .metric-row { display: flex; align-items: center; gap: 12px; }
  .metric-name { font-size: 13px; color: var(--text-2); width: 160px; flex-shrink: 0; }

  .metric-bar-wrap {
    flex: 1; height: 6px; background: var(--bg-surface); border-radius: 99px; overflow: hidden;
  }

  .metric-bar {
    height: 100%; border-radius: 99px;
    background: var(--score-indigo); transition: width 1s ease;
    &.cyan { background: var(--score-cyan); }
  }

  .metric-val { font-size: 13px; font-weight: 700; color: var(--text-1); width: 30px; text-align: right; }

  .metric-level {
    font-size: 13px; font-weight: 700; padding: 4px 14px; border-radius: 8px;
    display: inline-block; margin-top: 4px; align-self: flex-start;
    background: var(--success-bg); color: var(--success); border: 1px solid var(--success-border);
  }

  .preview-tags { display: flex; gap: 8px; flex-wrap: wrap; }

  .tag {
    padding: 5px 12px; border-radius: 8px; font-size: 12px; font-weight: 500;
    &.green { background: var(--success-bg); color: var(--success); border: 1px solid var(--success-border); }
    &.amber { background: var(--warning-bg); color: var(--warning); border: 1px solid var(--warning-border); }
  }

  /* Features */
  .features { max-width: 1100px; margin: 0 auto 80px; padding: 0 28px; text-align: center; }

  .section-title { font-size: clamp(26px,3vw,36px); font-weight: 800; color: var(--text-1); margin-bottom: 12px; }
  .section-sub { font-size: 16px; color: var(--text-3); margin-bottom: 48px; }

  .features-grid { display: grid; grid-template-columns: repeat(auto-fit,minmax(280px,1fr)); gap: 20px; }

  .feature-card {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px 24px; text-align: left;
    transition: all 0.25s ease;
    &:hover { border-color: var(--border-hover); box-shadow: var(--shadow-glow); transform: translateY(-3px); }
    h3 { font-size: 16px; font-weight: 700; color: var(--text-1); margin: 14px 0 8px; }
    p { font-size: 14px; color: var(--text-2); line-height: 1.7; }
  }

  .feature-icon { font-size: 28px; }

  /* CTA */
  .cta-section {
    max-width: 700px; margin: 0 auto 80px; padding: 60px 28px; text-align: center;
    background: var(--bg-card); border: 1px solid var(--border-hover);
    border-radius: 24px; box-shadow: var(--shadow);
    h2 { font-size: clamp(22px,3vw,32px); font-weight: 800; color: var(--text-1); margin-bottom: 12px; }
    p { color: var(--text-2); font-size: 15px; margin-bottom: 32px; }
  }

  @media (max-width: 640px) {
    .preview-score-row { flex-direction: column; }
    .metric-name { width: 110px; }
    .stats-row { gap: 24px; }
  }
`;
