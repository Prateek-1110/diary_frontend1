import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      accessToken: null,
      isInitialized: false,          // ← added

      setAuth: (user, accessToken) => set({ user, isAuthenticated: true, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      setInitialized: () => set({ isInitialized: true }),   // ← added
      clearAuth: () => set({ user: null, isAuthenticated: false, accessToken: null }),
    }),
    {
      name: "diary-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // accessToken and isInitialized intentionally excluded
      }),
    }
  )
);

export default useAuthStore;