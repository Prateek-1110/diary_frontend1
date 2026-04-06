import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getDiaryEntry, updateDiaryEntry, deleteDiaryEntry } from '../api/diary'
import DiaryEditor from '../components/diary/DiaryEditor'
import usePrefsStore from '../store/prefsStore'
import Layout from '../components/Layout'
import './DiaryDetail.css'

export default function DiaryDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { theme: globalTheme, font: globalFont } = usePrefsStore()
  const [entry, setEntry] = useState(null)
  const [editing, setEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    getDiaryEntry(id).then(res => setEntry(res.data)).catch(() => navigate('/diary'))
  }, [id])

  async function handleSave(data) {
    setLoading(true)
    try {
      const res = await updateDiaryEntry(id, data)
      setEntry(res.data)
      setEditing(false)
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete() {
    await deleteDiaryEntry(id)
    navigate('/diary')
  }

  if (!entry) return (
    <Layout>
      <p className="detail-loading">Loading…</p>
    </Layout>
  )

  const activeTheme = entry.theme_override || globalTheme || 'default'
  const activeFont = entry.font_override || globalFont || 'DM Sans, sans-serif'

  if (editing) {
    return (
      <Layout>
        <DiaryEditor initial={entry} onSave={handleSave} onCancel={() => setEditing(false)} loading={loading} />
      </Layout>
    )
  }

  const formattedDate = new Date(entry.written_at).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <Layout>
      <div className="detail-page" data-theme={activeTheme}>
        {/* Back nav */}
        <button className="detail-back" onClick={() => navigate('/diary')}>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Back to diary
        </button>

        {/* Entry header */}
        <div className="detail-header">
          <div className="detail-meta">
            <span className="detail-date">{formattedDate}</span>
            {entry.mood && <span className="detail-sep">·</span>}
            {entry.mood && <span className="detail-mood">{entry.mood}</span>}
            <span className="detail-sep">·</span>
            <span className="detail-visibility">{entry.visibility}</span>
          </div>
          <h1 className="detail-title" style={{ fontFamily: 'Lora, serif' }}>
            {entry.title || 'Untitled'}
          </h1>
        </div>

        {/* Body */}
        <div
          className="detail-body"
          style={{ fontFamily: activeFont }}
          dangerouslySetInnerHTML={{ __html: entry.body }}
        />

        {/* Actions */}
        <div className="detail-actions">
          <button className="detail-action-btn" onClick={() => setEditing(true)}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M9.5 2.5l2 2-7 7H2.5v-2l7-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"/>
            </svg>
            Edit
          </button>
          <button
            className={`detail-action-btn detail-action-btn--danger ${confirmDelete ? 'detail-action-btn--confirm' : ''}`}
            onClick={() => {
              if (confirmDelete) handleDelete()
              else setConfirmDelete(true)
            }}
            onBlur={() => setConfirmDelete(false)}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 4h10M5 4V2.5h4V4M5.5 6.5v4M8.5 6.5v4M3 4l.7 7.5h6.6L11 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {confirmDelete ? 'Tap again to confirm' : 'Delete'}
          </button>
        </div>
      </div>
    </Layout>
  )
}
