import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1500;

export function useAuth() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);
  const mountedRef = useRef(true);
  const abortRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    mountedRef.current = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        if (sessionStorage.getItem('callio_pending_registration')) {
          setProfile(null);
          setLoading(false);
          return;
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
            setProfile(null);
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
  }, []);

  const logout = async () => {
    await signOut(auth);
  };

  return { user, profile, loading, logout, authError };
}
