import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      if (currentPath.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  userLogin: (email, password) => api.post('/userAuth/login', { email, password }),

  userSignup: (name, email, password) => api.post('/userAuth/signup', { name, email, password }),

  userLogout: () => api.post('/userAuth/logout'),

  getUserProfile: () => api.get('/userAuth/profile'),

  adminLogin: (email, password) => api.post('/admin/login', { email, password }),

  adminLogout: () => api.post('/admin/logout'),
};

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

export const userAPI = {
  getLunchMenu: () => api.get('/userPanel/seeLunchMenu'),

  getDinnerMenu: () => api.get('/userPanel/seeDinnerMenu'),

  createOrder: (orderData) => api.post('/userPanel/orderPreparedThali', orderData),

  getMyOrders: () => api.get('/userPanel/myAllOrders'),

  getConfirmedOrders: () => api.get('/userPanel/confirmedOrders'),

  getOrderById: (id) => api.get(`/userPanel/myOrderwithId/${id}`),
};

export default api;
