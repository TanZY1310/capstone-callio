import { useState, useEffect, useRef } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export function useAuth() {
  const [user, setUser] = useState(null); // Firebase user object
  const [profile, setProfile] = useState(null); // Your DB user profile
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);
  const abortRef = useRef(null);

  useEffect(() => {
    const controller = new AbortController();
    abortRef.current = controller;
    mountedRef.current = true;

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          if (sessionStorage.getItem('callio_pending_registration')) {
            setProfile(null);
            setLoading(false);
            return;
          }
          const idToken = await firebaseUser.getIdToken(false);
          const response = await axios.post(`${API_URL}/auth/session`, null, {
            headers: { Authorization: `Bearer ${idToken}` },
            signal: controller.signal,
          });
          if (mountedRef.current) setProfile(response.data);
        } catch (err) {
          if (axios.isCancel(err)) return;
          console.error('Failed to fetch user profile:', err);
          if (mountedRef.current) setProfile(null);
        }
      } else {
        // Logged out
        setUser(null);
        setProfile(null);
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
    // onAuthStateChanged fires automatically after signOut
    // and sets user + profile back to null
  };

  return { user, profile, loading, logout };
}
