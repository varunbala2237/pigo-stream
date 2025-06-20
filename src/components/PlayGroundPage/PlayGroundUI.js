// PlayGroundUI.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useFetchMediaInfo from '../../hooks/PlayGroundPage/useFetchMediaInfo';
import useFetchAnimeInfo from '../../hooks/PlayGroundPage/useFetchAnimeInfo';
import Header from '../Header';
import MovieGrid from './MovieGrid';
import TvGrid from './TvGrid';
import OverlaySpinner from '../../utils/OverlaySpinner';
import ConnectionModal from '../../utils/ConnectionModal';

function PlayGround() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const type = queryParams.get('type');

  // Retrive full TMDB metadata of the id and type
  const { data: mediaInfo, loading: isLoading, error: isError } = useFetchMediaInfo(id, type);

  // Anime info via AniList if applicable
  const { data: animeInfo, loading: animeLoading, error: animeError } = useFetchAnimeInfo(mediaInfo);

  // Setup backgroundImage
  const [backgroundImage, setBackgroundImage] = useState('');

  useEffect(() => {
    // Initial scroll to top
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  }, []);

  // Decide which GridComponent to render
  const GridComponent = type === 'movie' ? MovieGrid : TvGrid;

  return (
    <div className="index-page">
      {/* Overlay spinner for loading state */}
      <OverlaySpinner visible={isLoading} />

      <Header />
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
      {mediaInfo != null && !isLoading && !isError &&
        <GridComponent
          id={id}
          type={type}
          mediaInfo={mediaInfo}
          setBackgroundImage={setBackgroundImage}
        />
      }

      {/* Connection Modal */}
      {isError && <ConnectionModal show={isError} />}

      {/* Footer was evacuated to there corresponding grids */}
    </div>
  );
}

export default PlayGround;