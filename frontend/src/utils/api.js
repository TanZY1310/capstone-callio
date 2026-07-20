import axios from 'axios';
import { getAuth } from 'firebase/auth';

const API_URL = import.meta.env.VITE_API_URL;
const SESSION_REFRESH_KEY = 'callio_session_refreshed_at';
const REFRESH_INTERVAL_MS = 6 * 24 * 60 * 60 * 1000;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

let forceLogoutDispatched = false;
let isRefreshing = false;
let refreshPromise = null;

async function refreshSessionCookie() {
  const demoToken = localStorage.getItem('demo_token');
  if (demoToken) {
    return axios.post(`${API_URL}/auth/refresh`, null, {
      headers: { Authorization: `Bearer ${demoToken}` },
      withCredentials: true,
    });
  }

  const authInstance = getAuth();
  if (authInstance.currentUser) {
    const idToken = await authInstance.currentUser.getIdToken(true);
    return axios.post(`${API_URL}/auth/refresh`, null, {
      headers: { Authorization: `Bearer ${idToken}` },
      withCredentials: true,
    });
  }

  throw new Error('No auth credentials available for session refresh');
}

api.interceptors.request.use(async (config) => {
  if (config.url?.includes('/auth/refresh')) return config;

  const demoToken = localStorage.getItem('demo_token');
  if (demoToken) {
    config.headers.Authorization = `Bearer ${demoToken}`;
  } else {
    const authInstance = getAuth();
    if (authInstance.currentUser) {
      const token = await authInstance.currentUser.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  const lastRefresh = localStorage.getItem(SESSION_REFRESH_KEY);
  const now = Date.now();
  if (!lastRefresh || now - parseInt(lastRefresh, 10) > REFRESH_INTERVAL_MS) {
    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = refreshSessionCookie()
        .then(() => {
          localStorage.setItem(SESSION_REFRESH_KEY, now.toString());
          forceLogoutDispatched = false;
        })
        .catch(() => {})
        .finally(() => {
          isRefreshing = false;
          refreshPromise = null;
        });
    }
    if (refreshPromise) {
      await refreshPromise;
    }
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (originalRequest.url?.includes('/auth/refresh')) {
      if (error.response?.status === 401 && !forceLogoutDispatched) {
        forceLogoutDispatched = true;
        localStorage.removeItem('userProfile');
        localStorage.removeItem('demo_token');
        window.dispatchEvent(new CustomEvent('force_logout'));
      }
      return Promise.reject(error);
    }

    if (error.response?.status === 401) {
      const demoToken = localStorage.getItem('demo_token');
      if (demoToken && (originalRequest._retry || 0) >= 1) {
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
        await refreshSessionCookie();
        localStorage.setItem(SESSION_REFRESH_KEY, Date.now().toString());
        forceLogoutDispatched = false;
        return api(originalRequest);
      } catch {
        // fall through to force logout
      }

      if (!forceLogoutDispatched) {
        forceLogoutDispatched = true;
        localStorage.removeItem('userProfile');
        localStorage.removeItem('demo_token');
        window.dispatchEvent(new CustomEvent('force_logout'));
      }
    }

    return Promise.reject(error);
  },
);

export function resetForceLogoutFlag() {
  forceLogoutDispatched = false;
}

export default api;
