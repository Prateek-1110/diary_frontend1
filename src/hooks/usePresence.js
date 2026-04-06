import { useEffect, useState } from 'react'
import client from '../api/client'

export function usePresence(intervalMs = 60000) {
  const [lastSeen, setLastSeen] = useState(null)

  useEffect(() => {
    const fetch = () => client.get('/api/presence/').then(res => setLastSeen(res.data.last_seen_at))
    fetch()
    const id = setInterval(fetch, intervalMs)
    return () => clearInterval(id)
  }, [intervalMs])

  return lastSeen
}