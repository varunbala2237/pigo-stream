// useGenreRecommendations.js
import { useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase-auth'; // Import the auth object
import useFetchWatchHistory from '../WatchHistoryPage/useFetchWatchHistory';

// Server 1 Base URL
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

const useGenreRecommendations = () => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [userUID, setUserUID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch the history of recently watched movie and show based on user UID
  const { data: watchHistory } = useFetchWatchHistory(userUID, 1, 1);

  // Fetch the authenticated user's UID
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

  // Fetch recommendations based on userUID
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!userUID) {
        setLoading(false);
        setError('User is not authenticated');
        return;
      }

      const url2 = `${BASE_URL}/pigo-stream/recommender/user_recommendations?user_id=${userUID}`;

      try {
        const recommendations = await fetchWithRetry(url2);

        // Step 1: Fetch media details for each recommendation
        const mediaDetailsPromises = recommendations.map(async (itemId) => {
          const url1 = `${BASE_URL}/pigo-stream/media-details?id=${itemId}`;
          const result = await fetchWithRetry(url1);
          return result;
        });

        // Step 2: Wait for all media details to be fetched
        const mediaDetails = await Promise.all(mediaDetailsPromises);

        // Step 3: Filter out items with bad ratings (less than 5)
        const filteredItems = mediaDetails.filter(item => item.vote_average >= 6);

        // Step 4: Match genres between watchHistory and recommended items
        const selectedItemIds = [];

        // Pre-calculate the genres for movies and shows from watchHistory
        const moviesHistory = watchHistory.moviesHistory || [];
        const showsHistory = watchHistory.showsHistory || [];

        // Create lists of genre names for movie and show history
        const movieGenres = moviesHistory.flatMap((movie) => movie.genres.map((genre) => genre.name));
        const showGenres = showsHistory.flatMap((show) => show.genres.map((genre) => genre.name));

        // Normalize genre names to lowercase and trimmed
        const normalizeGenres = (genres) => genres.map((genre) => genre.toLowerCase().trim());

        const normalizedMovieGenres = normalizeGenres(movieGenres);
        const normalizedShowGenres = normalizeGenres(showGenres);

        filteredItems.forEach(item => {
          const itemGenres = item.genres.map((genre) => genre.name) || [];

          // Normalize the item genres
          const normalizedItemGenres = normalizeGenres(itemGenres);

          // Check if any genre from the item matches any genre from the watched media
          const matchingGenres = normalizedItemGenres.filter(genre => normalizedMovieGenres.includes(genre) || normalizedShowGenres.includes(genre));

          // If there is a genre match, add the item ID to the selected list
          if (matchingGenres.length > 0) {
            selectedItemIds.push({
              id: item.id,
              matchCount: matchingGenres.length, // Track number of matching genres for sorting
              rating: item.vote_average, // Add rating to compare later
            });
          }
        });

        // Step 5: If there are selected item IDs, randomly pick one from the best selected items
        if (selectedItemIds.length > 0) {
          // Sort by matchCount (descending) and rating (descending)
          selectedItemIds.sort((a, b) => b.matchCount - a.matchCount || b.rating - a.rating);

          // Pick a random item from the sorted best ones
          const randomIndex = Math.floor(Math.random() * selectedItemIds.length);
          setSelectedItemId(selectedItemIds[randomIndex].id); // Set the final selected item ID
        } else {
          setSelectedItemId(null); // No item selected if no match
        }

      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userUID, watchHistory]);

  return { selectedItemId, loading, error };
};

export default useGenreRecommendations;