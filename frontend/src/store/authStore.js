import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,
  isInitialized: false,

  initAuth: () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        if (decoded.exp * 1000 > Date.now()) {
          set({
            user: {
              id: decoded.user_id,
              username: decoded.username,
              role: decoded.role,
            },
            isAuthenticated: true,
            isInitialized: true,
          });
          return;
        } else {
          localStorage.clear();
        }
      } catch {
        localStorage.clear();
      }
    }
    set({ isInitialized: true });
  },

  login: (access, refresh) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    const decoded = jwtDecode(access);
    set({
      user: {
        id: decoded.user_id,
        username: decoded.username,
        role: decoded.role,
      },
      isAuthenticated: true,
      isInitialized: true,
    });
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;