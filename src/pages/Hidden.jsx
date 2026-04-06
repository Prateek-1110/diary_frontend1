import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import client from '../api/client'
import './Hidden.css'

export default function Hidden() {
  const { slug } = useParams()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get(`/s/${slug}/`)
      .then(res => setItems(res.data))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) {
    return (
      <div className="hidden-loading">
        <div className="hidden-loading-inner">
          <span className="hidden-loading-dot" />
          <span className="hidden-loading-dot" />
          <span className="hidden-loading-dot" />
        </div>
      </div>
    )
  }

  if (!items.length) {
    return (
      <div className="hidden-empty">
        <p className="hidden-empty-label">Nothing here yet.</p>
      </div>
    )
  }

  return (
    <div className="hidden-page">
      <header className="hidden-header">
        <span className="hidden-brand">ours</span>
        <p className="hidden-subtitle">A little something, just for you.</p>
      </header>

      <div className="hidden-grid">
        {items.map((item, i) => (
          <article
            className="hidden-item"
            key={item.id}
            style={{ animationDelay: `${i * 0.07}s` }}
          >
            {item.media_type === 'image' && (
              <div className="hidden-image-wrap">
                <img
                  src={item.file_url}
                  alt={item.caption || ''}
                  className="hidden-image"
                  loading="lazy"
                />
              </div>
            )}

            {item.media_type === 'audio' && (
              <div className="hidden-audio-wrap">
                <div className="hidden-audio-icon" aria-hidden="true">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M10 8.5l6 3.5-6 3.5V8.5z" fill="currentColor"/>
                  </svg>
                </div>
                <audio controls src={item.file_url} className="hidden-audio" />
              </div>
            )}

            {item.caption && (
              <p className="hidden-caption">{item.caption}</p>
            )}
          </article>
        ))}
      </div>

      <footer className="hidden-footer">
        <span className="hidden-footer-mark">ours</span>
      </footer>
    </div>
  )
}
