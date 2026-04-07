import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      // persisted
      user: null,
      isAuthenticated: false,

      // in-memory only (not in partialize)
      accessToken: null,

      setAuth: (user, accessToken) => set({ user, isAuthenticated: true, accessToken }),
      setAccessToken: (accessToken) => set({ accessToken }),
      clearAuth: () => set({ user: null, isAuthenticated: false, accessToken: null }),
    }),
    {
      name: "diary-auth",
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        // accessToken intentionally excluded
      }),
    }
  )
);

export default useAuthStore;