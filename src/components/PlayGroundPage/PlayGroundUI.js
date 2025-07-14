// PlayGroundUI.js
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import useFetchMediaInfo from '../../hooks/PlayGroundPage/useFetchMediaInfo';
import useFetchAnimeInfo from '../../hooks/PlayGroundPage/useFetchAnimeInfo';
import Header from '../Header';
import Footer from '../Footer';
import ReCaptcha from './ReCaptcha';
import MovieGrid from './MovieGrid';
import TvGrid from './TvGrid';
import AnimeGrid from './AnimeGrid';
import OverlaySpinner from '../../utils/OverlaySpinner';
import ErrorModal from '../../utils/ErrorModal';
import './PlayGroundUI.css';

import { getStorageValue } from '../../utils/localStorageStates';

const PlayGround = () => {
  const STORAGE_PATH = ['PlayGroundUI'];

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const id = queryParams.get('id');
  const type = queryParams.get('type');
  const tab = queryParams.get('tab');

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
            ? `linear-gradient(to bottom, rgba(18, 18, 18, 0), #121212), url(${backgroundImage})`
            : 'none',
        }}
      >
        {/* Dark Overlay */}
        <div className="background-overlay"></div>
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
              tab={tab}
              mediaInfo={mediaInfo}
              animeInfo={animeInfo}
              setBackgroundImage={setBackgroundImage}
            />
          )}

          {mediaInfo && !animeInfo && !isLoading && !isError && (
            <GridComponent
              id={id}
              type={type}
              tab={tab}
              mediaInfo={mediaInfo}
              setBackgroundImage={setBackgroundImage}
            />
          )}
        </>
      )}

      {/* Error Modal */}
      {isError && <ErrorModal error={isError} />}

      {/* Footer Backspace */}
      <div className="divider" style={{ height: '6rem' }}></div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

export default PlayGround;