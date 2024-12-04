import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase-auth'; // Import the auth object

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Helper function for sending watch history to the server
const saveWatchHistory = async (userUID, id, type) => {
  const response = await fetch(`${BASE_URL}/users/save-watch-history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userUID, id, type }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to save history: ${errorText}`);
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
      await saveWatchHistory(userUID, id, type);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { addToHistory, loading, error };
};

export default useSaveWatchHistory;