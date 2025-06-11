// useRemoveSearchHistory.js
import { useState, useEffect } from 'react';
import { auth } from '../../firebase/firebase-auth';

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

const useRemoveSearchHistory = () => {
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

  const removeSearchHistory = async (id) => {
    if (userUID) {
      try {
        const response = await fetch(`${BASE_URL}/pigo-stream/index/${userUID}/remove-search-history/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Unable to fetch data. Please try again later.');
        }

        await response.json();
      } catch (error) {
        throw new Error('Failed to fetch data. Server is not responding.');
      }
    }
  };

  return removeSearchHistory;
};

export default useRemoveSearchHistory;