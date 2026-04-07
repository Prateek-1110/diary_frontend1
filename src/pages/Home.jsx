import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import client from '../api/client'
import Layout from '../components/Layout'
import './Home.css'

function greeting() {
  const h = new Date().getHours()
  if (h < 5)  return 'Still up?'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

function formatDate() {
  return new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}

export default function Home() {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  const [memories, setMemories] = useState([])
  const [recentEntry, setRecentEntry] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      client.get('/diary/memory/').catch(() => ({ data: [] })),
      client.get('/diary/?limit=1').catch(() => ({ data: { results: [] } })),
    ]).then(([mem, recent]) => {
      setMemories(mem.data?.results || mem.data || [])
      const entries = recent.data?.results || recent.data || []
      setRecentEntry(entries[0] || null)
    }).finally(() => setLoading(false))
  }, [])

  const QUICK = [
    { label: 'New diary entry', sub: 'Write something today', to: '/diary/new', accent: true },
    { label: 'Letters',         sub: 'Time-locked messages',  to: '/letters' },
    { label: 'Check in',        sub: 'How are you feeling?',  to: '/checkin' },
    { label: 'Timeline',        sub: 'Your story so far',     to: '/timeline' },
  ]

  return (
    <Layout>
      <div className="home">
        {/* Header */}
        <div className="home-header">
          <p className="home-date">{formatDate()}</p>
          <h1 className="home-greeting">
            {greeting()}, {user?.display_name || user?.username}.
          </h1>
        </div>

        <div className="home-grid">
          {/* Quick nav */}
          <section className="home-section">
            <h2 className="section-label">Go to</h2>
            <div className="quick-links">
              {QUICK.map(({ label, sub, to, accent }) => (
                <button
                  key={to}
                  className={`quick-card${accent ? ' quick-card--accent' : ''}`}
                  onClick={() => navigate(to)}
                >
                  <span className="quick-label">{label}</span>
                  <span className="quick-sub">{sub}</span>
                </button>
              ))}
            </div>
          </section>

          {/* Right column */}
          <div className="home-right">

            {/* Memory replay */}
            {!loading && memories.length > 0 && (
              <section className="home-section">
                <h2 className="section-label">This day, past years</h2>
                <div className="memory-list">
                  {memories.map((m) => (
                    <button
                      key={m.id}
                      className="memory-card"
                      onClick={() => navigate(`/diary/${m.id}`)}
                    >
                      <span className="memory-year">
                        {new Date(m.written_at).getFullYear()}
                      </span>
                      <div className="memory-body">
                        <span className="memory-title">{m.title || 'Untitled'}</span>
                        {m.mood && <span className="mood-tag">{m.mood}</span>}
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            )}

            {/* Last diary entry */}
            {!loading && recentEntry && (
              <section className="home-section">
                <h2 className="section-label">Last entry</h2>
                <button
                  className="last-entry-card card"
                  onClick={() => navigate(`/diary/${recentEntry.id}`)}
                >
                  <div className="last-entry-meta">
                    <span className="last-entry-date">
                      {new Date(recentEntry.written_at).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric',
                      })}
                    </span>
                    {recentEntry.mood && (
                      <span className="mood-tag">{recentEntry.mood}</span>
                    )}
                  </div>
                  <p className="last-entry-title">
                    {recentEntry.title || 'Untitled'}
                  </p>
                </button>
              </section>
            )}

          </div>
        </div>
      </div>
    </Layout>
  )
}
