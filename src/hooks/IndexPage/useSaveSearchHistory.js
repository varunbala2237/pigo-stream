import { useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase-auth';

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

const useSaveSearchHistory = () => {
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

  const saveSearchHistory = async (searchQuery) => {
    if (userUID) {
      try {
        const response = await fetch(`${BASE_URL}/users/save-search-history`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userUID, searchQuery }),
        });
        
        if (!response.ok) {
          throw new Error('Unable to fetch data. Please try again later.');
        }

        await response.json();
      } catch (error) {
        throw new Error('Failed to fetch data. Please check your connection or contact support.');
      }
    }
  };

  return saveSearchHistory;
};

export default useSaveSearchHistory;