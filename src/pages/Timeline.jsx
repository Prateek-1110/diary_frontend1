import { useEffect, useState } from 'react'
import { getTimeline, createTimelineEvent } from '../api/timeline'
import Layout from '../components/Layout'
import './Timeline.css'

export default function Timeline() {
  const [events, setEvents] = useState([])
  const [label, setLabel] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [isMilestone, setIsMilestone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getTimeline()
      .then(res => setEvents(res.data))
      .finally(() => setLoading(false))
  }, [])

  const handleAdd = async () => {
    if (!label || !eventDate) return
    const res = await createTimelineEvent({ label, event_date: eventDate, is_milestone: isMilestone })
    setEvents(prev => [...prev, res.data].sort((a, b) => new Date(a.event_date) - new Date(b.event_date)))
    setLabel('')
    setEventDate('')
    setIsMilestone(false)
  }

  if (loading) return (
    <Layout>
      <div className="timeline-root">
        <p className="timeline-loading">Loading…</p>
      </div>
    </Layout>
  )

  return (
    <Layout>
      <div className="timeline-root">
        <header className="timeline-header">
          <h1 className="timeline-title">Timeline</h1>
          <p className="timeline-sub">A record of everything that matters</p>
        </header>

        {/* Add event */}
        <div className="timeline-add-card">
          <div className="timeline-add-row">
            <input
              placeholder="What happened?"
              value={label}
              onChange={e => setLabel(e.target.value)}
              className="timeline-input timeline-input--label"
            />
            <input
              type="date"
              value={eventDate}
              onChange={e => setEventDate(e.target.value)}
              className="timeline-input timeline-input--date"
            />
          </div>
          <div className="timeline-add-footer">
            <label className="timeline-milestone-toggle">
              <input
                type="checkbox"
                checked={isMilestone}
                onChange={e => setIsMilestone(e.target.checked)}
                className="timeline-checkbox"
              />
              <span className="timeline-milestone-label">Mark as milestone</span>
            </label>
            <button
              onClick={handleAdd}
              disabled={!label || !eventDate}
              className="timeline-add-btn"
            >
              Add event
            </button>
          </div>
        </div>

        {/* Events */}
        <div className="timeline-list">
          {events.length === 0 && (
            <p className="timeline-empty">No events yet. Add your first one above.</p>
          )}
          {events.map((event, i) => (
            <div key={event.id} className={`timeline-event ${event.is_milestone ? 'is-milestone' : ''}`}>
              <div className="timeline-event-spine">
                <div className="timeline-event-dot" />
                {i < events.length - 1 && <div className="timeline-event-line" />}
              </div>
              <div className="timeline-event-content">
                <p className="timeline-event-meta">
                  {event.event_date}
                  {event.source && <> · <span>{event.source}</span></>}
                </p>
                <p className="timeline-event-label">{event.label}</p>
                {event.is_milestone && (
                  <span className="timeline-milestone-badge">Milestone</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  )
}
