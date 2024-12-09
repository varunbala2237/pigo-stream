import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase-auth'; // Import the auth object

// Server 2 Base URL
const SERVER2_URL = process.env.REACT_APP_SERVER2_URL;

const fetchWithRetry = async (url, options = {}, retries = 5, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error('Network response was not ok');
      return await response.json();
    } catch (err) {
      if (i < retries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay));
      } else {
        throw err;
      }
    }
  }
};

const useRecommendations = () => {
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [userUID, setUserUID] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

      const url = `${SERVER2_URL}/user_recommendations?user_id=${userUID}`;
      try {
        const recommendations = await fetchWithRetry(url);
        if (recommendations.length > 0) {
          // Randomly select an item
          const randomItemId = recommendations[Math.floor(Math.random() * recommendations.length)];
          setSelectedItemId(randomItemId);
        } else {
          setSelectedItemId(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userUID]);

  return { selectedItemId, loading, error };
};

export default useRecommendations;