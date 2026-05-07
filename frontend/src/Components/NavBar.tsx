import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

interface NavBarProps {
  theme: string;
  onToggleTheme: () => void;
}

export const NavBar = ({ theme, onToggleTheme }: NavBarProps) => {
  const location = useLocation();

  return (
    <NAV>
      <div className="nav-inner">
        <Link className="brand" to="/">
          <div className="brand-icon">☕</div>
          <div className="brand-text">
            <span className="brand-name">SIRP</span>
            <span className="brand-sub">Interview Predictor</span>
          </div>
        </Link>

        <div className="nav-links">
          <Link className={`nav-link ${location.pathname === '/' ? 'active' : ''}`} to="/">Home</Link>
          <Link className={`nav-link ${location.pathname === '/interviews' ? 'active' : ''}`} to="/interviews">Practice</Link>
          <Link className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`} to="/about">About</Link>

          <button className="theme-toggle" onClick={onToggleTheme} title="Toggle theme" aria-label="Toggle light/dark mode">
            {theme === 'light' ? (
              <span>🌙</span>
            ) : (
              <span>☀️</span>
            )}
          </button>

          <Link className="nav-cta" to="/interviews">Start Free</Link>
        </div>
      </div>
    </NAV>
  );
};

const NAV = styled.nav`
  position: sticky;
  top: 0;
  z-index: 100;
  width: 100%;
  background: var(--nav-bg);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--nav-border);
  transition: background 0.3s ease, border-color 0.3s ease;

  .nav-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 28px;
    height: 68px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
    color: inherit;
  }

  .brand-icon {
    width: 40px; height: 40px;
    border-radius: 10px;
    background: var(--gradient);
    display: flex; align-items: center; justify-content: center;
    font-size: 20px;
    box-shadow: var(--shadow-glow);
    flex-shrink: 0;
    transition: background 0.3s ease;
  }

  .brand-text { display: flex; flex-direction: column; line-height: 1.1; }

  .brand-name {
    font-size: 16px; font-weight: 800;
    letter-spacing: 0.08em;
    background: var(--gradient-text);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    transition: background 0.3s ease;
  }

  .brand-sub { font-size: 10px; font-weight: 400; color: var(--text-3); letter-spacing: 0.04em; }

  .nav-links { display: flex; align-items: center; gap: 6px; }

  .nav-link {
    padding: 8px 16px;
    border-radius: 8px;
    font-size: 14px; font-weight: 500;
    color: var(--text-2);
    text-decoration: none;
    transition: all 0.2s ease;
    &:hover { color: var(--text-1); background: var(--accent-light); }
    &.active { color: var(--accent); background: var(--accent-light); font-weight: 600; }
  }

  .theme-toggle {
    width: 38px; height: 38px;
    border-radius: 9px;
    border: 1px solid var(--border);
    background: var(--bg-card);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    transition: all 0.2s ease;
    margin: 0 2px;
    &:hover { border-color: var(--border-hover); background: var(--bg-surface); transform: scale(1.05); }
  }

  .nav-cta {
    padding: 9px 20px;
    border-radius: 8px;
    font-size: 14px; font-weight: 600;
    color: white;
    background: var(--gradient);
    box-shadow: var(--shadow-glow);
    transition: all 0.25s ease;
    margin-left: 6px;
    &:hover { transform: translateY(-1px); box-shadow: 0 0 30px var(--accent-glow); }
  }

  @media (max-width: 768px) {
    .nav-inner { padding: 0 16px; }
    .brand-sub { display: none; }
    .nav-link { padding: 8px 10px; font-size: 13px; }
    .nav-cta { padding: 8px 14px; font-size: 13px; }
  }
`;
