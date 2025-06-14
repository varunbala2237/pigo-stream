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

  // Setup backgroundImage
  const [backgroundImage, setBackgroundImage] = useState('');

  // Store the mapped AniList data
  const [animeMediaInfo, setAnimeMediaInfo] = useState(null);

  useEffect(() => {
    // Initial scroll to top
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, []);

  // Fetch AniList mapping once TMDB mediaInfo is ready
  useEffect(() => {
    if (mediaInfo) {
      (async () => {
        try {
          const result = await mapMedia(mediaInfo);
          setAnimeMediaInfo(result);
          console.log('🧠 AniList Media Info:', result); // ✅ Log the mapped result
        } catch (err) {
          console.error('Failed to fetch AniList data:', err);
        }
      })();
    }
  }, [mediaInfo]);

  // Handling loading state and error state
  if (isLoading || isError) {
    return isError ? (
      <ConnectionModal show={isError} />
    ) : (
      <OverlaySpinner visible={isLoading} />
    );
  }

  // Decide which GridComponent to render
  const GridComponent = type === 'movie' ? MovieGrid : TvGrid;

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