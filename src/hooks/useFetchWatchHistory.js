import { useState, useEffect, useCallback } from 'react';

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Helper function for fetch with retry and timeout
const fetchWithRetry = async (url, options = {}, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (err) {
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
};

// Custom hook for fetching watch history
const useFetchWatchHistory = (userUID, movieLimit, tvLimit) => {
  const [data, setData] = useState({ movieHistory: [], tvHistory: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchHistory = useCallback(async () => {
    if (!userUID) return;

    let url = `${BASE_URL}/users/${userUID}/watch-history?movieLimit=${movieLimit}&tvLimit=${tvLimit}`;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchWithRetry(url);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [userUID, movieLimit, tvLimit]);

  useEffect(() => {
    fetchWatchHistory();
  }, [fetchWatchHistory]);

  return { data, loading, error, refetch: fetchWatchHistory };
};

export default useFetchWatchHistory;