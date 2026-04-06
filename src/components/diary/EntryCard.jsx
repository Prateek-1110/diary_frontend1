import { useNavigate } from 'react-router-dom'

const MOOD_EMOJI = {
  happy: '😊', sad: '😢', angry: '😠', anxious: '😰', confused: '😕', calm: '😌',
}

export default function EntryCard({ entry }) {
  const navigate = useNavigate()
  const date = new Date(entry.written_at).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  })

  // body is HTML from TipTap — strip tags for snippet
  const snippet = entry.body.replace(/<[^>]+>/g, '').slice(0, 120)

  return (
    <div
      onClick={() => navigate(`/diary/${entry.id}`)}
      style={{
        border: '1px solid #e0e0e0',
        borderRadius: '10px',
        padding: '16px',
        cursor: 'pointer',
        marginBottom: '12px',
        background: 'white',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
        <strong>{entry.title || 'Untitled'}</strong>
        <span style={{ fontSize: '12px', color: '#888' }}>{date}</span>
      </div>
      {entry.mood && (
        <span style={{ fontSize: '13px', color: '#555', marginBottom: '6px', display: 'block' }}>
          {MOOD_EMOJI[entry.mood]} {entry.mood}
        </span>
      )}
      <p style={{ fontSize: '14px', color: '#666', margin: 0 }}>{snippet}{snippet.length === 120 ? '…' : ''}</p>
    </div>
  )
}