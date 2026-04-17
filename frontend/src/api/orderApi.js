import api from './axios';

export const getDashboardStats = () => api.get('/dashboard');

export const getOrders = (params) => api.get('/orders', { params });

export const getOrderById = (orderId) => api.get(`/orders/${orderId}`);

export const createOrder = (orderData) => api.post('/orders', orderData);

export const updateOrderStatus = (orderId, status) => 
  api.patch(`/orders/${orderId}/status`, { status });
