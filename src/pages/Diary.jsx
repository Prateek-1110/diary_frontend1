import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getDiaryEntries } from '../api/diary'
import EntryCard from '../components/diary/EntryCard'
import MemoryReplay from '../components/diary/MemoryReplay'
import Layout from '../components/Layout'
import './Diary.css'

const MOODS = ['', 'happy', 'sad', 'angry', 'anxious', 'confused', 'calm']

export default function Diary() {
  const navigate = useNavigate()
  const [entries, setEntries] = useState([])
  const [filters, setFilters] = useState({ mood: '', visibility: '', date_from: '', date_to: '' })
  const [loading, setLoading] = useState(true)
  const [filtersOpen, setFiltersOpen] = useState(false)

  useEffect(() => {
    setLoading(true)
    const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''))
    getDiaryEntries(params)
      .then(res => setEntries(res.data))
      .finally(() => setLoading(false))
  }, [filters])

  const activeFilterCount = Object.values(filters).filter(v => v !== '').length

  return (
    <Layout>
      <div className="diary-page">
        {/* Header */}
        <div className="diary-header">
          <div className="diary-header-left">
            <p className="diary-eyebrow">Your journal</p>
            <h1 className="diary-title">Diary</h1>
          </div>
          <button className="diary-new-btn" onClick={() => navigate('/diary/new')}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 1v12M1 7h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
            New entry
          </button>
        </div>

        {/* Memory replay */}
        <MemoryReplay />

        {/* Filter bar */}
        <div className="diary-filter-bar">
          <button
            className={`filter-toggle ${filtersOpen ? 'filter-toggle--open' : ''}`}
            onClick={() => setFiltersOpen(o => !o)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 3h12M3 7h8M5 11h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            Filters
            {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
          </button>

          {activeFilterCount > 0 && (
            <button
              className="filter-clear"
              onClick={() => setFilters({ mood: '', visibility: '', date_from: '', date_to: '' })}
            >
              Clear all
            </button>
          )}
        </div>

        {filtersOpen && (
          <div className="diary-filters">
            <div className="filter-row">
              <label className="filter-label">Mood</label>
              <select
                className="filter-select"
                value={filters.mood}
                onChange={e => setFilters(f => ({ ...f, mood: e.target.value }))}
              >
                {MOODS.map(m => (
                  <option key={m} value={m}>{m || 'All moods'}</option>
                ))}
              </select>
            </div>

            <div className="filter-row">
              <label className="filter-label">Visibility</label>
              <select
                className="filter-select"
                value={filters.visibility}
                onChange={e => setFilters(f => ({ ...f, visibility: e.target.value }))}
              >
                <option value="">All</option>
                <option value="private">Private</option>
                <option value="shared">Shared</option>
              </select>
            </div>

            <div className="filter-row">
              <label className="filter-label">From</label>
              <input
                type="date"
                className="filter-select"
                value={filters.date_from}
                onChange={e => setFilters(f => ({ ...f, date_from: e.target.value }))}
              />
            </div>

            <div className="filter-row">
              <label className="filter-label">To</label>
              <input
                type="date"
                className="filter-select"
                value={filters.date_to}
                onChange={e => setFilters(f => ({ ...f, date_to: e.target.value }))}
              />
            </div>
          </div>
        )}

        {/* Entries */}
        <div className="diary-entries">
          {loading && <p className="diary-state-msg">Loading…</p>}
          {!loading && entries.length === 0 && (
            <div className="diary-empty">
              <p className="diary-empty-title">Nothing here yet.</p>
              <p className="diary-empty-sub">Start writing — your first entry is waiting.</p>
            </div>
          )}
          {entries.map(entry => <EntryCard key={entry.id} entry={entry} />)}
        </div>
      </div>
    </Layout>
  )
}
