import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getLetters } from '../api/letters';
import Layout from '../components/Layout';
import './Letters.css';

function useCountdown(unlocks_at) {
  const [seconds, setSeconds] = useState(() => {
    const delta = new Date(unlocks_at) - Date.now();
    return Math.max(0, Math.floor(delta / 1000));
  });

  useEffect(() => {
    if (seconds <= 0) return;
    const interval = setInterval(() => {
      setSeconds((s) => {
        if (s <= 1) { clearInterval(interval); return 0; }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return seconds;
}

function formatCountdown(seconds) {
  const d = Math.floor(seconds / 86400);
  const h = Math.floor((seconds % 86400) / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (d > 0) return `${d}d ${h}h ${m}m`;
  if (h > 0) return `${h}h ${m}m ${s}s`;
  return `${m}m ${s}s`;
}

function LetterCard({ letter, onClick, index }) {
  const countdown = useCountdown(letter.unlocks_at);
  const isLocked = countdown > 0;

  return (
    <div
      className={`letter-card ${isLocked ? 'letter-card--locked' : 'letter-card--unlocked'}`}
      onClick={() => !isLocked && onClick(letter.id)}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className="letter-card__seal">
        {isLocked ? '✦' : '✉'}
      </div>
      <div className="letter-card__body">
        <strong className="letter-card__subject">{letter.subject}</strong>
        <span className="letter-card__date">
          {new Date(letter.unlocks_at).toLocaleDateString('en-US', {
            month: 'long', day: 'numeric', year: 'numeric'
          })}
        </span>
      </div>
      <div className="letter-card__status">
        {isLocked ? (
          <span className="letter-card__countdown">
            <span className="letter-card__lock-icon">🔒</span>
            {formatCountdown(countdown)}
          </span>
        ) : (
          <span className="letter-card__open-label">Open →</span>
        )}
      </div>
    </div>
  );
}

export default function Letters() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    getLetters()
      .then((res) => setLetters(res.data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Layout>
      <div className="letters-page">
        <header className="letters-header">
          <div className="letters-header__text">
            <p className="letters-header__eyebrow">sealed & waiting</p>
            <h1 className="letters-header__title">Letters</h1>
          </div>
          <button className="letters-compose-btn" onClick={() => navigate('/letters/new')}>
            + Write a letter
          </button>
        </header>

        <div className="letters-rule" />

        {loading ? (
          <p className="letters-empty">Loading…</p>
        ) : letters.length === 0 ? (
          <div className="letters-empty-state">
            <span className="letters-empty-state__icon">✦</span>
            <p>No letters yet. Write one to your future self.</p>
          </div>
        ) : (
          <div className="letters-list">
            {letters.map((l, i) => (
              <LetterCard
                key={l.id}
                letter={l}
                index={i}
                onClick={(id) => navigate(`/letters/${id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
