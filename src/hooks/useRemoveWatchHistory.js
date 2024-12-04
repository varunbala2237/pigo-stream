import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase-auth'; // Import the auth object

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Helper function for deleting watch history from the server
const removeWatchHistory = async (userUID, id, type) => {
  const response = await fetch(`${BASE_URL}/users/remove-watch-history`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userUID, id, type }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to remove history: ${errorText}`);
  }
};

// Custom hook for deleting watch history
const useRemoveWatchHistory = () => {
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

  const removeFromHistory = async (id, type) => {
    if (!userUID) {
      setError('User is not authenticated');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await removeWatchHistory(userUID, id, type);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { removeFromHistory, loading, error };
};

export default useRemoveWatchHistory;