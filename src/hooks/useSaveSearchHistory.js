import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase-auth';

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
          throw new Error('Failed to save search history');
        }

        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error('Error saving search:', error.message);
      }
    }
  };

  return saveSearchHistory;
};

export default useSaveSearchHistory;