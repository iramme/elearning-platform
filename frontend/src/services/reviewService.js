import api from './api';

export const reviewService = {
  getReviewsByCourse: (courseId) => api.get(`/reviews/?course=${courseId}`),
  createReview: (data) => api.post('/reviews/', data),
  updateReview: (id, data) => api.patch(`/reviews/${id}/`, data),
};