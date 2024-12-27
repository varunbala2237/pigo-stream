import { useEffect } from 'react';
import { auth } from '../firebase/firebase-auth';

// Base URL of server
const BASE_URL = process.env.REACT_APP_SERVER_URL;

const useCreateUser = () => {
  useEffect(() => {
    const initializeUserCollections = async (userUID) => {
      try {
        const response = await fetch(`${BASE_URL}/users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userUID }),
        });

        if (!response.ok) {
          throw new Error('Unable to fetch data. Please try again later.');
        }

        await response.json();
      } catch (err) {
        throw new Error('Failed to fetch data. Please check your connection or contact support.');
      }
    };

    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        initializeUserCollections(user.uid);
      }
    });

    return () => unsubscribe();
  }, []);
};

export default useCreateUser;