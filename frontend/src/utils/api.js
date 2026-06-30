import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

api.interceptors.request.use(async (config) => {
  const authInstance = getAuth();
  if (authInstance.currentUser) {
    const token = await authInstance.currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const authInstance = getAuth();
        if (authInstance.currentUser) {
          await authInstance.currentUser.getIdToken(true);
          await new Promise((r) => setTimeout(r, 1500));
          return api(originalRequest);
        }
      } catch {
        // fall through to reject below
      }
    }

    return Promise.reject(error);
  }
);

export default api;
