import useAuthStore from '../store/authStore';

/**
 * Hook pratique pour accéder à l'état d'authentification
 * et vérifier les rôles facilement dans les composants.
 */
export function useAuth() {
  const { user, isAuthenticated, login, logout } = useAuthStore();

  return {
    user,
    isAuthenticated,
    login,
    logout,
    isStudent: user?.role === 'STUDENT',
    isInstructor: user?.role === 'INSTRUCTOR',
    isAdmin: user?.role === 'ADMIN',
  };
}