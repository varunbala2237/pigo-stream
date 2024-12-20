import React, { useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from './Card';
import useFetchSearch from '../hooks/useFetchSearch';

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
    <div className="container mt-4" id="searchResults">
      {isLoading && (
        <div className="col d-flex vh-70 justify-content-center align-items-center">
          <div className="spinner-border text-light spinner-size-1" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}
      {isError && (
        <div className="col d-flex vh-70 justify-content-center align-items-center">
          <div className="d-flex align-items-center">
            <i className="bi bi-wifi-off me-2"></i>
            <span>500 - Internal Server Error</span>
          </div>
        </div>
      )}
      {!isLoading && !isError && (
        <>
          {/* Movies Results */}
          {(
            <>
              <div className="d-flex align-items-center m-2 px-1">
                <i className="bi bi-search me-2"></i>
                <h5 className="mb-0">Movies</h5>
              </div>
              <div className="position-relative">
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
                  {movies?.length > 0 ? (
                    movies.map((movie, index) => (
                      <Card key={index} media={movie} type={'movie'} path={location.pathname} />
                    ))
                  ) : (
                    <div className="col d-flex vh-30 justify-content-center align-items-center">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-database-slash me-2"></i>
                        <span>404 - Not Found</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TV Shows Results */}
          {(
            <>
              <div className="d-flex align-items-center m-2 px-1">
                <i className="bi bi-search me-2"></i>
                <h5 className="mb-0">TV Shows</h5>
              </div>
              <div className="position-relative">
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
                  {shows?.length > 0 ? (
                    shows.map((show, index) => (
                      <Card key={index} media={show} type={'tv'} path={location.pathname} />
                    ))
                  ) : (
                    <div className="col d-flex vh-30 justify-content-center align-items-center">
                      <div className="d-flex align-items-center">
                        <i className="bi bi-database-slash me-2"></i>
                        <span>404 - Not Found</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default SearchGrid;