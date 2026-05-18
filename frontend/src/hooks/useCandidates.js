import { useEffect, useState, useCallback } from 'react';
import api from '../services/api.js';

export function useCandidates(params = {}) {
  const [data, setData] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/candidates', { params });
      setData(data);
      setError(null);
    } catch (e) {
      setError(e?.response?.data?.error || e.message);
    } finally {
      setLoading(false);
    }
  }, [JSON.stringify(params)]);

  useEffect(() => { refresh(); }, [refresh]);
  return { ...data, loading, error, refresh };
}
