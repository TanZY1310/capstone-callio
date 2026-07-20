import axios from 'axios';
import { getAuth } from 'firebase/auth';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

let forceLogoutDispatched = false;

api.interceptors.request.use(async (config) => {
  const demoToken = localStorage.getItem('demo_token');
  if (demoToken) {
    config.headers.Authorization = `Bearer ${demoToken}`;
    return config;
  }

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

    if (error.response?.status === 401 && (originalRequest._retry || 0) < 2) {
      if (localStorage.getItem('demo_token')) {
        if (!forceLogoutDispatched) {
          forceLogoutDispatched = true;
          localStorage.removeItem('demo_token');
          localStorage.removeItem('userProfile');
          window.dispatchEvent(new CustomEvent('force_logout'));
        }
        return Promise.reject(error);
      }

      originalRequest._retry = (originalRequest._retry || 0) + 1;

      try {
        const authInstance = getAuth();
        if (authInstance.currentUser) {
          await authInstance.currentUser.getIdToken(true);
          return api(originalRequest);
        }
      } catch {
        // fall through to reject below
      }
    }

    if (error.response?.status === 401 && !forceLogoutDispatched) {
      forceLogoutDispatched = true;
      localStorage.removeItem('userProfile');
      window.dispatchEvent(new CustomEvent('force_logout'));
    }

    return Promise.reject(error);
  }
);

export function resetForceLogoutFlag() {
  forceLogoutDispatched = false;
}

export default api;
