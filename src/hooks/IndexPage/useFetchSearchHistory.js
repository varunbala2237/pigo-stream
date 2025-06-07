import { useState, useEffect, useCallback } from 'react';
import { auth } from '../../firebase/firebase-auth';

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

const useFetchSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const [userUID, setUserUID] = useState(null); // State to store userUID
  const [error, setError] = useState(null); // State to capture error messages

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
        const response = await fetch(`${BASE_URL}/index/fetch-search-history/${userUID}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Unable to fetch data. Please try again later.');
        }

        const data = await response.json();
        setSearchHistory(data); // Directly set data if it's an array of objects
      } catch (err) {
        setError(err.message);
      }
    }
  }, [userUID]);

  // Fetch search history when userUID changes
  useEffect(() => {
    fetchSearchHistory();
  }, [userUID, fetchSearchHistory]);

  return { searchHistory, error, refetch: fetchSearchHistory };
};

export default useFetchSearchHistory;