import React, { useState, useEffect } from 'react';
import Header from './Header';
import MyListGrid from './MyListGrid';
import Footer from './Footer';
import { auth } from '../firebase/firebase-auth'; // Import the auth object

function MyListPage() {
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

    useEffect(() => {
        // Retrieve the saved page state from sessionStorage
        const savedPageState = sessionStorage.getItem('myListPageState');
        if (savedPageState) {
          const { savedScrollPosition } = JSON.parse(savedPageState);
          if (savedScrollPosition !== undefined) {
            // Delay the scroll action to ensure the DOM is fully rendered
            setTimeout(() => {
              window.scrollTo({ top: savedScrollPosition });
            }, 500);
          }
        }
    
        const handleScroll = () => {
          const scrollPosition = window.scrollY;
          updateLocalStorage(scrollPosition);
        };
    
        window.addEventListener('scroll', handleScroll);
        return () => {
          window.removeEventListener('scroll', handleScroll);
        };
      }, []);

    const updateLocalStorage = (scrollPosition) => {
        const pageState = JSON.stringify({
          savedScrollPosition: scrollPosition,
        });
        sessionStorage.setItem('myListPageState', pageState);
    };

    return (
        <div className="container-fluid d-flex flex-column justify-content-center align-items-center poppins-medium p-0">
            <Header/>
            <div className="flex-row text-white w-100">
                {userUID ? <MyListGrid userUID={userUID} /> : null}
            </div>
            <Footer />
        </div>
    );
}

export default MyListPage;