import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UserState {
  // Example: Store user preferences or app state
  theme: 'light' | 'dark' | 'system';
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  
  // Example: Last viewed user
  lastViewedUserId: number | null;
  setLastViewedUserId: (id: number | null) => void;
}

/**
 * Zustand store for user-related state
 * Persisted to localStorage
 */
export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      theme: 'system',
      setTheme: (theme) => set({ theme }),
      
      lastViewedUserId: null,
      setLastViewedUserId: (id) => set({ lastViewedUserId: id }),
    }),
    {
      name: 'user-store',
    }
  )
);

