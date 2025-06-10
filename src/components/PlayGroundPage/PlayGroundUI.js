// PlayGroundUI.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../Header';
import MovieGrid from './MovieGrid';
import ShowGrid from './ShowGrid';
import Footer from '../Footer';

function PlayGround() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const type = queryParams.get('type');

  // Setup backgroundImage
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    // Initial scroll to top
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, []);

  const GridComponent = type === 'movie' ? MovieGrid : ShowGrid;

  return (
    <div className="index-page inter-regular">
      <Header />
      <div className="container-fluid d-flex flex-column justify-content-center align-items-center">
        <div
          className="background-image"
          style={{
            backgroundImage: backgroundImage
              ? `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgb(0, 0, 0)), url(${backgroundImage})`
              : 'none',
          }}
        >
          {/* Dark Overlay */}
          <div
            className="position-absolute w-100 h-100"
            style={{
              top: 0,
              left: 0,
              background: 'rgba(0, 0, 0, 0.4)',
              zIndex: 1,
            }}
          ></div>
        </div>
        <GridComponent id={id} type={type} setBackgroundImage={setBackgroundImage} />

        {/* Footer Backspace & Footer */}
        <div className="divider" style={{ height: '4rem' }}></div>
        <Footer />
      </div>
    </div>
  );
}

export default PlayGround;