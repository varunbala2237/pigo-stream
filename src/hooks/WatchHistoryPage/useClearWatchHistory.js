// useClearWatchHistory.js
import { useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase-auth'; // Import the auth object

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Helper function for clearing watch history from the server
const clearWatchHistory = async (userUID) => {
  try {
    const response = await fetch(`${BASE_URL}/watch-history/remove-all-watch-history`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userUID }),
    });
  
    if (!response.ok) {
      throw new Error('Unable to fetch data. Please try again later.');
    }
  } catch (err) {
    throw new Error('Failed to fetch data. Server is not responding.');
  }
};

// Custom hook for clearing watch history
const useClearWatchHistory = () => {
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

  const clearHistory = async () => {
    if (!userUID) {
      setError('User is not authenticated');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await clearWatchHistory(userUID);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { clearHistory, loading, error };
};

export default useClearWatchHistory;