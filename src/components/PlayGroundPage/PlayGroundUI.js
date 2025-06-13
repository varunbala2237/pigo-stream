// PlayGroundUI.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { mapMedia } from 'tmdb-to-anilist';
import useFetchMediaInfo from '../../hooks/PlayGroundPage/useFetchMediaInfo';
import Header from '../Header';
import MovieGrid from './MovieGrid';
import TvGrid from './TvGrid';
import AnimeGrid from './AnimeGrid';
import OverlaySpinner from '../../utils/OverlaySpinner';
import ConnectionModal from '../../utils/ConnectionModal';
import Footer from '../Footer';

function PlayGround() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const type = queryParams.get('type');

  // Retrive full tmdb metadata of the id and type
  const { data: mediaInfo, loading: isLoading, error: isError } = useFetchMediaInfo(id, type);
  const [animeMediaInfo, setAnimeMediaInfo] = useState(null);

  // Setup backgroundImage
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    // Initial scroll to top
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, []);

  useEffect(() => {
    if (mediaInfo) {
      const result = mapMedia(mediaInfo);
      console.log('[AniList Mapping Result]', result);
      if (result) setAnimeMediaInfo(result);
      else setAnimeMediaInfo(null);
    }
  }, [mediaInfo]);

  if (!mediaInfo) {
    // Handling loading state and error state
    if (isError) {
      return (
        <ConnectionModal show={isError} />
      );
    } else {
      return (
        <OverlaySpinner visible={isLoading} />
      );
    }
  }

  let GridComponent;

  if (animeMediaInfo && Array.isArray(animeMediaInfo)) {
    GridComponent = AnimeGrid;
  } else {
    GridComponent = type === 'movie' ? MovieGrid : TvGrid;
  }

  return (
    <div className="index-page">
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

        {/* Grid Components */}
        <GridComponent
          id={id}
          type={type}
          mediaInfo={mediaInfo}
          animeMediaInfo={animeMediaInfo}
          setBackgroundImage={setBackgroundImage}
        />

        {/* Footer Backspace & Footer */}
        <div className="divider" style={{ height: '4rem' }}></div>
        <Footer />
      </div>
    </div>
  );
}

export default PlayGround;