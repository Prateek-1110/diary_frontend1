import { useState, useCallback } from 'react'

const fetchQuote = async () => {
  const res = await fetch('https://api.quotable.io/random')
  const data = await res.json()
  return { type: 'quote', text: data.content, author: data.author }
}

const fetchJoke = async () => {
  const res = await fetch('https://v2.jokeapi.dev/joke/Any?safe-mode&type=single')
  const data = await res.json()
  return { type: 'joke', text: data.joke, author: data.category }
}

export function useFeed(mode) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchMore = useCallback(async () => {
    if (loading) return
    setLoading(true)
    try {
      const batch = await Promise.all(
        Array.from({ length: 5 }, () =>
          mode === 'quotes' ? fetchQuote() : fetchJoke()
        )
      )
      setItems(prev => [...prev, ...batch])
    } catch (e) {
      console.error('Feed fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [mode, loading])

  const reset = useCallback(() => setItems([]), [])

  return { items, loading, fetchMore, reset }
}