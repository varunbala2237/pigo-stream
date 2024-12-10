import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import MovieGrid from './MovieGrid'
import TvGrid from './TvGrid'

function PlayGround() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    const type = queryParams.get('type');

    // Setup backgroundImage
    const [backgroundImage, setBackgroundImage] = useState('');

    useEffect(() => {
      // Initial scroll to top
      window.scrollTo({ top: 0 });
    }, []);

    return (
          <>
            {type === 'movie' ? (
              <>
              <div className="index-page">
                <div
                  className="background-image"
                  style={{
                          backgroundImage: backgroundImage
                          ? `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgb(0, 0, 0)), url(${backgroundImage})`
                          : 'none',
                        }}
                ></div>
                <MovieGrid id={id} type={type} setBackgroundImage={setBackgroundImage} />
              </div>
              </>
            ) : (
              <>
              <div className="index-page">
                <div
                  className="background-image"
                  style={{
                          backgroundImage: backgroundImage
                          ? `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgb(0, 0, 0)), url(${backgroundImage})`
                          : 'none',
                        }}
                ></div>
                <TvGrid id={id} type={type} setBackgroundImage={setBackgroundImage} />
              </div>
              </>
            )}
        </>
      );
}

export default PlayGround;