import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getCurrentUser: () => api.get('/auth/me'),
  changePassword: (passwords) => api.put('/auth/change-password', passwords),
};

// Patient APIs
export const patientAPI = {
  getAll: (params) => api.get('/patients', { params }),
  getById: (id) => api.get(`/patients/${id}`),
  create: (data) => api.post('/patients', data),
  update: (id, data) => api.put(`/patients/${id}`, data),
  delete: (id) => api.delete(`/patients/${id}`),
  getStats: () => api.get('/patients/stats'),
};

// Doctor APIs
export const doctorAPI = {
  getAll: (params) => api.get('/doctors', { params }),
  getById: (id) => api.get(`/doctors/${id}`),
  create: (data) => api.post('/doctors', data),
  update: (id, data) => api.put(`/doctors/${id}`, data),
  delete: (id) => api.delete(`/doctors/${id}`),
  getSpecializations: () => api.get('/doctors/specializations'),
};

// Appointment APIs
export const appointmentAPI = {
  getAll: (params) => api.get('/appointments', { params }),
  getById: (id) => api.get(`/appointments/${id}`),
  create: (data) => api.post('/appointments', data),
  updateStatus: (id, status) => api.put(`/appointments/${id}/status`, status),
  getStats: () => api.get('/appointments/stats'),
};

// Analytics APIs
export const analyticsAPI = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getAppointmentTrends: (days) => api.get('/analytics/appointments/trends', { params: { days } }),
  getPatientDemographics: () => api.get('/analytics/patients/demographics'),
  getDoctorPerformance: () => api.get('/analytics/doctors/performance'),
  getRevenue: () => api.get('/analytics/revenue'),
  getDepartmentOccupancy: () => api.get('/analytics/departments/occupancy'),
};

// Department APIs
export const departmentAPI = {
  getAll: () => api.get('/departments'),
  getById: (id) => api.get(`/departments/${id}`),
  create: (data) => api.post('/departments', data),
  update: (id, data) => api.put(`/departments/${id}`, data),
  delete: (id) => api.delete(`/departments/${id}`),
};

// Medical Records APIs
export const medicalRecordsAPI = {
  getAll: (params) => api.get('/medical-records', { params }),
  getById: (id) => api.get(`/medical-records/${id}`),
  create: (data) => api.post('/medical-records', data),
  update: (id, data) => api.put(`/medical-records/${id}`, data),
  delete: (id) => api.delete(`/medical-records/${id}`),
  getPatientRecords: (patientId) => api.get(`/medical-records/patient/${patientId}`),
};

// ML Prediction APIs
export const mlAPI = {
  predictDisease: (symptoms) => api.post('/ml/predict/disease', symptoms),
  predictReadmission: (data) => api.post('/ml/predict/readmission', data),
  predictNoShow: (data) => api.post('/ml/predict/no-show', data),
  predictLengthOfStay: (data) => api.post('/ml/predict/length-of-stay', data),
  recommendTreatment: (data) => api.post('/ml/recommend/treatment', data),
};

export default api;
