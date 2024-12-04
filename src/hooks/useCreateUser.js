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
        const data = await response.json();
        console.log(data.message);
      } catch (error) {
        console.error('Error initializing user collections:', error.message);
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