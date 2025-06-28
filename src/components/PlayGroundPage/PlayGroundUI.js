// PlayGroundUI.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useFetchMediaInfo from '../../hooks/PlayGroundPage/useFetchMediaInfo';
import useFetchAnimeInfo from '../../hooks/PlayGroundPage/useFetchAnimeInfo';
import Header from '../Header';
import PlayGroundFooter from './PlayGroundFooter';
import ReCaptcha from './ReCaptcha';
import MovieGrid from './MovieGrid';
import TvGrid from './TvGrid';
import AnimeGrid from './AnimeGrid';
import OverlaySpinner from '../../utils/OverlaySpinner';
import ConnectionModal from '../../utils/ConnectionModal';

import { getStorageValue } from '../../utils/localStorageStates';

function PlayGround() {
  const STORAGE_PATH = ['PlayGroundUI'];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const type = queryParams.get('type');

  // Initialize Media URL
  const [mediaURL, setMediaURL] = useState(null);

  // Retrive full TMDB metadata of the id and type
  const { data: mediaInfo, loading: isMediaLoading, error: isMediaError } = useFetchMediaInfo(id, type);

  // Anime info via AniList if applicable
  const { data: animeInfo, loading: isAnimeLoading, error: isAnimeError } = useFetchAnimeInfo(mediaInfo);

  const isLoading = isMediaLoading || isAnimeLoading;
  const isError = isMediaError || isAnimeError;

  // Setup backgroundImage
  const [backgroundImage, setBackgroundImage] = useState('');

  const isCaptchaVerified = getStorageValue(...STORAGE_PATH, 'recaptchaVerified') === true;

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
      {!isCaptchaVerified ? (
        <ReCaptcha storagePath={STORAGE_PATH} />
      ) : (
        <>
          {mediaInfo && animeInfo && !isLoading && !isError && (
            <AnimeGrid
              id={id}
              type={type}
              mediaInfo={mediaInfo}
              animeInfo={animeInfo}
              setMediaURL={setMediaURL}
              setBackgroundImage={setBackgroundImage}
            />
          )}

          {mediaInfo && !animeInfo && !isLoading && !isError && (
            <GridComponent
              id={id}
              type={type}
              mediaInfo={mediaInfo}
              setMediaURL={setMediaURL}
              setBackgroundImage={setBackgroundImage}
            />
          )}
        </>
      )}

      {/* Connection Modal */}
      {isError && <ConnectionModal show={isError} />}

      {/* Backspace & PlayGroundFooter */}
      <div className="divider" style={{ height: '6rem' }}></div>
      <PlayGroundFooter id={id} type={type} mediaURL={mediaURL} />
    </div>
  );
}

export default PlayGround;