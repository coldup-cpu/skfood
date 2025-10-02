import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const adminAPI = {
  getMenuHistory: () => api.get('/admin/menuHistoryLog'),

  uploadImage: (formData) => api.post('/admin/imageUpload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),

  createMenu: (menuData) => api.put('/admin/createMeal', menuData),

  getAllOrders: () => api.get('/admin/allOrders'),

  getConfirmedOrders: () => api.get('/admin/confirmedOrders'),

  getOrderById: (id) => api.get(`/admin/orderwithId/${id}`),
};

export default api;
