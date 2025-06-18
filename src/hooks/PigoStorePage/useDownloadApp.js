// DownloadApp.js
import { useState, useEffect } from 'react';

// Base URL of your server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Custom hook to download the app
const useDownloadApp = (platform) => {
  const [downloadLink, setDownloadLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDownloadLink = async () => {
      try {
        const response = await fetch(`${BASE_URL}/pigo-stream/pigostore/download-app?platform=${platform}`);
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
    } else {
      setLoading(false);
      setError(true);
    }
  }, [platform]);

  return { downloadLink, loading, error };
};

export default useDownloadApp;