// useRemoveMyList.js
import { useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase-auth'; // Import the auth object

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

// Helper function for deleting my list from the server
const removeMyList = async (userUID, id, type) => {
  try {
    const response = await fetch(`${BASE_URL}/my-list/remove-my-list`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userUID, id, type }),
    });
    if (!response.ok) {
      throw new Error(`Unable to fetch data. Please try again later.`);
    }
  } catch (err) {
    throw new Error(`Failed to fetch data. Please check your connection or contact support.`);
  }
};

// Custom hook for deleting my list
const useRemoveMyList = () => {
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

  const removeFromList = async (id, type) => {
    if (!userUID) {
      setError('User is not authenticated');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await removeMyList(userUID, id, type);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return { removeFromList, loading, error };
};

export default useRemoveMyList;