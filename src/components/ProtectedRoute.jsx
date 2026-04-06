import { useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import axios from 'axios'
import useAuthStore from '../store/authStore'

export default function ProtectedRoute({ children }) {
  const { accessToken, isInitialized, setAccessToken, setInitialized, clearAuth } = useAuthStore()

  useEffect(() => {
    if (isInitialized) return

    axios.post(
      `${import.meta.env.VITE_API_BASE_URL}/api/auth/token/refresh/`,
      {},
      { withCredentials: true }
    )
      .then((res) => setAccessToken(res.data.access))
      .catch(() => clearAuth())
      .finally(() => setInitialized())
  }, [])

  if (!isInitialized) return null
  if (!accessToken) return <Navigate to="/login" replace />
  return children
}