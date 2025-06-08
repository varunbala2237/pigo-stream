// useFetchTrailer.js
import { useState, useEffect } from 'react';

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const useFetchTrailer = (id, type) => {
  const [trailerLink, setTrailerLink] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTrailer = async () => {
      const url = `${BASE_URL}/playground/media-trailer?id=${id}&type=${type}`;
      try {
        setLoading(true);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Unable to fetch data. Please try again later.');
        }
        const data = await response.json();
        setTrailerLink(data.youtubeTrailer || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTrailer();
  }, [id, type]);

  return { trailerLink, loading, error };
};

export default useFetchTrailer;