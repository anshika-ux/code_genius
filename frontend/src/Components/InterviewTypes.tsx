import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const domains = [
  {
    id: 'mern', title: 'MERN Stack', emoji: '⚛️',
    desc: 'Full-stack web development with MongoDB, Express.js, React, and Node.js. APIs, state management, and database design.',
    difficulty: 'Intermediate', diffVar: '--warning',
    tags: ['MongoDB', 'React', 'Node.js', 'Express'],
    route: '/interview/mern?tectStack=mern',
  },
  {
    id: 'node', title: 'Node.js', emoji: '🟢',
    desc: 'Server-side JavaScript with event-driven async programming, REST APIs, middleware, and scalable backend architecture.',
    difficulty: 'Intermediate', diffVar: '--warning',
    tags: ['Event Loop', 'Async/Await', 'REST', 'Middleware'],
    route: '/interview/mern?tectStack=node',
  },
  {
    id: 'java', title: 'Java', emoji: '☕',
    desc: 'Core Java concepts: OOP, collections, multithreading, Spring Boot, and enterprise application development.',
    difficulty: 'Intermediate', diffVar: '--warning',
    tags: ['OOP', 'Spring Boot', 'Collections', 'JVM'],
    route: '/interview/mern?tectStack=java',
  },
  {
    id: 'python', title: 'Python', emoji: '🐍',
    desc: 'Python fundamentals, data structures, decorators, generators, Django/Flask, and data science essentials.',
    difficulty: 'Beginner', diffVar: '--success',
    tags: ['Data Structures', 'Flask', 'Django', 'OOP'],
    route: '/interview/mern?tectStack=python',
  },
  {
    id: 'dsa', title: 'DSA & Algorithms', emoji: '🔢',
    desc: 'Data structures, algorithm complexity, sorting, searching, trees, graphs, and dynamic programming patterns.',
    difficulty: 'Advanced', diffVar: '--danger',
    tags: ['Arrays', 'Trees', 'Graphs', 'Dynamic Programming'],
    route: '/interview/mern?tectStack=dsa',
  },
  {
    id: 'hr', title: 'HR & Behavioral', emoji: '🤝',
    desc: 'Behavioral questions using the STAR method, leadership, teamwork, conflict resolution, and situational scenarios.',
    difficulty: 'Beginner', diffVar: '--success',
    tags: ['STAR Method', 'Leadership', 'Teamwork', 'Communication'],
    route: '/interview/mern?tectStack=hr',
  },
];

export const InterviewTypes = () => (
  <PAGE>
    <div className="page-header">
      <div className="header-badge">Choose Your Domain</div>
      <h1 className="page-title">Select an Interview Domain</h1>
      <p className="page-sub">
        Pick a tech stack or topic and start practicing. Our ML model evaluates your answers
        and gives you a readiness score with detailed feedback.
      </p>
    </div>

    <div className="domains-grid">
      {domains.map(d => (
        <div className="domain-card" key={d.id}>
          <div className="card-top">
            <span className="domain-emoji">{d.emoji}</span>
            <span className="difficulty-badge" data-diff={d.id === 'dsa' ? 'hard' : d.id === 'python' || d.id === 'hr' ? 'easy' : 'mid'}>
              {d.difficulty}
            </span>
          </div>
          <h2 className="domain-title">{d.title}</h2>
          <p className="domain-desc">{d.desc}</p>
          <div className="tags-row">
            {d.tags.map(tag => <span className="tag" key={tag}>{tag}</span>)}
          </div>
          <Link to={d.route} className="start-btn">
            Start Interview <span>→</span>
          </Link>
        </div>
      ))}
    </div>
  </PAGE>
);

const PAGE = styled.div`
  min-height: 100vh;
  background: var(--bg);
  padding: 60px 28px 80px;
  max-width: 1200px;
  margin: 0 auto;
  transition: background 0.3s ease;

  .page-header { text-align: center; margin-bottom: 56px; }

  .header-badge {
    display: inline-block; padding: 5px 14px; border-radius: 999px;
    background: var(--accent-light); border: 1px solid var(--border-hover);
    color: var(--accent); font-size: 12px; font-weight: 600;
    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 18px;
  }

  .page-title {
    font-size: clamp(28px,4vw,42px); font-weight: 900; color: var(--text-1);
    margin-bottom: 16px; letter-spacing: -0.02em;
  }

  .page-sub { font-size: 16px; color: var(--text-2); max-width: 560px; margin: 0 auto; line-height: 1.7; }

  .domains-grid { display: grid; grid-template-columns: repeat(auto-fill,minmax(330px,1fr)); gap: 20px; }

  .domain-card {
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 18px; padding: 28px;
    display: flex; flex-direction: column; gap: 14px;
    transition: all 0.3s ease;
    box-shadow: var(--shadow);
    &:hover {
      border-color: var(--border-hover);
      box-shadow: var(--shadow-glow);
      transform: translateY(-4px);
    }
  }

  .card-top { display: flex; justify-content: space-between; align-items: center; }
  .domain-emoji { font-size: 32px; line-height: 1; }

  .difficulty-badge {
    padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.04em;
    &[data-diff="easy"] { background: var(--success-bg); color: var(--success); border: 1px solid var(--success-border); }
    &[data-diff="mid"]  { background: var(--warning-bg); color: var(--warning); border: 1px solid var(--warning-border); }
    &[data-diff="hard"] { background: var(--danger-bg);  color: var(--danger);  border: 1px solid var(--danger-border); }
  }

  .domain-title { font-size: 20px; font-weight: 800; color: var(--text-1); letter-spacing: -0.01em; }
  .domain-desc { font-size: 14px; color: var(--text-2); line-height: 1.65; flex: 1; }

  .tags-row { display: flex; flex-wrap: wrap; gap: 6px; }

  .tag {
    padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 500;
    background: var(--bg-surface); color: var(--text-2); border: 1px solid var(--border);
  }

  .start-btn {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    padding: 12px 20px; border-radius: 10px;
    background: var(--gradient); color: white;
    font-size: 14px; font-weight: 600;
    margin-top: 6px; transition: all 0.25s ease;
    box-shadow: var(--shadow-glow);
    &:hover { box-shadow: 0 0 35px var(--accent-glow); transform: translateY(-1px); }
  }

  @media (max-width: 700px) {
    padding: 40px 16px 60px;
    .domains-grid { grid-template-columns: 1fr; }
  }
`;
