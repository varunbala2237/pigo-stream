import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchSearch from '../../hooks/useFetchSearch';

function SearchGrid({ searchQuery }) {
  // Fetch data from useSearch
  const { data: movies, loading: moviesLoading, error: moviesError } = useFetchSearch('movie', searchQuery);
  const { data: shows, loading: showsLoading, error: showsError } = useFetchSearch('tv', searchQuery);

  const isLoading = moviesLoading || showsLoading;
  const isError = moviesError || showsError;
  const location = useLocation();

  // Scroll references for movies and TV shows
  const moviesRef = useRef(null);
  const showsRef = useRef(null);

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
    <div className="container mt-4 text-white" id="searchResults">
      {isLoading && (
        <div className="col d-flex vh-50 justify-content-center align-items-center">
          <div className="spinner-border text-light spinner-size-1" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {isError && (
        <div className="col d-flex vh-50 justify-content-center align-items-center">
          <div className="d-flex align-items-center dynamic-fs">
            <i className="bi bi-wifi-off me-2"></i>
            <span className="mb-0">Something went wrong.</span>
          </div>
        </div>
      )}
      {!isLoading && !isError && (
        <>
          <div className="d-flex align-items-center dynamic-ts m-2 px-1">
            <i className="bi bi-search theme-color me-2"></i>
            <b className="mb-0">Search</b>
          </div>
          {/* Movies Results */}
          {(
            <>
              <div className="position-relative my-2">
                {movies.length > 3 && (
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
                  {movies?.length > 0 && (
                    movies.map((movie, index) => (
                      <Card key={index} media={movie} type={'movie'} path={location.pathname} />
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* TV Shows Results */}
          {(
            <>
              <div className="position-relative my-2">
                {shows.length > 3 && (
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
                  {shows?.length > 0 && (
                    shows.map((show, index) => (
                      <Card key={index} media={show} type={'tv'} path={location.pathname} />
                    ))
                  )}
                </div>
              </div>
            </>
          )}

          {/* If both Movies and TV Shows are not found */}
          {movies.length === 0 && shows.length === 0 && (
            <div className="col d-flex vh-50 justify-content-center align-items-center mt-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-search me-2"></i>
                <span className="dynamic-fs">No results found for "{searchQuery}".</span>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchGrid;