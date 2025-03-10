import React, { useState, useEffect } from 'react';
import useRecommendations from '../hooks/useRecommendations';
import useFetchMediaDetails from '../hooks/useFetchMediaDetails';
import useFetchMedia from '../hooks/useFetchMedia';
import HomePage from './HomePage';

const IndexPage = () => {
  const { selectedItemId } = useRecommendations();
  const { data: recommendedMedia, loading: loadingRecommendedMedia } = useFetchMediaDetails(selectedItemId);
  const { data: popularMovies, loading: loadingPopularMovies } = useFetchMedia('popular', 'movie');

  const [backgroundImage, setBackgroundImage] = useState(null);
  const [isRecommended, setIsRecommended] = useState(false);
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [triggerSearch, setTriggerSearch] = useState('');

  useEffect(() => {
    const getImagePath = (media) => {
      return media.backdrop_path || media.poster_path
        ? `https://image.tmdb.org/t/p/original${media.backdrop_path || media.poster_path}`
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

  // Extract details for movie or TV show from either recommendation or popular movie
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
          ? `linear-gradient(to bottom, rgba(0, 0, 0, 0), rgb(0, 0, 0)), url(${backgroundImage})`
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
            background: 'rgba(0, 0, 0, 0.6)', // Dark overlay with transparency
            zIndex: 1, // Behind content
          }}
          ></div>
        )}
      </div>

      <HomePage
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
      />
    </div>
  );
};

export default IndexPage;