import api from './api';

export const paymentService = {
  createCheckout: (courseId) => api.post(`/payments/checkout/${courseId}/`),
  getMyOrders: () => api.get('/payments/my-orders/'),
};