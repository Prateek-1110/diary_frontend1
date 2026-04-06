import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import useAuthStore from '../store/authStore'
import './Login.css'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { setTokens } = useAuthStore()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
     const res = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/auth/login/`,
        { username, password },
        { withCredentials: true }
      )
      setTokens(res.data.access, res.data.user)
      navigate('/')
    } catch (err) {
      setError('Invalid username or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-root">
      <div className="login-left">
        <div className="login-brand">ours</div>
        <p className="login-tagline">your little world,<br />together.</p>
      </div>

      <div className="login-right">
        <form onSubmit={handleSubmit} className="login-form">
          <h2 className="login-heading">Welcome back</h2>
          <p className="login-sub">Sign in to your shared space</p>

          <div className="login-field">
            <label className="login-label">Username</label>
            <input
              type="text"
              placeholder="your name"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="login-input"
            />
          </div>

          <div className="login-field">
            <label className="login-label">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
          </div>

          {error && <p className="login-error">{error}</p>}

          <button type="submit" disabled={loading} className="login-btn">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
