// TrendingGrid.js
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchMedia from '../../hooks/IndexPage/useFetchMedia';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const SESSION_PATH = ['HomeUI', 'Grids', 'TrendingGrid'];

const TrendingGrid = ({ setIsTrendingLoading, setIsTrendingError, setHasTrendingContent }) => {
  const { data: movies, loading: isLoadingMovies, error: isErrorMovies } = useFetchMedia('trending', 'movie');
  const { data: shows, loading: isLoadingShows, error: isErrorShows } = useFetchMedia('trending', 'tv');

  const isLoading = isLoadingMovies || isLoadingShows;
  const isError = isErrorMovies || isErrorShows;
  const location = useLocation();

  // Scroll references for movies and shows
  const moviesRef = useRef(null);
  const showsRef = useRef(null);

  // Loading handling
  useEffect(() => {
    if (isLoading) {
      setIsTrendingLoading(true);
    } else {
      setIsTrendingLoading(false);
    }
  }, [isLoading, setIsTrendingLoading]);

  // Error handling
  useEffect(() => {
    if (isError) {
      setIsTrendingError(isError);
    }
  }, [isError, setIsTrendingError]);

  // No content handling
  useEffect(() => {
    if (!isLoading && !isError) {
      const hasContent =
        (movies && movies.length > 0) ||
        (shows && shows.length > 0);
      setHasTrendingContent(hasContent);
    }
  }, [isLoading, isError, movies, shows, setHasTrendingContent]);

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedMoviesScroll = getSessionValue(...SESSION_PATH, 'moviesScroll') || 0;
    const savedShowsScroll = getSessionValue(...SESSION_PATH, 'showsScroll') || 0;

    requestAnimationFrame(() => {
      if (moviesRef.current) moviesRef.current.scrollTo({ left: savedMoviesScroll, behavior: 'instant' });
      if (showsRef.current) showsRef.current.scrollTo({ left: savedShowsScroll, behavior: 'instant' });
    });
  }, [isLoading, isError]);

  // Save scroll positions for movies and shows
  useEffect(() => {
    const moviesNode = moviesRef.current;
    const showsNode = showsRef.current;

    if (!moviesNode || !showsNode) return;

    const handleMoviesScroll = () => {
      setSessionValue(...SESSION_PATH, 'moviesScroll', moviesNode.scrollLeft);
    };

    const handleShowsScroll = () => {
      setSessionValue(...SESSION_PATH, 'showsScroll', showsNode.scrollLeft);
    };

    moviesNode.addEventListener('scroll', handleMoviesScroll);
    showsNode.addEventListener('scroll', handleShowsScroll);

    return () => {
      moviesNode.removeEventListener('scroll', handleMoviesScroll);
      showsNode.removeEventListener('scroll', handleShowsScroll);
    };
  }, []);

  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -450 : 450,
        behavior: 'smooth',
      });
    }
  };

  return (
    <>
      <div className="d-flex justify-content-start align-items-center border-start border-4 theme-border-color dynamic-ts ps-2 mt-2">
        <b>Trending: Movies</b>
      </div>

      {/* Trending Movies Section */}
      {(
        <div className="d-flex my-2 justify-content-between align-items-stretch">
          <div ref={moviesRef} className="d-flex overflow-auto scroll-hide" style={{ scrollSnapType: 'x mandatory' }}>
            {(
              !isLoading && !isError && movies?.length > 0 ? movies : []
            )
              .concat(Array.from({ length: Math.max(0, 8 - (movies?.length || 0)) }))
              .map((movie, index) =>
                movie ? (
                  <Card key={movie.id} media={movie} type="movie" path={location.pathname} isDeletable={false} />
                ) : (
                  <Card
                    key={`movie-skeleton-${index}`}
                    media={{ poster_path: null, vote_average: null }}
                    type="movie"
                    path="/"
                    isSkeleton={true}
                  />
                )
              )}
          </div>

          {/* Vertical scroll buttons */}
          <div className="d-none d-md-flex flex-column ms-2 align-self-stretch">
            <button
              className="btn btn-dark bd-callout-dark flex-fill py-2"
              onClick={() => scroll(moviesRef, 'left')}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="btn btn-dark bd-callout-dark flex-fill py-2 mt-2"
              onClick={() => scroll(moviesRef, 'right')}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-start align-items-center border-start border-4 theme-border-color dynamic-ts ps-2 mt-4">
        <b>Trending: Shows</b>
      </div>

      {/* Trending Shows Section */}
      {(
        <div className="d-flex my-2 justify-content-between align-items-stretch">
          <div ref={showsRef} className="d-flex overflow-auto scroll-hide" style={{ scrollSnapType: 'x mandatory' }}>
            {(
              !isLoading && !isError && shows?.length > 0 ? shows : []
            )
              .concat(Array.from({ length: Math.max(0, 8 - (shows?.length || 0)) }))
              .map((show, index) =>
                show ? (
                  <Card key={show.id} media={show} type="tv" path={location.pathname} isDeletable={false} />
                ) : (
                  <Card
                    key={`tv-skeleton-${index}`}
                    media={{ poster_path: null, vote_average: null }}
                    type="tv"
                    path="/"
                    isSkeleton={true}
                  />
                )
              )}
          </div>

          {/* Vertical scroll buttons */}
          <div className="d-none d-md-flex flex-column ms-2 align-self-stretch">
            <button
              className="btn btn-dark bd-callout-dark flex-fill py-2"
              onClick={() => scroll(showsRef, 'left')}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="btn btn-dark bd-callout-dark flex-fill py-2 mt-2"
              onClick={() => scroll(showsRef, 'right')}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default TrendingGrid;