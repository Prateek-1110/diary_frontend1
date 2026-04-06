import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import usePrefsStore from '../store/prefsStore'
import client from '../api/client'
import { usePresence } from '../hooks/usePresence'
import './Layout.css'

const NAV = [
  { to: '/',          label: 'Home',     icon: HomeIcon },
  { to: '/diary',     label: 'Diary',    icon: DiaryIcon },
  { to: '/letters',   label: 'Letters',  icon: LettersIcon },
  { to: '/vault',     label: 'Vault',    icon: VaultIcon },
  { to: '/checkin',   label: 'Mood',     icon: MoodIcon },
  { to: '/timeline',  label: 'Timeline', icon: TimelineIcon },
]

function timeAgo(dateStr) {
  if (!dateStr) return null
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 60000)
  if (diff < 1) return 'just now'
  if (diff < 60) return `${diff}m ago`
  const h = Math.floor(diff / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function Layout({ children }) {
  const { user, clearAuth } = useAuthStore()
  const { theme } = usePrefsStore()
  const navigate = useNavigate()
  const lastSeen = usePresence()

  const handleLogout = async () => {
    try { await client.post('/auth/logout/') } catch (_) {}
    clearAuth()
    navigate('/login')
  }

  return (
    <div className="layout" data-theme={theme || 'soft'}>
      <aside className="sidebar">
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <span className="brand-dot" />
            <span className="brand-name">ours</span>
          </div>

          <nav className="sidebar-nav">
            {NAV.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `nav-item${isActive ? ' nav-item--active' : ''}`
                }
              >
                <Icon />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="sidebar-bottom">
          {lastSeen && (
            <div className="presence">
              <span className="presence-dot" />
              <span className="presence-label">{timeAgo(lastSeen)}</span>
            </div>
          )}
          <div className="sidebar-user">
            <span className="sidebar-username">
              {user?.display_name || user?.username}
            </span>
            <div className="sidebar-actions">
              <button
                className="icon-btn"
                onClick={() => navigate('/settings')}
                title="Settings"
              >
                <SettingsIcon />
              </button>
              <button
                className="icon-btn"
                onClick={handleLogout}
                title="Log out"
              >
                <LogoutIcon />
              </button>
            </div>
          </div>
        </div>
      </aside>

      <main className="page-content">
        {children}
      </main>
    </div>
  )
}

/* ── Icons ─────────────────────────────────────────────── */

function HomeIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/>
      <path d="M9 21V12h6v9"/>
    </svg>
  )
}

function DiaryIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      <line x1="9" y1="8" x2="15" y2="8"/>
      <line x1="9" y1="12" x2="15" y2="12"/>
    </svg>
  )
}

function LettersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <path d="M2 7l10 7 10-7"/>
    </svg>
  )
}

function VaultIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/>
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 9V7M12 17v-2M9 12H7M17 12h-2"/>
    </svg>
  )
}

function MoodIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M8 14s1.5 2 4 2 4-2 4-2"/>
      <line x1="9" y1="9" x2="9.01" y2="9"/>
      <line x1="15" y1="9" x2="15.01" y2="9"/>
    </svg>
  )
}

function TimelineIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="2" x2="12" y2="22"/>
      <circle cx="12" cy="6" r="2" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>
      <circle cx="12" cy="18" r="2" fill="currentColor" stroke="none"/>
      <line x1="12" y1="6" x2="18" y2="6"/>
      <line x1="12" y1="12" x2="6" y2="12"/>
      <line x1="12" y1="18" x2="18" y2="18"/>
    </svg>
  )
}

function SettingsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
      <polyline points="16 17 21 12 16 7"/>
      <line x1="21" y1="12" x2="9" y2="12"/>
    </svg>
  )
}
