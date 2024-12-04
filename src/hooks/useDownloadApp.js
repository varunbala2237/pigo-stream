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
        const response = await fetch(`${BASE_URL}/download-app?platform=${platform}`);
        
        if (!response.ok) {
          const data = await response.json(); // Capture error response for more context
          throw new Error(data.error || 'Failed to fetch download link');
        }

        const data = await response.json(); // Move this below the check for response.ok
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