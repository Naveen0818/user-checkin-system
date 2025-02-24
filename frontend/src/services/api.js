import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const login = async (username, password) => {
  const response = await api.post('/auth/login', { username, password });
  return response.data;
};

export const getMonthlyCheckinStats = async (username) => {
  const response = await api.get(`/visits/stats/monthly?username=${username}`);
  return response.data;
};

export const getPlannedVisits = async (username) => {
  const response = await api.get(`/visits/planned?username=${username}`);
  return response.data;
};

export const planVisit = async (visitData) => {
  const response = await api.post('/visits/plan', visitData);
  return response.data;
};

export const getManagerPlannedVisits = async (managerUsername) => {
  const response = await api.get(`/visits/manager/planned?managerUsername=${managerUsername}`);
  return response.data;
};

export const getManagerCheckins = async (managerUsername) => {
  const response = await api.get(`/visits/manager/checkins?managerUsername=${managerUsername}`);
  return response.data;
};
