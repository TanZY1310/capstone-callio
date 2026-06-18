// src/hooks/useAuth.js
import { useState, useEffect } from 'react';

export function useAuth() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('currentUser');
    return stored ? JSON.parse(stored) : null;
  });

  // ✅ Polls localStorage so same-tab changes are detected
  useEffect(() => {
    const interval = setInterval(() => {
      const stored = localStorage.getItem('currentUser');
      const parsed = stored ? JSON.parse(stored) : null;
      setUser((prev) => {
        // Only update if value actually changed
        if (JSON.stringify(prev) !== JSON.stringify(parsed)) return parsed;
        return prev;
      });
    }, 300);

    return () => clearInterval(interval);
  }, []);

  const logout = () => {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, setUser, logout };
}
