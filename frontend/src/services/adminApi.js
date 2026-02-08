import api from './api';

const admin = {
  getDashboard: () => api.get('/admin/dashboard'),
  getCategories: () => api.get('/admin/categories'),
  getCategory: (id) => api.get(`/admin/categories/${id}`),
  createCategory: (payload) => api.post('/admin/categories', payload),
  updateCategory: (id, payload) => api.put(`/admin/categories/${id}`, payload),
  deleteCategory: (id) => api.delete(`/admin/categories/${id}`),
  getProducts: (params) => api.get('/admin/products', { params }),
  getProduct: (id) => api.get(`/admin/products/${id}`),
  createProduct: (formData) => api.post('/admin/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  updateProduct: (id, formData) => api.put(`/admin/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  toggleProductActive: (id) => api.patch(`/admin/products/${id}/toggle-active`),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getOrders: (params) => api.get('/admin/orders', { params }),
  getOrder: (id) => api.get(`/admin/orders/${id}`),
  updateOrderStatus: (id, status) => api.put(`/admin/orders/${id}/status`, { status }),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  getUserOrders: (id) => api.get(`/admin/users/${id}/orders`),
  blockUser: (id) => api.patch(`/admin/users/${id}/block`),
  unblockUser: (id) => api.patch(`/admin/users/${id}/unblock`),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getPayments: (params) => api.get('/admin/payments', { params }),
  getSalesAnalytics: () => api.get('/admin/analytics/sales'),
  getTopProducts: (params) => api.get('/admin/analytics/top-products', { params }),
  getRevenueSummary: () => api.get('/admin/analytics/revenue'),
};

export default admin;
