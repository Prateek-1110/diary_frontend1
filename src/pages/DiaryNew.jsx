import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { createDiaryEntry } from '../api/diary'
import DiaryEditor from '../components/diary/DiaryEditor'
import Layout from '../components/Layout'
import './DiaryNew.css'

export default function DiaryNew() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  async function handleSave(data) {
    setLoading(true)
    try {
      const res = await createDiaryEntry(data)
      navigate(`/diary/${res.data.id}`)
    } catch (err) {
      alert('Failed to save. Check console.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Layout>
      <div className="diary-new-page">
        <div className="diary-new-header">
          <button
            className="diary-new-back"
            onClick={() => navigate('/diary')}
            aria-label="Back to diary"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M10 12L6 8l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            All entries
          </button>

          <div className="diary-new-title-block">
            <p className="diary-new-eyebrow">New entry</p>
            <h1 className="diary-new-title">What's on your mind?</h1>
          </div>
        </div>

        <div className="diary-new-editor-wrap">
          <DiaryEditor
            onSave={handleSave}
            onCancel={() => navigate('/diary')}
            loading={loading}
          />
        </div>

        {loading && (
          <div className="diary-new-saving" aria-live="polite">
            <span className="diary-new-saving-dot" />
            <span className="diary-new-saving-dot" />
            <span className="diary-new-saving-dot" />
            <span className="diary-new-saving-label">Saving your entry…</span>
          </div>
        )}
      </div>
    </Layout>
  )
}
