// src/services/api.service.js
// Centralized Axios-based API client with base URL and error handling.

import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// ─── Response Interceptor ─────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message =
      error.response?.data?.error ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ─── AI Endpoints ─────────────────────────────────────────────────────────
export const aiAPI = {
  /**
   * Sends a civic query to the AI and returns a step-by-step response.
   * @param {string} query
   * @param {{ userProfile?: object, simplified?: boolean }} options
   */
  chat: (query, options = {}) =>
    apiClient.post('/ai/chat', { query, ...options }),
};

// ─── Checklist Endpoints ──────────────────────────────────────────────────
export const checklistAPI = {
  getChecklist: (userId) => apiClient.get(`/checklist/${userId}`),

  updateItem: (userId, itemId, completed) =>
    apiClient.patch(`/checklist/${userId}/item/${itemId}`, { completed }),

  resetChecklist: (userId) => apiClient.delete(`/checklist/${userId}/reset`),
};

// ─── User Endpoints ───────────────────────────────────────────────────────
export const userAPI = {
  saveProfile: (profile) => apiClient.post('/user/profile', profile),
  getProfile: (userId) => apiClient.get(`/user/profile/${userId}`),
  checkEligibility: (data) => apiClient.post('/user/eligibility', data),
};

export default apiClient;
