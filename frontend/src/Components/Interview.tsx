import React, { useEffect, useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import useClipboard from "react-use-clipboard";
import styled from "styled-components";
import axios from "axios";
import { useSearchParams } from "react-router-dom";
import { Loader } from "./Loader ";
import { CodeDisplay } from "./CodeDisplay";
import { ReadinessScore } from "./ReadinessScore";
import { getQuestions, QuestionItem } from "../data/questions";

interface MLResult {
  readinessScore: number;
  subjectMatterExpertise: number;
  communicationSkills: number;
  readinessLevel: string;
  feedback: string;
  strengths: string[];
  improvements: string[];
}

export const Interview = () => {
  const { transcript, browserSupportsSpeechRecognition, resetTranscript } = useSpeechRecognition();
  const [text, setText] = useState("");
  const [isCopied, setCopied] = useClipboard(text);
  const [isLoading, setIsLoading] = useState(false);
  const [showFeed, setShowFeed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [searchParams] = useSearchParams();
  const techStack = searchParams.get("tectStack");
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [mlResult, setMlResult] = useState<MLResult | null>(null);
  const [mlError, setMlError] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [manualAnswer, setManualAnswer] = useState("");

  const activeAnswer = transcript || manualAnswer;

  useEffect(() => {
    // Load questions instantly from local data — no network call needed
    setQuestions(getQuestions(techStack));
  }, [techStack]);

  const handleStart = () => {
    setIsListening(true);
    SpeechRecognition.startListening({ continuous: true, language: "en-IN" });
  };

  const handleStop = () => {
    setIsListening(false);
    SpeechRecognition.stopListening();
  };

  const handleClear = () => { resetTranscript(); setManualAnswer(""); };

  const handleNextQuestion = () => {
    setShowFeed(false); setMlResult(null); setMlError(null);
    resetTranscript(); setManualAnswer("");
    setCurrentIndex(prev => (prev === questions.length - 1 ? 0 : prev + 1));
    window.speechSynthesis.cancel();
  };

  const handlePrevious = () => {
    setShowFeed(false); setMlResult(null); setMlError(null);
    resetTranscript(); setManualAnswer("");
    setCurrentIndex(prev => (prev === 0 ? questions.length - 1 : prev - 1));
    window.speechSynthesis.cancel();
  };

  const handleSubmit = () => {
    const answer = activeAnswer.trim();
    if (!answer) { alert("Please provide an answer before submitting."); return; }
    setShowFeed(true); setIsLoading(true); setMlError(null); handleStop();

    const body = { question: questions[currentIndex]?.question || "", answer, techStack };

    axios.post("http://localhost:5000/predict", body)
      .then(res => { setMlResult(res.data); setIsLoading(false); })
      .catch(() => {
        axios.post("http://localhost:5000/feedback", body)
          .then(res => {
            setMlResult({
              readinessScore: res.data.readinessScore || 50,
              subjectMatterExpertise: res.data.subjectMatterExpertise || 5,
              communicationSkills: res.data.communicationSkills || 5,
              readinessLevel: res.data.readinessLevel || "Developing",
              feedback: res.data.feedback || "",
              strengths: [], improvements: [],
            });
            setIsLoading(false);
          })
          .catch(() => {
            setIsLoading(false);
            setMlError("⚠️ Could not reach the ML backend (localhost:5000). Make sure the Python server is running: cd ml-backend && python app.py");
          });
      });
  };

  // Detect if the answer text is actually code (not just prose containing keywords)
  const looksLikeCode = (t: string) => {
    // Must have code-specific patterns, not just English words like 'function'
    const codePatterns = [
      /[{};].*[{};]/s,           // multiple braces/semicolons
      /```[\s\S]+```/,           // backtick code fence
      /=>\s*[{(]/,               // arrow function with body
      /\bfunction\s+\w+\s*\(/,   // named function declaration
      /\bconst\s+\w+\s*=/,       // const assignment
      /\bimport\s+.*\bfrom\b/,   // ES import
      /public\s+(class|static|void)/,  // Java keywords
      /\bdef\s+\w+\s*\(/,        // Python def
    ];
    return codePatterns.some(p => p.test(t));
  };

  const detectLanguage = (t: string) => {
    if (t.includes("public class") || t.includes("import java")) return "java";
    if (/\bdef\s+\w+/.test(t)) return "python";
    return "javascript";
  };

  const extractCodeBlocks = (q: string) => {
    const re = /```([\s\S]*?)```/g;
    const blocks: string[] = [];
    let m;
    while ((m = re.exec(q)) !== null) blocks.push(m[1].trim());
    return blocks;
  };

  const renderQuestion = (q: string) => {
    const clean = q.replace(/```[\s\S]*?```/g, "").trim();
    const code = extractCodeBlocks(q);
    return (
      <div>
        <p className="q-text">{currentIndex + 1}. {clean}</p>
        {code.map((c, i) => <CodeDisplay key={i} code={c} language={detectLanguage(c)} title={`Code Example ${i + 1}`} />)}
      </div>
    );
  };

  if (!browserSupportsSpeechRecognition) {
    return (
      <WRAP>
        <div className="error-msg">
          ⚠️ Your browser doesn't support speech recognition. Please type your answers instead.
        </div>
      </WRAP>
    );
  }

  return (
    <WRAP>
      {/* Header */}
      <div className="interview-header">
        <div className="header-left">
          <span className="domain-pill">{(techStack || 'GENERAL').toUpperCase()}</span>
          <span className="q-counter">Question {currentIndex + 1} of {questions.length || '—'}</span>
        </div>
        {questions.length > 0 && (
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }} />
          </div>
        )}
      </div>

      {showFeed ? (
        <div className="feedback-view">

          {/* ML Score card — always full width on top */}
          <div className="result-panel">
            {isLoading ? (
              <div className="loader-wrap"><Loader /></div>
            ) : mlError ? (
              <div className="ml-error">{mlError}</div>
            ) : mlResult ? (
              <ReadinessScore score={mlResult.readinessScore} level={mlResult.readinessLevel}
                subjectScore={mlResult.subjectMatterExpertise} communicationScore={mlResult.communicationSkills}
                strengths={mlResult.strengths} improvements={mlResult.improvements} />
            ) : null}
          </div>

          {/* User's answer — always below the score */}
          <div className="answer-panel">
            <h3 className="panel-title">Your Answer</h3>
            {looksLikeCode(activeAnswer) ? (
              <CodeDisplay code={activeAnswer} language={detectLanguage(activeAnswer)} title="Your Code" />
            ) : (
              <p className="answer-text">{activeAnswer || <em className="empty">No answer recorded.</em>}</p>
            )}
          </div>

          {/* Detailed feedback text — always at the bottom */}
          {!isLoading && mlResult && (
            <div className="feedback-text-box">
              <h3 className="panel-title">📝 Detailed Feedback</h3>
              <p>{mlResult.feedback}</p>
            </div>
          )}

          {!isLoading && (
            <div className="nav-btns">
              <button className="nav-btn outline" onClick={handlePrevious}>← Previous</button>
              <button className="nav-btn primary" onClick={handleNextQuestion}>Next Question →</button>
            </div>
          )}
        </div>
      ) : (
        <div className="question-view">
          <div className="question-box">
            {questions.length > 0
              ? renderQuestion(questions[currentIndex].question)
              : <p className="loading-q">Loading questions…</p>
            }
            <div className="caution">
              ⚠️ Do not refresh or use browser navigation — your progress will be lost.
            </div>
          </div>

          <div className="answer-section">
            <div className="answer-label-row">
              <span className="answer-label">Your Answer</span>
              {isListening && (
                <span className="listening-dot"><span />Recording…</span>
              )}
            </div>

            {transcript ? (
              <div className="speech-box" onClick={() => setText(transcript)}>{transcript}</div>
            ) : (
              <textarea
                className="answer-textarea"
                placeholder="Type your answer here, or click 'Start' to speak…"
                value={manualAnswer}
                onChange={e => setManualAnswer(e.target.value)}
                rows={6}
              />
            )}
          </div>

          <div className="controls">
            <div className="controls-left">
              <button className="ctrl-btn copy" onClick={setCopied}>{isCopied ? "✓ Copied" : "Copy"}</button>
            </div>
            <div className="controls-right">
              <button className={`ctrl-btn ${isListening ? 'recording' : ''}`} onClick={handleStart}>🎙 Start</button>
              <button className="ctrl-btn danger" onClick={handleStop}>⏹ Stop</button>
              <button className="ctrl-btn" onClick={handleClear}>🗑 Clear</button>
              <button className="ctrl-btn submit" onClick={handleSubmit}>Submit →</button>
            </div>
          </div>
        </div>
      )}
    </WRAP>
  );
};

const WRAP = styled.div`
  min-height: 80vh;
  background: var(--bg);
  transition: background 0.3s ease;

  .error-msg {
    max-width: 600px; margin: 80px auto; padding: 20px;
    background: var(--danger-bg); border: 1px solid var(--danger-border);
    border-radius: 12px; color: var(--danger); text-align: center;
  }

  .interview-header {
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    padding: 16px 40px;
    display: flex; flex-direction: column; gap: 10px;
    transition: background 0.3s ease;
  }

  .header-left { display: flex; align-items: center; gap: 14px; }

  .domain-pill {
    padding: 4px 12px; border-radius: 8px;
    background: var(--accent-light); color: var(--accent);
    font-size: 11px; font-weight: 700; letter-spacing: 0.08em;
    border: 1px solid var(--border-hover);
  }

  .q-counter { font-size: 14px; color: var(--text-3); font-weight: 500; }

  .progress-bar-wrap { height: 3px; background: var(--border); border-radius: 99px; overflow: hidden; }
  .progress-bar-fill {
    height: 100%; background: var(--gradient); border-radius: 99px; transition: width 0.4s ease;
  }

  /* Question View */
  .question-view {
    max-width: 900px; margin: 0 auto;
    padding: 36px 28px 60px;
    display: flex; flex-direction: column; gap: 24px;
  }

  .question-box {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 16px; padding: 28px;
    display: flex; flex-direction: column; gap: 16px;
    box-shadow: var(--shadow);
  }

  .q-text { font-size: 18px; font-weight: 600; color: var(--text-1); line-height: 1.6; }
  .loading-q { color: var(--text-3); font-size: 15px; }

  .caution {
    font-size: 13px; padding: 10px 14px; border-radius: 10px;
    background: var(--danger-bg); color: var(--danger); border: 1px solid var(--danger-border);
  }

  .answer-section { display: flex; flex-direction: column; gap: 10px; }

  .answer-label-row { display: flex; align-items: center; gap: 12px; }

  .answer-label {
    font-size: 13px; font-weight: 600; color: var(--text-3);
    text-transform: uppercase; letter-spacing: 0.08em;
  }

  .listening-dot {
    display: flex; align-items: center; gap: 6px;
    font-size: 12px; color: var(--listening-color); font-weight: 500;
    span { width: 8px; height: 8px; border-radius: 50%; background: var(--listening-color); animation: blink 1s infinite; }
  }

  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0.2} }

  .speech-box {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 12px; padding: 18px 20px; min-height: 140px;
    font-size: 15px; color: var(--text-1); line-height: 1.7; cursor: pointer;
    transition: border-color 0.2s;
    &:hover { border-color: var(--border-hover); }
  }

  .answer-textarea {
    width: 100%; background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 12px; padding: 18px 20px;
    font-size: 15px; color: var(--text-1); font-family: 'Inter', sans-serif;
    line-height: 1.7; resize: vertical; outline: none;
    transition: border-color 0.2s, background 0.3s;
    &::placeholder { color: var(--text-3); }
    &:focus { border-color: var(--border-hover); box-shadow: 0 0 0 3px var(--accent-light); }
  }

  .controls {
    display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;
  }

  .controls-right { display: flex; gap: 8px; flex-wrap: wrap; }

  .ctrl-btn {
    padding: 10px 18px; border-radius: 9px; font-size: 13px; font-weight: 600;
    border: 1px solid var(--border); background: var(--bg-card); color: var(--text-2);
    cursor: pointer; transition: all 0.2s ease;
    &:hover { background: var(--bg-surface); color: var(--text-1); border-color: var(--border-hover); }
    &.recording { background: var(--danger-bg); color: var(--danger); border-color: var(--danger-border); }
    &.danger { background: var(--danger-bg); color: var(--danger); border-color: var(--danger-border);
      &:hover { background: var(--danger-bg); opacity: 0.8; } }
    &.copy { background: var(--success-bg); color: var(--success); border-color: var(--success-border);
      &:hover { opacity: 0.85; } }
    &.submit {
      background: var(--gradient); color: white; border: none;
      box-shadow: var(--shadow-glow); padding: 10px 24px;
      &:hover { box-shadow: 0 0 35px var(--accent-glow); transform: translateY(-1px); }
    }
  }

  /* Feedback View — fixed single-column layout */
  .feedback-view {
    max-width: 860px; margin: 0 auto; padding: 36px 28px 60px;
    display: flex; flex-direction: column; gap: 20px;
  }

  .result-panel {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 18px; padding: 24px; box-shadow: var(--shadow);
    transition: background 0.3s ease;
    width: 100%;
  }

  .answer-panel {
    background: var(--bg-card); border: 1px solid var(--border);
    border-radius: 18px; padding: 24px; box-shadow: var(--shadow);
    transition: background 0.3s ease;
    width: 100%;
  }

  .panel-title {
    font-size: 13px; font-weight: 700; color: var(--text-3);
    text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;
  }

  .answer-text { font-size: 15px; color: var(--text-1); line-height: 1.75; }
  .empty { color: var(--text-3); font-style: italic; }

  .loader-wrap { display: flex; justify-content: center; align-items: center; min-height: 180px; }

  .ml-error {
    padding: 20px 24px; border-radius: 12px;
    background: var(--danger-bg); color: var(--danger);
    border: 1px solid var(--danger-border);
    font-size: 14px; line-height: 1.6;
  }

  .feedback-text-box {
    background: var(--bg-surface); border: 1px solid var(--border);
    border-radius: 14px; padding: 20px 24px;
    font-size: 14px; color: var(--text-2); line-height: 1.75;
    transition: background 0.3s ease;
  }

  .nav-btns { display: flex; gap: 12px; justify-content: flex-end; }

  .nav-btn {
    padding: 12px 24px; border-radius: 10px; font-size: 14px; font-weight: 600;
    cursor: pointer; transition: all 0.25s ease;
    &.outline {
      background: transparent; border: 1px solid var(--border); color: var(--text-2);
      &:hover { border-color: var(--border-hover); color: var(--text-1); background: var(--accent-light); }
    }
    &.primary {
      background: var(--gradient); border: none; color: white;
      box-shadow: var(--shadow-glow);
      &:hover { box-shadow: 0 0 35px var(--accent-glow); transform: translateY(-1px); }
    }
  }

  @media (max-width: 768px) {
    .interview-header { padding: 16px; }
    .question-view, .feedback-view { padding: 24px 16px 48px; }
    .feedback-grid { grid-template-columns: 1fr; }
    .controls { flex-direction: column; align-items: flex-start; }
    .nav-btns { justify-content: center; }
  }
`;
