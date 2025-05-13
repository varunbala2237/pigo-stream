import { useState, useEffect } from 'react';

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

// Custom hook for fetching provider data
const useFetchProviders = (providerId) => {
  const [movies, setMovies] = useState([]);
  const [shows, setShows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(null);

  useEffect(() => {
    if (!providerId) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [movieRes, tvRes] = await Promise.all([
          fetchWithRetry(`${BASE_URL}/media/movie/by-provider?provider=${providerId}`),
          fetchWithRetry(`${BASE_URL}/media/tv/by-provider?provider=${providerId}`)
        ]);
        setMovies(movieRes.results || []);
        setShows(tvRes.results || []);
        setIsError(null);
      } catch (err) {
        setIsError(err.message || 'Failed to fetch');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [providerId]);

  return { movies, shows, isLoading, isError };
};

export default useFetchProviders;