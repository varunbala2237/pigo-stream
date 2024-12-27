import { useState, useEffect } from 'react';

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Helper function for fetch with retry and timeout
const fetchWithRetry = async (url, options = {}, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Unable to fetch data. Please try again later.');
      return await response.json();
    } catch (err) {
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw new Error('Failed to fetch data. Please check your connection or contact support.');
      }
    }
  }
};

// Custom hook for retrieving app version data
const useAppVersion = (platform) => {
  const [version, setVersion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAppVersion = async () => {
      if (!platform) {
        setError('Platform is required');
        setLoading(false);
        return;
      }

      const url = `${BASE_URL}/app-version?platform=${platform}`;

      try {
        const result = await fetchWithRetry(url);
        setVersion(result.version);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppVersion();
  }, [platform]);

  return { version, loading, error };
};

export default useAppVersion;