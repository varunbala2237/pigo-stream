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

      const url = `${BASE_URL}/pigo-stream/pigostore/download-app?platform=${platform}`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setDownloadLink(data.url);
      } catch (err) {
        setError(
          err.message || `Sorry, downloading isn't available for ${platform || 'this platform'} right now.`
        );
      } finally {
        setLoading(false);
      }
    };

    if (platform) {
      fetchDownloadLink();
    } else {
      return;
    }
  }, [platform]);

  return { downloadLink, loading, error };
};

export default useDownloadApp;