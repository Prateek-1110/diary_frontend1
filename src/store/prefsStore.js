import { create } from 'zustand'

const applyPrefs = (theme, font) => {
  const root = document.documentElement
  root.style.setProperty('--app-font', font || 'Lora, serif')
  root.style.setProperty('--app-theme', theme || 'soft')
  root.setAttribute('data-theme', theme || 'soft')
}

const usePrefsStore = create((set) => ({
  theme: 'soft',
  font: 'Lora, serif',
  setPrefs: (theme, font) => {
    applyPrefs(theme, font)
    set({ theme, font })
  },
}))

export default usePrefsStore