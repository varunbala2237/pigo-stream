// IndexUI.js
import { useState, useEffect } from 'react';
import useGenreRecommendations from '../../hooks/IndexPage/useGenreRecommendations';
import useFetchMediaDetails from '../../hooks/IndexPage/useFetchMediaDetails';
import useFetchMedia from '../../hooks/IndexPage/useFetchMedia';
import HomeUI from './HomeUI';
import './IndexUI.css';

const IndexUI = () => {
  const { selectedItemId } = useGenreRecommendations();
  const { data: recommendedMedia, loading: loadingRecommendedMedia, error: errorRecommendedMedia } = useFetchMediaDetails(selectedItemId);
  const { data: popularMovies, loading: loadingPopularMovies, error: errorPopularMovies } = useFetchMedia('popular', 'movie');

  const isError = errorRecommendedMedia || errorPopularMovies;

  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isRecommended, setIsRecommended] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState('');

  useEffect(() => {
    const getImagePath = (media) => {
      return media.backdrop_path || media.poster_path
        ? `https://image.tmdb.org/t/p/w1280${media.backdrop_path || media.poster_path}`
        : null;
    };

    if (!loadingRecommendedMedia && recommendedMedia) {
      setBackgroundImage(getImagePath(recommendedMedia));
      setIsRecommended(true);
    } else if (!loadingPopularMovies && popularMovies.length > 0) {
      const latestMovie = popularMovies[0];
      setBackgroundImage(getImagePath(latestMovie));
      setIsRecommended(false);
    }
  }, [recommendedMedia, popularMovies, loadingRecommendedMedia, loadingPopularMovies]);

  useEffect(() => {
    // Save state to localStorage whenever it changes
    localStorage.setItem('showSearchBar', JSON.stringify(showSearchBar));
    localStorage.setItem('triggerSearch', triggerSearch);
  }, [showSearchBar, triggerSearch]);

  // Extract details for movie or show from either recommendation or popular movie
  const mediaDetails = recommendedMedia || (popularMovies.length > 0 ? popularMovies[0] : {});
  const mediaId = mediaDetails.id || selectedItemId;
  const title = mediaDetails.title || mediaDetails.name || null;
  const mediaType = mediaDetails.type || (mediaDetails.title ? 'movie' : 'tv');
  const mediaDesc = mediaDetails.overview || 'No description available';
  const rating = mediaDetails.vote_average ? mediaDetails.vote_average.toFixed(1) : '0.0';
  const year = mediaDetails.release_date
    ? new Date(mediaDetails.release_date).getFullYear()
    : mediaDetails.first_air_date
      ? new Date(mediaDetails.first_air_date).getFullYear()
      : 'N/A';

  const shouldHideBackground = showSearchBar || triggerSearch.trim() !== '';

  return (
    <div className="index-page">
      <div
        className="background-image"
        style={{
          background: shouldHideBackground ? 'transparent' : undefined,
          backgroundImage: shouldHideBackground
            ? 'none' // Hide background when search is active or query exists
            : backgroundImage
              ? `linear-gradient(to bottom, rgba(18, 18, 18, 0), #121212), url(${backgroundImage})`
              : 'none',
        }}
      >
        {/* Dark Overlay */}
        {!shouldHideBackground && (
          <div
            className="position-absolute w-100 h-100"
            style={{
              top: 0,
              left: 0,
              background: 'rgba(18, 18, 18, 0.5)',
              zIndex: 1,
              backdropFilter: 'blur(4px)',
              WebkitBackdropFilter: 'blur(4px)',
            }}
          ></div>
        )}
      </div>

      {/* HomeUI */}
      <HomeUI
        title={title}
        mediaId={mediaId}
        mediaType={mediaType}
        mediaDesc={mediaDesc}
        rating={rating}
        year={year}
        showSearchBar={showSearchBar}
        setShowSearchBar={setShowSearchBar}
        triggerSearch={triggerSearch}
        setTriggerSearch={setTriggerSearch}
        isRecommended={isRecommended}
        isIndexError={isError}
      />
    </div>
  );
};

export default IndexUI;