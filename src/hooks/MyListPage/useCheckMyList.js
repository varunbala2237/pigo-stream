// useCheckMyList.js
import { useState, useEffect } from 'react';
import useFetchMyList from '../MyListPage/useFetchMyList'; // Import the fetch hook
import { auth } from '../../firebase/firebase-config';

const useCheckMyList = (id, type) => {
  const [isInList, setIsInList] = useState(false);
  const [userUID, setUserUID] = useState(null);

  // Fetch userUID when authentication state changes
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

  // Use the custom hook to fetch the user's my-list
  const { data, loading, error, refetch } = useFetchMyList(userUID);

  // Check if the item is in the list once data is fetched
  useEffect(() => {
    if (!loading && data) {
      const isInList = data.moviesList.some(item => item.id.toString() === id.toString()) ||
                       data.showsList.some(item => item.id.toString() === id.toString());
      setIsInList(isInList);
    }
  }, [data, loading, id, type]);

  return { isInList, loading, error, refetch };
};

export default useCheckMyList;