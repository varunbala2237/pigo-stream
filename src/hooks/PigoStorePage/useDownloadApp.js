// DownloadApp.js
import { useState, useEffect } from 'react';

// Base URL of your server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Custom hook to download the app
const useDownloadApp = (platform) => {
  const [downloadLink, setDownloadLink] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDownloadLink = async () => {
      setLoading(true);
      setError(null); // Reset error state before new fetch

      try {
        const response = await fetch(`${BASE_URL}/pigostore/download-app?platform=${platform}`);
        
        if (!response.ok) {
          throw new Error('Unable to fetch data. Please try again later.');
        }

        const data = await response.json();
        setDownloadLink(data.url);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (platform) {
      fetchDownloadLink();
    }
  }, [platform]);

  return { downloadLink, loading, error };
};

export default useDownloadApp;