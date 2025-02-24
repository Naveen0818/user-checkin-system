import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8081',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
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

// Authentication
export const login = async (credentials) => {
  const response = await api.post('/api/auth/login', credentials);
  return response.data;
};

// User endpoints
export const getUserProfile = async (userId) => {
  const response = await api.get(`/api/users/${userId}`);
  return response.data;
};

export const getUserCheckins = async (userId) => {
  const response = await api.get(`/api/users/${userId}/checkins`);
  return response.data;
};

// Visit endpoints
export const getPlannedVisits = async () => {
  const response = await api.get('/api/visits/planned');
  return response.data;
};

// Manager endpoints
export const getTeamMembers = async (managerId) => {
  const response = await api.get(`/api/manager/users?managerId=${managerId}`);
  return response.data;
};

export const getTeamCheckins = async (managerId) => {
  const response = await api.get(`/api/manager/team?managerId=${managerId}`);
  return response.data;
};

export const addTeamMember = async (managerId, userData) => {
  const response = await api.post(`/api/manager/users?managerId=${managerId}`, userData);
  return response.data;
};

export const getMonthlyCheckinStats = async () => {
  const response = await api.get('/api/visits/stats/monthly');
  return response.data;
};

export { api };
