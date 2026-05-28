import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log(token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
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

// Auth APIs
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/auth/login', credentials),
  register: (data: { fullName: string; email: string; password: string; roles: string }) =>
    api.post('/api/auth/register', data),
};

// Events APIs
export const eventsAPI = {
  getAll: () => api.get('/api/events'),
  getById: (id: string) => api.get(`/api/events/${id}`),
  create: (data: any) => api.post('/api/events', data),
  update: (id: string, data: any) => api.put(`/api/events/${id}`, data),
  delete: (id: string) => api.delete(`/api/events/${id}`),
  search: (keyword: string) => api.get(`/api/events/search?keyword=${keyword}`),
  filterByCategory: (category: string) => api.get(`/api/events/category?category=${category}`),
  filterByStatus: (status: string) => api.get(`/api/events/status?status=${status}`),
  getOrganizerEvents: () => api.get('/api/events/organizer'),
  uploadBanner: (id: string, formData: FormData) =>
    api.post(`/api/events/${id}/banner`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
};

// Tickets APIs
export const ticketsAPI = {
  book: (eventId: string) => api.post(`/api/tickets/book/${eventId}`),
  cancel: (ticketId: string) => api.put(`/api/tickets/cancel/${ticketId}`),
  getMyTickets: () => api.get('/api/tickets/my'),
};

// Notifications APIs
export const notificationsAPI = {
  getAll: () => api.get('/api/notifications'),
  markAsRead: (id: string) => api.put(`/api/notifications/${id}/read`),
};

// Dashboard APIs
export const dashboardAPI = {
  getAdminStats: () => api.get('/api/dashboard/admin'),
  getUserStats: (userId: string) => api.get(`/api/dashboard/others/${userId}`),
};

// User Profile APIs
export const userProfileAPI = {
  updateProfile: (data: any) => api.put('/api/user', data),
  changePassword: (data: { currentPassword: string; newPassword: string, confirmPassword: string }) =>
    api.put('/api/user/password', data),
};

export default api;
