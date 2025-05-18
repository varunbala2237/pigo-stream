import React, { useState, useEffect } from 'react';
import Header from '../Header';
import MyListGrid from './MyListGrid';
import { auth } from '../../firebase/firebase-auth'; // Import the auth object
import Footer from '../Footer';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

function MyListUI() {
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

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center poppins-medium p-0">
      <div className="w-100">
        {/* Header */}
        <Header />

        {/* MyListGrid */}
        <div className="flex-row text-white w-100">
          {userUID ? <><MyListGrid userUID={userUID} /></> : null}
        </div>
        
        {/* Footer Backspace */}
        <div className="divider" style={{ height: '4rem' }}></div>
        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default MyListUI;