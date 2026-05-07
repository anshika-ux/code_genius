import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Props {
  score: number;
  level: string;
  subjectScore: number;
  communicationScore: number;
  strengths: string[];
  improvements: string[];
}

export const ReadinessScore: React.FC<Props> = ({ score, level, subjectScore, communicationScore, strengths, improvements }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let current = 0;
    const step = score / 60;
    const timer = setInterval(() => {
      current += step;
      if (current >= score) { setAnimatedScore(score); clearInterval(timer); }
      else setAnimatedScore(Math.round(current));
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  return (
    <WRAP>
      <div className="score-header">
        <h2 className="score-title">Your Readiness Report</h2>
        <span className={`level-badge ${score >= 80 ? 'high' : score >= 65 ? 'mid' : score >= 45 ? 'low' : 'very-low'}`}>
          {level}
        </span>
      </div>

      <div className="score-body">
        <div className="ring-wrap">
          <svg viewBox="0 0 120 120" className="ring-svg">
            <circle cx="60" cy="60" r="54" fill="none" stroke="var(--ring-track)" strokeWidth="10" />
            <circle cx="60" cy="60" r="54" fill="none" stroke="url(#rg)" strokeWidth="10"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" transform="rotate(-90 60 60)"
              style={{ transition: 'stroke-dashoffset 0.05s linear' }} />
            <defs>
              <linearGradient id="rg" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--accent)" />
                <stop offset="100%" stopColor="var(--accent-3)" />
              </linearGradient>
            </defs>
          </svg>
          <div className="ring-center">
            <span className="ring-num">{animatedScore}</span>
            <span className="ring-sub">/ 100</span>
          </div>
        </div>

        <div className="sub-scores">
          <div className="sub-row">
            <span className="sub-label">Technical Knowledge</span>
            <div className="bar-wrap"><div className="bar bar-1" style={{ width: `${(subjectScore / 10) * 100}%` }} /></div>
            <span className="sub-val">{subjectScore.toFixed(1)}<span className="sub-max">/10</span></span>
          </div>
          <div className="sub-row">
            <span className="sub-label">Communication</span>
            <div className="bar-wrap"><div className="bar bar-2" style={{ width: `${(communicationScore / 10) * 100}%` }} /></div>
            <span className="sub-val">{communicationScore.toFixed(1)}<span className="sub-max">/10</span></span>
          </div>
        </div>
      </div>

      {strengths.length > 0 && (
        <div className="section">
          <h3 className="section-heading">✅ Strengths</h3>
          <ul className="list">{strengths.map((s, i) => <li key={i} className="list-item success">{s}</li>)}</ul>
        </div>
      )}

      {improvements.length > 0 && (
        <div className="section">
          <h3 className="section-heading">📈 Areas to Improve</h3>
          <ul className="list">{improvements.map((imp, i) => <li key={i} className="list-item warning">{imp}</li>)}</ul>
        </div>
      )}
    </WRAP>
  );
};

const WRAP = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 18px; padding: 28px;
  display: flex; flex-direction: column; gap: 22px;
  transition: background 0.3s ease, border-color 0.3s ease;

  .score-header { display: flex; justify-content: space-between; align-items: center; }
  .score-title { font-size: 16px; font-weight: 700; color: var(--text-1); }

  .level-badge {
    padding: 4px 12px; border-radius: 8px;
    font-size: 12px; font-weight: 700; letter-spacing: 0.04em; border: 1px solid;
    &.high  { background: var(--success-bg); color: var(--success); border-color: var(--success-border); }
    &.mid   { background: var(--accent-light); color: var(--accent); border-color: var(--border-hover); }
    &.low   { background: var(--warning-bg); color: var(--warning); border-color: var(--warning-border); }
    &.very-low { background: var(--danger-bg); color: var(--danger); border-color: var(--danger-border); }
  }

  .score-body { display: flex; gap: 28px; align-items: center; }

  .ring-wrap { position: relative; width: 120px; height: 120px; flex-shrink: 0; }
  .ring-svg { width: 100%; height: 100%; }

  .ring-center { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; }
  .ring-num { font-size: 32px; font-weight: 900; color: var(--text-1); line-height: 1; }
  .ring-sub { font-size: 11px; color: var(--text-3); }

  .sub-scores { flex: 1; display: flex; flex-direction: column; gap: 16px; }

  .sub-row { display: flex; align-items: center; gap: 12px; }
  .sub-label { font-size: 13px; color: var(--text-2); width: 150px; flex-shrink: 0; }

  .bar-wrap { flex: 1; height: 7px; background: var(--bg-surface); border-radius: 99px; overflow: hidden; }

  .bar { height: 100%; border-radius: 99px; transition: width 1s ease; }
  .bar-1 { background: var(--score-indigo); }
  .bar-2 { background: var(--score-cyan); }

  .sub-val { font-size: 13px; font-weight: 700; color: var(--text-1); width: 44px; text-align: right; }
  .sub-max { font-size: 11px; color: var(--text-3); font-weight: 400; }

  .section-heading {
    font-size: 12px; font-weight: 700; color: var(--text-3);
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px;
  }

  .list { list-style: none; display: flex; flex-direction: column; gap: 6px; }

  .list-item {
    font-size: 13px; padding: 8px 12px; border-radius: 8px; line-height: 1.5;
    &.success { background: var(--success-bg); color: var(--success); border: 1px solid var(--success-border); }
    &.warning { background: var(--warning-bg); color: var(--warning); border: 1px solid var(--warning-border); }
  }

  @media (max-width: 600px) {
    .score-body { flex-direction: column; }
    .sub-label { width: 110px; }
  }
`;
