import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute({ children }) {
  const { accessToken, isInitialized, setAccessToken, setInitialized, clearAuth } = useAuthStore()

  console.log('ProtectedRoute render:', { accessToken, isInitialized })

  useEffect(() => {
    console.log('ProtectedRoute useEffect, isInitialized:', isInitialized)
    if (isInitialized) return

    console.log('Attempting token refresh...')
    axios.post(
      `${import.meta.env.VITE_API_URL}/api/auth/token/refresh/`,
      {},
      { withCredentials: true }
    )
      .then((res) => {
        console.log('Refresh success:', res.data)
        setAccessToken(res.data.access)
      })
      .catch((err) => {
        console.log('Refresh failed:', err.message)
        clearAuth()
      })
      .finally(() => {
        console.log('setInitialized called')
        setInitialized()
      })
  }, [])

  console.log('Rendering — isInitialized:', isInitialized, 'accessToken:', !!accessToken)

  if (!isInitialized) return <div>Initializing...</div>   // ← temp, shows something instead of null
  if (!accessToken) return <Navigate to="/login" replace />
  return children
}