import { React, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from './Card';
import useFetchMedia from '../hooks/useFetchMedia';

function MediaGrid() {
  const { data: popularMovies, loading: loadingPopularMovies, error: errorPopularMovies } = useFetchMedia('trending', 'movie');
  const { data: popularTv, loading: loadingPopularTv, error: errorPopularTv } = useFetchMedia('trending', 'tv');
  const location = useLocation();
  
  // Scroll references for movies and TV shows
  const moviesRef = useRef(null);
  const tvRef = useRef(null);

  const scrollMovies = (direction) => {
    if (moviesRef.current) {
      moviesRef.current.scrollBy({
        left: direction === 'left' ? -450 : 450,
        behavior: 'smooth',
      });
    }
  };

  const scrollTvShows = (direction) => {
    if (tvRef.current) {
      tvRef.current.scrollBy({
        left: direction === 'left' ? -450 : 450,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="container mt-4 text-white">
      <div className="d-flex align-items-center dynamic-ts m-2 px-1">
        <i className="bi bi-fire theme-color me-1"></i>
        <b className="mb-0">Trending</b>
      </div>
      {/* Trending Movies Section */}
      {(
          <div className="position-relative my-2">
            {popularMovies.length > 3 && (
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
              {loadingPopularMovies && (
                <div className="col d-flex vh-35 justify-content-center align-items-center">
                  <div className="spinner-border text-light spinner-size-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              {errorPopularMovies && (
                <div className="col d-flex vh-35 justify-content-center align-items-center">
                    <div className="d-flex align-items-center dynamic-fs">
                        <i className="bi bi-wifi-off me-1"></i>
                        <span className="mb-0">Something went wrong.</span>
                    </div>
                </div>
              )}
              {!loadingPopularMovies && !errorPopularMovies && popularMovies.length > 0 ? (
                popularMovies.map((movie) => (
                  <Card key={movie.id} media={movie} type={'movie'} path={location.pathname} />
                ))
              ) : (
                !loadingPopularMovies &&
                !errorPopularMovies && (
                  <div className="col d-flex vh-35 justify-content-center align-items-center">
                    <div className="d-flex align-items-center dynamic-fs">
                      <i className="bi bi-database-slash me-1"></i>
                      <span className="mb-0">No movies found.</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
      )}

      {/* Trending TV Shows Section */}
      {(
          <div className="position-relative my-2">
            {popularTv.length > 3 && (
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
            <div ref={tvRef} className="d-flex overflow-auto" style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}>
            {loadingPopularTv && (
                <div className="col d-flex vh-35 justify-content-center align-items-center">
                  <div className="spinner-border text-light spinner-size-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              {errorPopularTv && (
                <div className="col d-flex vh-35 justify-content-center align-items-center">
                    <div className="d-flex align-items-center dynamic-fs">
                        <i className="bi bi-wifi-off me-1"></i>
                        <span className="mb-0">Something went wrong.</span>
                    </div>
                </div>
              )}
              {!loadingPopularTv && !errorPopularTv && popularTv.length > 0 ? (
                popularTv.map((show) => (
                  <Card key={show.id} media={show} type={'tv'} path={location.pathname} />
                ))
              ) : (
                !loadingPopularTv &&
                !errorPopularTv && (
                  <div className="col d-flex vh-35 justify-content-center align-items-center">
                    <div className="d-flex align-items-center dynamic-fs">
                      <i className="bi bi-database-slash me-1"></i>
                      <span className="mb-0">No tv shows found.</span>
                    </div>
                  </div>
                )
              )}
            </div>
          </div>
      )}
    </div>
  );
}

export default MediaGrid;