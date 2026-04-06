import { useEffect, useState } from 'react';
import { getCheckins, createCheckin, getTrend } from '../api/checkins';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import './Checkin.css';

const MOODS = [
  { key: 'happy',   label: 'Happy',   emoji: '😊', score: 5 },
  { key: 'calm',    label: 'Calm',    emoji: '😌', score: 4 },
  { key: 'confused',label: 'Confused',emoji: '😕', score: 3 },
  { key: 'anxious', label: 'Anxious', emoji: '😰', score: 2 },
  { key: 'sad',     label: 'Sad',     emoji: '😢', score: 2 },
  { key: 'angry',   label: 'Angry',   emoji: '😠', score: 1 },
];

export default function Checkin() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [note, setNote] = useState('');
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [trend, setTrend] = useState([]);
  const [loadingTrend, setLoadingTrend] = useState(true);
  const [groupBy, setGroupBy] = useState('week');

  useEffect(() => {
    getCheckins({ days: 1 }).then((res) => {
      const today = new Date().toDateString();
      const done = res.data.some((c) => new Date(c.checked_in_at).toDateString() === today);
      setAlreadyCheckedIn(done);
    });
  }, []);

  useEffect(() => {
    getTrend({ group_by: groupBy })
      .then((res) => setTrend(res.data))
      .finally(() => setLoadingTrend(false));
  }, [groupBy]);

  const handleSubmit = async () => {
    if (!selectedMood) return;
    setSubmitting(true);
    try {
      await createCheckin({ mood: selectedMood.key, score: selectedMood.score, note });
      setAlreadyCheckedIn(true);
      getTrend({ group_by: groupBy }).then((res) => setTrend(res.data));
    } catch (e) {
      if (e.response?.status === 400) setAlreadyCheckedIn(true);
    } finally {
      setSubmitting(false);
    }
  };

  const formatPeriod = (iso) => {
    const d = new Date(iso);
    return groupBy === 'week'
      ? `W${Math.ceil(d.getDate() / 7)} ${d.toLocaleString('default', { month: 'short' })}`
      : d.toLocaleString('default', { month: 'short', year: '2-digit' });
  };

  const chartData = trend.map((t) => ({
    period: formatPeriod(t.period),
    avg_score: t.avg_score,
    dominant: t.dominant_mood,
  }));

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <Layout>
      <div className="checkin-page">
        <div className="checkin-header">
          <p className="checkin-date">{today}</p>
          <h1 className="checkin-title">How are you feeling?</h1>
        </div>

        {alreadyCheckedIn ? (
          <div className="checkin-done-banner">
            <span className="checkin-done-icon">✓</span>
            <span>You've already checked in today. See you tomorrow.</span>
          </div>
        ) : (
          <div className="checkin-form">
            <div className="mood-grid">
              {MOODS.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setSelectedMood(selectedMood?.key === m.key ? null : m)}
                  className={`mood-pill ${selectedMood?.key === m.key ? 'mood-pill--active' : ''}`}
                >
                  <span className="mood-emoji">{m.emoji}</span>
                  <span className="mood-label">{m.label}</span>
                </button>
              ))}
            </div>

            <div className="checkin-note-wrap">
              <textarea
                className="checkin-note"
                placeholder="Add a note… what's on your mind? (optional)"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
              />
            </div>

            <button
              className="checkin-submit"
              onClick={handleSubmit}
              disabled={!selectedMood || submitting}
            >
              {submitting ? 'Saving…' : 'Check in'}
            </button>
          </div>
        )}

        <div className="checkin-trend">
          <div className="trend-header">
            <h2 className="trend-title">Mood over time</h2>
            <div className="trend-toggle">
              <button
                className={`trend-btn ${groupBy === 'week' ? 'trend-btn--active' : ''}`}
                onClick={() => setGroupBy('week')}
              >Week</button>
              <button
                className={`trend-btn ${groupBy === 'month' ? 'trend-btn--active' : ''}`}
                onClick={() => setGroupBy('month')}
              >Month</button>
            </div>
          </div>

          {loadingTrend ? (
            <p className="trend-empty">Loading…</p>
          ) : chartData.length < 2 ? (
            <p className="trend-empty">Not enough data yet — check in a few more times.</p>
          ) : (
            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={chartData} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="period" tick={{ fontSize: 11, fill: 'var(--muted)', fontFamily: 'DM Sans' }} />
                  <YAxis domain={[1, 5]} ticks={[1, 2, 3, 4, 5]} tick={{ fontSize: 11, fill: 'var(--muted)', fontFamily: 'DM Sans' }} />
                  <Tooltip
                    contentStyle={{ fontFamily: 'DM Sans', fontSize: 13, border: '1px solid var(--border)', borderRadius: 8 }}
                    formatter={(val, _, props) => [`${val} — ${props.payload.dominant || ''}`, 'Avg score']}
                  />
                  <Line
                    type="monotone"
                    dataKey="avg_score"
                    stroke="var(--accent)"
                    strokeWidth={2}
                    dot={{ r: 4, fill: 'var(--accent)', strokeWidth: 0 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
