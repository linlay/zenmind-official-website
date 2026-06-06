import { useCallback, useEffect, useState } from 'react';
import { apiRequest } from '../api';

export function useAuthSession() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiRequest('/auth/me');
      setUser(data.user || null);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    setError('');
    try {
      await apiRequest('/auth/logout', { method: 'POST', body: '{}' });
      setUser(null);
      return true;
    } catch (err) {
      setError(err.message || 'Logout failed.');
      return false;
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { user, setUser, loading, error, refresh, logout };
}
