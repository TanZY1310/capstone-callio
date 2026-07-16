import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 300;

function getInitialDemoState() {
  const demoToken = localStorage.getItem('demo_token');
  if (!demoToken) return { isDemo: false, profile: null };
  const cached = localStorage.getItem('userProfile');
  if (!cached) {
    localStorage.removeItem('demo_token');
    return { isDemo: false, profile: null };
  }
  try {
    const profile = JSON.parse(cached);
    return { isDemo: true, profile };
  } catch {
    localStorage.removeItem('demo_token');
    localStorage.removeItem('userProfile');
    return { isDemo: false, profile: null };
  }
}

export function useAuth() {
  const initial = getInitialDemoState();
  const [user, setUser] = useState(
    initial.isDemo ? { uid: initial.profile.firebase_uid, email: initial.profile.email } : null,
  );
  const [profile, setProfile] = useState(initial.profile);
  const [loading, setLoading] = useState(!initial.isDemo);
  const [authError, setAuthError] = useState(null);
  const [isDemo, setIsDemo] = useState(initial.isDemo);
  const mountedRef = useRef(true);
  const abortRef = useRef(null);

  const loginDemo = async (role) => {
    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/auth/demo-login`, { role });
      const { demo_token, user: profileData } = response.data;

      localStorage.setItem('demo_token', demo_token);
      localStorage.setItem('userProfile', JSON.stringify(profileData));

      if (mountedRef.current) {
        setUser({ uid: profileData.firebase_uid, email: profileData.email });
        setProfile(profileData);
        setIsDemo(true);
        setAuthError(null);
      }
    } catch (err) {
      console.error('Demo login failed:', err);
      if (mountedRef.current) {
        setAuthError('Demo login failed. Is the backend running?');
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  };

  // Main Firebase auth effect — only runs when not in demo mode
  useEffect(() => {
    if (isDemo) return;

    const controller = new AbortController();
    abortRef.current = controller;
    mountedRef.current = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setLoading(true);

        if (sessionStorage.getItem('callio_pending_registration')) {
          setProfile(null);
          setLoading(true);
          return;
        }

        const cached = localStorage.getItem('userProfile');
        if (cached) {
          try { setProfile(JSON.parse(cached)); } catch { /* ignore */ }
        }

        let lastError = null;
        for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
          try {
            const idToken = await firebaseUser.getIdToken(attempt > 0);
            const response = await axios.post(`${API_URL}/auth/session`, null, {
              headers: { Authorization: `Bearer ${idToken}` },
              signal: controller.signal,
            });
            if (mountedRef.current) {
              setProfile(response.data);
              setAuthError(null);
            }
            lastError = null;
            break;
          } catch (err) {
            if (axios.isCancel(err)) return;
            lastError = err;
            if (err.response?.status === 401 && attempt < MAX_RETRIES - 1) {
              await new Promise((r) => setTimeout(r, RETRY_DELAY_MS));
              continue;
            }
            break;
          }
        }

        if (lastError) {
          console.error('Failed to fetch user profile:', lastError);
          if (mountedRef.current) {
            if (!localStorage.getItem('userProfile')) {
              setProfile(null);
            }
            setAuthError('Session verification failed. Please try signing in again.');
          }
        }
      } else {
        setUser(null);
        setProfile(null);
        setAuthError(null);
      }

      if (mountedRef.current) setLoading(false);
    });

    return () => {
      controller.abort();
      mountedRef.current = false;
      unsubscribe();
    };
  }, [isDemo]);

  const logout = async () => {
    if (isDemo) {
      localStorage.removeItem('demo_token');
      localStorage.removeItem('userProfile');
      setIsDemo(false);
      setUser(null);
      setProfile(null);
      setLoading(false);
      return;
    }
    await signOut(auth);
  };

  return { user, profile, loading, logout, authError, loginDemo };
}
