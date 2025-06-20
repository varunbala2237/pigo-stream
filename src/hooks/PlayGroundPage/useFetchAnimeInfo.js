// useFetchAnimeInfo.js
import { useState, useEffect } from 'react';
import { matchAniMediaByTitleAndDate, extractChronologicalChain } from '../utils/animeUtils';

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error('Fetch failed');
      return await res.json();
    } catch (err) {
      if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
      else throw err;
    }
  }
};

const useFetchAnimeInfo = (mediaInfo) => {
  const [animeInfo, setAnimeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mediaInfo) return;

    const load = async () => {
      setLoading(true);
      setError(null);

      const tmdbTitle = mediaInfo.title || mediaInfo.name || '';
      const tmdbDate = mediaInfo.release_date || mediaInfo.first_air_date || '';

      const query = {
        query: `
          query ($search: String) {
            Page(perPage: 10) {
              media(search: $search, type: ANIME) {
                id
                title {
                  english
                  romaji
                }
                startDate {
                  year
                  month
                  day
                }
                type
                format
                episodes
                duration
                description
                coverImage {
                  large
                }
                relations {
                  edges {
                    relationType(version: 2)
                    node {
                      id
                      title {
                        english
                        romaji
                      }
                      startDate {
                        year
                        month
                        day
                      }
                      type
                      format
                      episodes
                      duration
                      description
                      coverImage {
                        large
                      }
                    }
                  }
                }
              }
            }
          }
        `,
        variables: { search: tmdbTitle }
      };

      try {
        const result = await fetchWithRetry(`${BASE_URL}/pigo-stream/playground/anime-info`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(query)
        });

        const candidates = result?.data?.Page?.media || [];

        const matched = matchAniMediaByTitleAndDate(candidates, tmdbTitle, tmdbDate);
        if (!matched) throw new Error('No matching anime found');

        const chain = extractChronologicalChain(matched);

        setAnimeInfo(chain);
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