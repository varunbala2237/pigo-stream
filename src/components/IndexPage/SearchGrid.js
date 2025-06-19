// SearchGrid.js
import { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchSearch from '../../hooks/IndexPage/useFetchSearch';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const SESSION_PATH = ['HomeUI', 'Grids', 'SearchGrid'];

function SearchGrid({ searchQuery, setIsSearchLoading, setIsSearchLoaded, setHasSearchContent }) {
  // Fetch data from useSearch
  const { data: movies, loading: moviesLoading, error: moviesError } = useFetchSearch('movie', searchQuery);
  const { data: shows, loading: showsLoading, error: showsError } = useFetchSearch('tv', searchQuery);

  const isLoading = moviesLoading || showsLoading;
  const isError = moviesError || showsError;
  const location = useLocation();

  // Scroll references for movies and shows (2 rows for each)
  const movieRef = useRef(null);
  const showsRef = useRef(null);

  // Loading handling
  useEffect(() => {
    if (isLoading) {
      setIsSearchLoading(true);
    } else {
      setIsSearchLoading(false);
    }
  }, [isLoading, setIsSearchLoading]);

  // Error handling
  useEffect(() => {
    if (isError) {
      setIsSearchLoaded(false);
    } else {
      setIsSearchLoaded(true);
    }
  }, [isError, setIsSearchLoaded]);

  // No content handling
  useEffect(() => {
    if (!isLoading && !isError) {
      const hasContent = (movies && movies.length > 0) || (shows && shows.length > 0);
      setHasSearchContent(hasContent);
    }
  }, [isLoading, isError, movies, shows, setHasSearchContent]);

  // Load from sessionStorage on mount
  useEffect(() => {
    const savedMoviesScroll = getSessionValue(...SESSION_PATH, 'moviesScroll') || 0;
    const savedShowsScroll = getSessionValue(...SESSION_PATH, 'showsScroll') || 0;

    requestAnimationFrame(() => {
      if (movieRef.current) movieRef.current.scrollTo({ left: savedMoviesScroll, behavior: 'instant' });
      if (showsRef.current) showsRef.current.scrollTo({ left: savedShowsScroll, behavior: 'instant' });
    });
  }, [isLoading, isError]);

  // Save scroll positions for movies and shows
  useEffect(() => {
    const moviesNode = movieRef.current;
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
      <div className="d-flex justify-content-start align-items-center mt-5">
        <span className="dynamic-ts">
          <b>Search Results: Movies</b>
        </span>
      </div>

      {/* Search Results: Movies */}
      {(
        <div className="position-relative my-2">
          {searchQuery.trim() && movies?.filter(Boolean).length > 3 && (
            <>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
                onClick={() => scroll(movieRef, 'left')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
                onClick={() => scroll(movieRef, 'right')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}
          <div
            ref={movieRef}
            className="d-flex custom-theme-radius-low overflow-auto scroll-hide custom-gap"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {(searchQuery.trim()
              ? (movies || []).concat(
                Array.from({ length: Math.max(0, 6 - (movies?.length || 0)) })
              )
              : Array.from({ length: 6 })
            ).map((movie, index) =>
              movie ? (
                <Card key={index} media={movie} type="movie" path={location.pathname} />
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

      <div className="d-flex justify-content-start align-items-center mt-5">
        <span className="dynamic-ts">
          <b>Search Results: Shows</b>
        </span>
      </div>

      {/* Search Results: Shows */}
      {(
        <div className="position-relative my-2">
          {searchQuery.trim() && shows?.filter(Boolean).length > 3 && (
            <>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
                onClick={() => scroll(showsRef, 'left')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
                onClick={() => scroll(showsRef, 'right')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}
          <div
            ref={showsRef}
            className="d-flex custom-theme-radius-low overflow-auto scroll-hide custom-gap"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {(searchQuery.trim()
              ? (shows || []).concat(
                Array.from({ length: Math.max(0, 6 - (shows?.length || 0)) })
              )
              : Array.from({ length: 6 })
            ).map((show, index) =>
              show ? (
                <Card key={index} media={show} type="tv" path={location.pathname} />
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
    </>
  );
}

export default SearchGrid;