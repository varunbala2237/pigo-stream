import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase-auth'; // Import the auth object

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Helper function for sending watch history to the server
const saveWatchHistory = async (userUID, id, type) => {
  try {
    const response = await fetch(`${BASE_URL}/users/save-watch-history`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userUID, id, type }),
    });
    if (!response.ok) {
      throw new Error(`Unable to fetch data. Please try again later.`);
    }
  } catch (err) {
    throw new Error('Failed to fetch data. Please check your connection or contact support.');
  }
};

// Helper function for sending data to the second server
const sendWatchDataToNewServer = async (userUID, id) => {
  try {
    const response = await fetch(`${BASE_URL}/recommender/insert`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: userUID, item_id: id, watched: true }),
    });
    if (!response.ok) {
      throw new Error(`Unable to fetch data. Please try again later.`);
    }
  } catch (err) {
    throw new Error('Failed to fetch data. Please check your connection or contact support.');
  }
};

// Custom hook for saving watch history
const useSaveWatchHistory = () => {
  const [userUID, setUserUID] = useState(null); // State to store userUID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  const addToHistory = async (id, type) => {
    if (!userUID) {
      setError('User is not authenticated');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      // Save history to the first server
      await saveWatchHistory(userUID, id, type);

      // Save history to the second server
      await sendWatchDataToNewServer(userUID, id);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addToHistory, loading, error };
};

export default useSaveWatchHistory;