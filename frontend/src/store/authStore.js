import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';

/**
 * Store d'authentification global.
 * Persiste les tokens dans localStorage et décode le rôle depuis le JWT
 * (pas besoin d'appeler l'API pour savoir qui est connecté).
 */
const useAuthStore = create((set, get) => ({
  user: null,
  isAuthenticated: false,

  // Initialise le store au chargement de l'app (lit le token existant)
  initAuth: () => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Vérifie que le token n'est pas expiré
        if (decoded.exp * 1000 > Date.now()) {
          set({
            user: {
              id: decoded.user_id,
              username: decoded.username,
              role: decoded.role,
            },
            isAuthenticated: true,
          });
        } else {
          localStorage.clear();
        }
      } catch {
        localStorage.clear();
      }
    }
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
    });
  },

  logout: () => {
    localStorage.clear();
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;