import api from './api';

export const certificateService = {
  getMyCertificates: () => api.get('/certificates/my-certificates/'),
  verifyCertificate: (code) => api.get(`/certificates/verify/${code}/`),
};