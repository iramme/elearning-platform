import api from './api';

export const progressService = {
  updateLessonProgress: (lessonId, watchedSeconds) =>
    api.post(`/progress/lessons/${lessonId}/`, { watched_seconds: watchedSeconds }),
  getMyProgress: () => api.get('/progress/my-progress/'),
};