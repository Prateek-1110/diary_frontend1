import { useEffect, useState } from 'react'
import { getMemoryReplay } from '../../api/diary'
import EntryCard from './EntryCard'

export default function MemoryReplay() {
  const [entries, setEntries] = useState([])

  useEffect(() => {
    getMemoryReplay().then(res => setEntries(res.data)).catch(() => {})
  }, [])

  if (!entries.length) return null

  return (
    <div style={{ marginBottom: '24px', padding: '16px', background: '#fafafa', borderRadius: '10px', border: '1px dashed #ccc' }}>
      <h3 style={{ margin: '0 0 12px 0', fontSize: '15px', color: '#555' }}>📅 On this day in the past</h3>
      {entries.map(entry => <EntryCard key={entry.id} entry={entry} />)}
    </div>
  )
}