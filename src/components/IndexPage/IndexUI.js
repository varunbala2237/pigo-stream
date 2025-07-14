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

  return (
    <div className="index-page">
      <div
        className="background-image"
        style={{
          backgroundImage: backgroundImage
            ? `linear-gradient(to bottom, rgba(18, 18, 18, 0.2), #121212), url(${backgroundImage})`
            : 'none',
        }}
      >
        {/* Dark Overlay */}
        <div className="background-overlay"></div>
      </div>

      {/* HomeUI */}
      <HomeUI
        title={title}
        mediaId={mediaId}
        mediaType={mediaType}
        mediaDesc={mediaDesc}
        rating={rating}
        year={year}
        isRecommended={isRecommended}
        isIndexError={isError}
      />
    </div>
  );
};

export default IndexUI;