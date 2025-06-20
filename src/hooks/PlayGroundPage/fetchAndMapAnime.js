// fetchAndMapAnime.js
import { validateTitleMatch, validateDateMatch, extractRelatedMedia } from '../utils/animeUtils';

const BASE_URL = process.env.REACT_APP_SERVER_URL;

const fetchWithRetry = async (url, options = {}, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Fetch failed');
      return await response.json();
    } catch (err) {
      if (i < retries - 1) await new Promise(r => setTimeout(r, delay));
      else throw err;
    }
  }
};

const fetchAndMapAnime = async (mediaInfo) => {
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
                }
              }
            }
          }
        }
      }
    `,
    variables: { search: tmdbTitle }
  };

  const result = await fetchWithRetry(`${BASE_URL}/pigo-stream/playground/anime-info`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(query)
  });

  const candidates = result?.data?.Page?.media || [];

  const matched = candidates.find(media =>
    validateTitleMatch(tmdbTitle, media.title.english, media.title.romaji) &&
    validateDateMatch(tmdbDate, media.startDate)
  );

  if (!matched) throw new Error('No matching anime found.');

  return extractRelatedMedia(matched);
};

export default fetchAndMapAnime;