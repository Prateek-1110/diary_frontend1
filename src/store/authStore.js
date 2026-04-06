import { create } from 'zustand'

const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  isInitialized: false,   // ← new flag

  setTokens: (accessToken, user) => set({ accessToken, user }),
  setAccessToken: (accessToken) => set({ accessToken }),
  clearAuth: () => set({ accessToken: null, user: null }),
  setInitialized: () => set({ isInitialized: true }),  // ← new action
}))

export default useAuthStore