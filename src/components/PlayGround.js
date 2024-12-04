import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import MovieGrid from './MovieGrid'
import TvGrid from './TvGrid'
import Footer from './Footer';

function PlayGround() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const type = queryParams.get('type');

    useEffect(() => {
      // Initial scroll to top
      window.scrollTo({ top: 0 });
    }, []);

    return (
        <div className="container-fluid d-flex flex-column justify-content-center align-items-center poppins-medium">
          <Header/>
          <div className="flex-row text-white custom-w-size-100">
            {type === 'movie' ? (
              <MovieGrid id={id} type={type} />
            ) : (
              <TvGrid id={id} type={type} />
            )}
          </div>
          <Footer/>
        </div>
      );
}

export default PlayGround;