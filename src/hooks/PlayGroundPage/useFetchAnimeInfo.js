// useFetchAnimeInfo.js
import { useState, useEffect } from 'react';
import fetchAndMapAnime from './fetchAndMapAnime';

const useFetchAnimeInfo = (mediaInfo) => {
  const [animeInfo, setAnimeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mediaInfo) return;

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchAndMapAnime(mediaInfo);
        setAnimeInfo(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [mediaInfo]);

  return { data: animeInfo, loading, error };
};

export default useFetchAnimeInfo;