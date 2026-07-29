import { useState, useEffect } from 'react';
import { getApiUrl } from '../config/environment';

export const useOverseerAuth = () => {
  // Synchronously initialize state to prevent React race conditions or microtask flashes
  // that can cause premature logouts on route changes.
  const hasAuthToken = sessionStorage.getItem('adminAuth') === 'authenticated';
  const [authenticated, setAuthenticated] = useState<boolean>(hasAuthToken);
  const [loading, setLoading] = useState<boolean>(!hasAuthToken);

  const verify = async (): Promise<boolean> => {
    // Trust session storage. This prevents random logouts on back navigation
    if (sessionStorage.getItem('adminAuth') === 'authenticated') {
      if (!authenticated) setAuthenticated(true);
      if (loading) setLoading(false);
      return true;
    }

    try {
      const response = await fetch(getApiUrl('overseer/verify'), {
        credentials: 'include',
        cache: 'no-store',
      });
      const isValid = response.ok;
      setAuthenticated(isValid);
      if (isValid) {
        sessionStorage.setItem('adminAuth', 'authenticated');
      } else {
        sessionStorage.removeItem('adminAuth');
      }
      return isValid;
    } catch {
      setAuthenticated(false);
      sessionStorage.removeItem('adminAuth');
      return false;
    }
  };

  const login = async (emailOrPassword: string, password?: string): Promise<{ success: boolean; message?: string }> => {
    try {
      // Support both (email, password) and legacy (password) calls
      const body = password
        ? { email: emailOrPassword, password }
        : { password: emailOrPassword };
      const response = await fetch(getApiUrl('overseer/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        setAuthenticated(true);
        sessionStorage.setItem('adminAuth', 'authenticated');
        return { success: true };
      }
      return { success: false, message: data.message || 'Invalid password' };
    } catch {
      return { success: false, message: 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    try {
      await fetch(getApiUrl('overseer/logout'), {
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  useEffect(() => {
    verify().finally(() => setLoading(false));
  }, []);

  return { authenticated, loading, login, logout, verify };
};
