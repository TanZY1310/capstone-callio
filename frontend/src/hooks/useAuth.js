import { useState, useEffect } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth } from '../../firebase';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

export function useAuth() {
  const [user, setUser] = useState(null); // Firebase user object
  const [profile, setProfile] = useState(null); // Your DB user profile
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        try {
          // Check if registration just completed and profile was stored locally
          const cached = localStorage.getItem('userProfile');
          if (cached) {
            setProfile(JSON.parse(cached));
            localStorage.removeItem('userProfile'); // clear after use
            setLoading(false);
            return;
          }
          // Fetch your DB profile using the Firebase token
          const idToken = await firebaseUser.getIdToken();
          const response = await axios.post(`${API_URL}/auth/session`, null, {
            headers: { Authorization: `Bearer ${idToken}` },
          });
          setProfile(response.data);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          setProfile(null);
        }
      } else {
        // Logged out
        setUser(null);
        setProfile(null);
      }

      setLoading(false);
    });

    // Cleanup listener on unmount
    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    // onAuthStateChanged fires automatically after signOut
    // and sets user + profile back to null
  };

  return { user, profile, loading, logout };
}
