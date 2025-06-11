// useFetchWatchHistory.js
import { useState, useEffect, useCallback } from 'react';

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Helper function for fetch with retry and timeout
const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Unable to fetch data. Please try again later.');
      return await response.json();
    } catch (err) {
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error('Failed to fetch data. Server is not responding.');
      }
    }
  }
};

// Custom hook for fetching watch history
const useFetchWatchHistory = (userUID, movieLimit, showLimit) => {
  const [data, setData] = useState({ moviesHistory: [], showsHistory: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWatchHistory = useCallback(async () => {
    if (!userUID) return;

    let url = `${BASE_URL}/pigo-stream/watch-history/${userUID}/fetch-watch-history?movieLimit=${movieLimit}&showLimit=${showLimit}`;

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
  }, [userUID, movieLimit, showLimit]);

  useEffect(() => {
    fetchWatchHistory();
  }, [fetchWatchHistory]);

  return { data, loading, error, refetch: fetchWatchHistory };
};

export default useFetchWatchHistory;