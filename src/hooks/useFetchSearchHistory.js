import { useState, useEffect, useCallback } from 'react';
import { auth } from '../firebase/firebase-auth';

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

const useFetchSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [userUID, setUserUID] = useState(null); // State to store userUID

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

  const fetchSearchHistory = useCallback(async () => {
    if (userUID) {
      try {
        const response = await fetch(`${BASE_URL}/users/search-history/${userUID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch search history');
        }

        const data = await response.json();
        setSearchHistory(data); // Directly set data if it's an array of objects
      } catch (error) {
        console.error('Error fetching search history:', error.message);
      }
    }
  }, [userUID]);

  // Fetch search history when userUID changes
  useEffect(() => {
    fetchSearchHistory();
  }, [userUID, fetchSearchHistory]);

  return { searchHistory, refetch: fetchSearchHistory };
};

export default useFetchSearchHistory;