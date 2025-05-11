import { useState, useEffect, useCallback } from 'react';
import { auth } from '../../firebase/firebase-auth';
import useFetchWatchHistory from '../WatchHistoryPage/useFetchWatchHistory';

const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Valid list of genres for movies
const validMovieGenres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

// Valid list of genres for TV shows
const validTVGenres = [
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 99, name: 'Documentary' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 36, name: 'History' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 37, name: 'Western' },
];

// Fetch with retry helper function
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

const useGenre = () => {
  const [userUID, setUserUID] = useState(null);
  const [recommendations, setRecommendations] = useState({ movies: [], tvShows: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMovieGenre, setSelectedMovieGenre] = useState('');
  const [selectedTVGenre, setSelectedTVGenre] = useState('');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUserUID(user.uid);
      } else {
        setUserUID(null);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch the latest watched movie and TV show (limit 1 for both)
  const { data: watchHistory, loading: historyLoading, error: historyError } = useFetchWatchHistory(userUID, 1, 1);

  const fetchGenreRecommendations = useCallback(async () => {
    let selectedMovieGenreId = null;
    let selectedTVGenreId = null;

    // If watch history is empty, select random genres
    if (!watchHistory || (!watchHistory.movieHistory.length && !watchHistory.tvHistory.length)) {
      const randomMovieGenre = validMovieGenres[Math.floor(Math.random() * validMovieGenres.length)];
      const randomTVGenre = validTVGenres[Math.floor(Math.random() * validTVGenres.length)];

      selectedMovieGenreId = randomMovieGenre.id;
      selectedTVGenreId = randomTVGenre.id;

      setSelectedMovieGenre(randomMovieGenre.name);
      setSelectedTVGenre(randomTVGenre.name);
    } else {
      // Select genre from the latest watched movie
      if (watchHistory.movieHistory.length > 0) {
        const movie = watchHistory.movieHistory[0];
        const movieGenreId = movie.genres[0]?.id;
        const isValidMovieGenre = validMovieGenres.some((genre) => genre.id === movieGenreId);
        selectedMovieGenreId = isValidMovieGenre ? movieGenreId : validMovieGenres[Math.floor(Math.random() * validMovieGenres.length)].id;
        setSelectedMovieGenre(validMovieGenres.find((genre) => genre.id === selectedMovieGenreId)?.name || '');
      }

      // Select genre from the latest watched TV show
      if (watchHistory.tvHistory.length > 0) {
        const tvShow = watchHistory.tvHistory[0];
        const tvGenreId = tvShow.genres[0]?.id;
        const isValidTVGenre = validTVGenres.some((genre) => genre.id === tvGenreId);
        selectedTVGenreId = isValidTVGenre ? tvGenreId : validTVGenres[Math.floor(Math.random() * validTVGenres.length)].id;
        setSelectedTVGenre(validTVGenres.find((genre) => genre.id === selectedTVGenreId)?.name || '');
      }
    }

    try {
      setLoading(true);
      // Send separate requests for movie and TV show recommendations with retry logic
      const [movieData, tvData] = await Promise.all([
        fetchWithRetry(`${BASE_URL}/recommend-genre?genre=${selectedMovieGenreId}&type=movie`),
        fetchWithRetry(`${BASE_URL}/recommend-genre?genre=${selectedTVGenreId}&type=tv`),
      ]);

      setRecommendations({
        movies: movieData.results,
        tvShows: tvData.results,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [watchHistory]);

  useEffect(() => {
    fetchGenreRecommendations();
  }, [fetchGenreRecommendations]);

  return {
    recommendations, // Contains `movies` and `tvShows`
    selectedMovieGenre,
    selectedTVGenre,
    loading: loading || historyLoading,
    error: error || historyError,
  };
};

export default useGenre;