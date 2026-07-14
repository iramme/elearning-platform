import api from './api';

export const authService = {
  register: (data) => api.post('/auth/register/', data),

  login: (username, password) =>
    api.post('/auth/login/', { username, password }),

  getProfile: () => api.get('/auth/profile/'),

  updateProfile: (data) => api.patch('/auth/profile/', data),
};