// useFetchSearch.js
import { useState, useEffect } from 'react';

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Helper function for fetch with retry and timeout
const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000, timeout = 10000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await Promise.race([
        fetch(url, options),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Request timed out.')), timeout)
        )
      ]);
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

// Custom hook for searching data
const useFetchSearch = (type, query) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!query) return; // No query to search

      try {
        const url = `${BASE_URL}/pigo-stream/index/search/${type}?query=${encodeURIComponent(query)}`;
        const result = await fetchWithRetry(url);
        setData(result.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, query]);

  return { data, loading, error };
};

export default useFetchSearch;