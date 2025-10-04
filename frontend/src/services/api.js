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

// Add user API functions
export const userAPI = {
  // Menu
  getLunchMenu: () => api.get('/userPanel/seeLunchMenu'),
  getDinnerMenu: () => api.get('/userPanel/seeDinnerMenu'),
  
  // Orders
  createOrder: (orderData) => api.post('/userPanel/orderPreparedThali', orderData),
  getAllOrders: () => api.get('/userPanel/myAllOrders'),
  getConfirmedOrders: () => api.get('/userPanel/confirmedOrders'),
  getOrderById: (id) => api.get(`/userPanel/myOrderwithId/${id}`),
};

// Add auth API functions
export const authAPI = {
  signup: (userData) => api.post('/userAuth/signup', userData),
  login: (credentials) => api.post('/userAuth/login', credentials),
  logout: () => api.post('/userAuth/logout'),
  getProfile: () => api.get('/userAuth/profile'),
  googleAuth: () => window.location.href = '/api/userAuth/google',
};

// Add token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
