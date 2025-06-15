// WatchHistoryUI.js
import { useState, useEffect } from 'react';
import Header from '../Header';
import WatchHistoryGrid from './WatchHistoryGrid';
import { auth } from '../../firebase/firebase-auth'; // Import the auth object
import Footer from '../Footer';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

function WatchHistoryUI() {
  const [userUID, setUserUID] = useState(null);

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

  // Restoring page states
  useEffect(() => {
    const savedScrollPosition = getSessionValue('WatchHistoryUI', 'pageScrollState') || 0;

    if (savedScrollPosition) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollPosition, behavior: 'instant' });
      });
    }

    const handlePageScroll = () => {
      const scrollPosition = window.scrollY;
      setSessionValue('WatchHistoryUI', 'pageScrollState', scrollPosition);
    };

    window.addEventListener('scroll', handlePageScroll);
    return () => {
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, []);

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center p-0">
      <div className="w-100">
        {/* Header */}
        <Header />

        {/* WatchHistoryGrid */}
        <WatchHistoryGrid userUID={userUID} />

        {/* Footer Backspace */}
        <div className="divider" style={{ height: '6rem' }}></div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default WatchHistoryUI;