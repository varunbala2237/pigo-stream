import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import MovieGrid from './MovieGrid';
import TvGrid from './TvGrid';

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

  const GridComponent = type === 'movie' ? MovieGrid : TvGrid;

  return (
    <div className="index-page">
      <Header />
      <div className="container-fluid d-flex flex-column justify-content-center align-items-center poppins-medium">
        <div
          className="background-image"
          style={{
            backgroundImage: backgroundImage
              ? `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgb(0, 0, 0)), url(${backgroundImage})`
              : 'none',
          }}
        ></div>
        <GridComponent id={id} type={type} setBackgroundImage={setBackgroundImage} />
      </div>
    </div>
  );
}

export default PlayGround;