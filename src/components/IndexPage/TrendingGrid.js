import { React, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchMedia from '../../hooks/IndexPage/useFetchMedia';

function TrendingGrid({ setIsTrendingLoaded, setHasTrendingContent }) {
  const { data: movies, loading: isLoadingMovies, error: isErrorMovies } = useFetchMedia('trending', 'movie');
  const { data: shows, loading: isLoadingShows, error: isErrorShows } = useFetchMedia('trending', 'tv');

  const isLoading = isLoadingMovies || isLoadingShows;
  const isError = isErrorMovies || isErrorShows;
  const location = useLocation();

  // Scroll references for movies and TV shows
  const moviesRef = useRef(null);
  const showsRef = useRef(null);

  useEffect(() => {
    if (isError) {
      setIsTrendingLoaded(false);
    } else {
      setIsTrendingLoaded(true);
    }
  }, [isError, setIsTrendingLoaded]);

  useEffect(() => {
    if (!isLoading && !isError) {
      const hasContent =
        (movies && movies.length > 0) ||
        (shows && shows.length > 0);
      setHasTrendingContent(hasContent);
    }
  }, [isLoading, isError, movies, shows, setHasTrendingContent]);

  const scrollMovies = (direction) => {
    if (moviesRef.current) {
      moviesRef.current.scrollBy({
        left: direction === 'left' ? -450 : 450,
        behavior: 'smooth',
      });
    }
  };

  const scrollTvShows = (direction) => {
    if (showsRef.current) {
      showsRef.current.scrollBy({
        left: direction === 'left' ? -450 : 450,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="container mt-4 text-white">
      <div className="d-flex align-items-center dynamic-ts m-2 px-1">
        <i className="bi bi-fire theme-color me-2"></i>
        <b className="mb-0">Trending</b>
      </div>
      {/* Trending Movies Section */}
      {(
        <div className="position-relative my-2">
          {movies.filter(Boolean).length > 3 && (
            <>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
                onClick={() => scrollMovies('left')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
                onClick={() => scrollMovies('right')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}
          <div ref={moviesRef} className="d-flex overflow-auto" style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}>
            {(
              !isLoading && !isError && movies?.length > 0 ? movies : []
            )
              .concat(Array.from({ length: Math.max(0, 6 - (movies?.length || 0)) }))
              .map((movie, index) =>
                movie ? (
                  <Card key={movie.id} media={movie} type="movie" path={location.pathname} />
                ) : (
                  <Card
                    key={`movie-skeleton-${index}`}
                    media={{ poster_path: null, vote_average: null }}
                    type="movie"
                    path="/"
                    isDeletable={false}
                    isSkeleton={true}
                  />
                )
              )}
          </div>
        </div>
      )}

      {/* Trending TV Shows Section */}
      {(
        <div className="position-relative my-2">
          {shows.filter(Boolean).length > 3 && (
            <>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
                onClick={() => scrollTvShows('left')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
                onClick={() => scrollTvShows('right')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}
          <div ref={showsRef} className="d-flex overflow-auto" style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}>
            {(
              !isLoading && !isError && shows?.length > 0 ? shows : []
            )
              .concat(Array.from({ length: Math.max(0, 6 - (shows?.length || 0)) }))
              .map((show, index) =>
                show ? (
                  <Card key={show.id} media={show} type="tv" path={location.pathname} />
                ) : (
                  <Card
                    key={`tv-skeleton-${index}`}
                    media={{ poster_path: null, vote_average: null }}
                    type="tv"
                    path="/"
                    isDeletable={false}
                    isSkeleton={true}
                  />
                )
              )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TrendingGrid;