import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFeed } from '../hooks/useFeed'
import FeedCard from '../components/FeedCard'
import useAuthStore from '../store/authStore'   // ← add
import './Explore.css'

export default function Explore() {
  const [mode, setMode] = useState('quotes')
  const { items, loading, fetchMore, reset } = useFeed(mode)
  const sentinelRef = useRef(null)
  const navigate = useNavigate()
  const { isAuthenticated } = useAuthStore()   // ← add

  useEffect(() => {
    reset()
    fetchMore()
  }, [mode])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) fetchMore() },
      { threshold: 0.1 }
    )
    if (sentinelRef.current) observer.observe(sentinelRef.current)
    return () => observer.disconnect()
  }, [fetchMore])

  const switchMode = (m) => {
    if (m === mode) return
    reset()
    setMode(m)
  }

  const handleDiaryClick = () => {
    navigate(isAuthenticated ? '/home' : '/login')   // ← smart redirect
  }

  return (
    <div className="explore-root">
      <div className="explore-toggle">
        <button
          className={`explore-tog ${mode === 'quotes' ? 'active' : ''}`}
          onClick={() => switchMode('quotes')}
        >
          Quotes
        </button>
        <button
          className={`explore-tog ${mode === 'jokes' ? 'active' : ''}`}
          onClick={() => switchMode('jokes')}
        >
          Jokes
        </button>
      </div>

      <div className="explore-feed">
        {items.map((item, i) => (
          <FeedCard key={i} item={item} />
        ))}
        <div ref={sentinelRef} className="explore-sentinel">
          {loading && <div className="explore-spinner" />}
        </div>
      </div>

      <button className="explore-diary-btn" onClick={handleDiaryClick}>
        {isAuthenticated ? 'open my diary →' : 'sign in to diary →'}
      </button>
    </div>
  )
}