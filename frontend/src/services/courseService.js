import api from './api';

export const courseService = {
  getCategories: () => api.get('/categories/'),
  getCourses: (params) => api.get('/courses/', { params }),
  getCourseBySlug: (slug) => api.get(`/courses/${slug}/`),
  createCourse: (data) => api.post('/courses/', data),
  updateCourse: (slug, data) => api.patch(`/courses/${slug}/`, data),
  deleteCourse: (slug) => api.delete(`/courses/${slug}/`),
  addLesson: (courseId, data) => api.post(`/courses/${courseId}/lessons/`, data),
  uploadThumbnail: (courseId, file) => {
    const formData = new FormData();
    formData.append('thumbnail', file);
    return api.post(`/courses/${courseId}/upload-thumbnail/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  uploadVideo: (lessonId, file) => {
    const formData = new FormData();
    formData.append('video', file);
    return api.post(`/lessons/${lessonId}/upload-video/`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },


  // Nouvelle fonction : envoie juste l'URL déjà uploadée (pas le fichier)
  attachVideoToLesson: (lessonId, videoData) =>
    api.patch(`/lessons/${lessonId}/attach-video/`, {
      video_url: videoData.url,
      video_public_id: videoData.publicId,
      duration_seconds: videoData.duration,
    }),
};
