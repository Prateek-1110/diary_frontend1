import { useState } from 'react'
import client from '../api/client'
import usePrefsStore from '../store/prefsStore'
import Layout from '../components/Layout'
import './Settings.css'

const THEMES = ['soft', 'mint', 'dusk', 'paper']
const FONTS = ['Lora, serif', 'Merriweather, serif', 'DM Sans, sans-serif', 'Playfair Display, serif']

const THEME_PREVIEWS = {
  soft:  { bg: '#fdf8f4', surface: '#f3ede6', accent: '#b48c6e', label: 'Soft' },
  mint:  { bg: '#f4faf7', surface: '#e8f5ee', accent: '#5a9e7c', label: 'Mint' },
  dusk:  { bg: '#f5f4f8', surface: '#ece9f3', accent: '#7c6fa0', label: 'Dusk' },
  paper: { bg: '#faf9f6', surface: '#f0edea', accent: '#8b7d6b', label: 'Paper' },
}

const FONT_LABELS = {
  'Lora, serif': 'Lora',
  'Merriweather, serif': 'Merriweather',
  'DM Sans, sans-serif': 'DM Sans',
  'Playfair Display, serif': 'Playfair Display',
}

export default function Settings() {
  const { theme, font, setPrefs } = usePrefsStore()
  const [displayName, setDisplayName] = useState('')
  const [selectedTheme, setSelectedTheme] = useState(theme)
  const [selectedFont, setSelectedFont] = useState(font)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    await client.patch('/api/auth/me/', {
      display_name: displayName,
      theme: selectedTheme,
      font: selectedFont,
    })
    setPrefs(selectedTheme, selectedFont)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Layout>
      <div className="settings-root">
        <header className="settings-header">
          <h1 className="settings-title">Settings</h1>
          <p className="settings-sub">Personalise your shared space</p>
        </header>

        <div className="settings-body">

          {/* Display Name */}
          <section className="settings-section">
            <div className="settings-section-label">Display name</div>
            <input
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your name"
              className="settings-input"
            />
          </section>

          <div className="settings-divider" />

          {/* Theme */}
          <section className="settings-section">
            <div className="settings-section-label">Theme</div>
            <div className="settings-theme-grid">
              {THEMES.map(t => {
                const p = THEME_PREVIEWS[t]
                const active = selectedTheme === t
                return (
                  <button
                    key={t}
                    onClick={() => setSelectedTheme(t)}
                    className={`settings-theme-swatch ${active ? 'active' : ''}`}
                    style={{ '--swatch-bg': p.bg, '--swatch-surface': p.surface, '--swatch-accent': p.accent }}
                  >
                    <span className="swatch-preview">
                      <span className="swatch-bar" />
                      <span className="swatch-dot" />
                    </span>
                    <span className="swatch-name">{p.label}</span>
                    {active && <span className="swatch-check">✓</span>}
                  </button>
                )
              })}
            </div>
          </section>

          <div className="settings-divider" />

          {/* Font */}
          <section className="settings-section">
            <div className="settings-section-label">Typeface</div>
            <div className="settings-font-list">
              {FONTS.map(f => {
                const active = selectedFont === f
                const label = FONT_LABELS[f]
                return (
                  <button
                    key={f}
                    onClick={() => setSelectedFont(f)}
                    className={`settings-font-row ${active ? 'active' : ''}`}
                    style={{ fontFamily: f }}
                  >
                    <span className="font-sample">Aa — {label}</span>
                    <span className="font-pangram">The quick brown fox</span>
                    {active && <span className="font-check">✓</span>}
                  </button>
                )
              })}
            </div>
          </section>

          <div className="settings-divider" />

          {/* Save */}
          <div className="settings-actions">
            <button onClick={handleSave} className={`settings-save-btn ${saved ? 'saved' : ''}`}>
              {saved ? 'Saved ✓' : 'Save changes'}
            </button>
          </div>

        </div>
      </div>
    </Layout>
  )
}
