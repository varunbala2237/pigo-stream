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

// Custom hook for retrieving servers
const useFetchServers = (id, type, selectedSeason, selectedEpisode) => {
    const [servers, setServers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeasonData = async () => {
            let url = `${BASE_URL}/servers?id=${id}&type=${type}&season=${selectedSeason}&episode=${selectedEpisode}`;

            try {
                setLoading(true);
                const data = await fetchWithRetry(url);
                setServers(data || []);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchSeasonData();
    }, [id, type, selectedSeason, selectedEpisode]);

    return { servers, loading, error };
};

export default useFetchServers;