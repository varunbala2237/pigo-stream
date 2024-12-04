import { useState, useEffect } from 'react';
import { auth } from '../firebase/firebase-auth';

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
        const response = await fetch(`${BASE_URL}/users/${userUID}/remove-search-history/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to remove search history');
        }

        const data = await response.json();
        console.log(data.message); // Log success message
      } catch (error) {
        console.error('Error removing search:', error.message);
      }
    }
  };

  return removeSearchHistory;
};

export default useRemoveSearchHistory;