import { React, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from './Card';
import useFetchMedia from '../hooks/useFetchMedia';

function MediaGrid({ filter }) {
  const { data: popularMovies, loading: loadingPopularMovies, error: errorPopularMovies } = useFetchMedia('popular', 'movie');
  const { data: popularTv, loading: loadingPopularTv, error: errorPopularTv } = useFetchMedia('popular', 'tv');
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
      {/* Popular Movies Section */}
      {(filter === 'all' || filter === 'movie') && (
        <>
          <div className="d-flex align-items-center my-2">
            <i className="bi bi-film me-2"></i>
            <h5 className="mb-0">Popular Movies</h5>
          </div>
          <div className="position-relative">
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
              onClick={() => scrollMovies('left')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <div ref={moviesRef} className="d-flex overflow-auto" style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}>
              {loadingPopularMovies && (
                <div className="col mt-5 mb-5 d-flex justify-content-center">
                  <div className="spinner-border text-light spinner-size-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              {errorPopularMovies && (
                <div className="col mt-5 mb-5">
                  <p className="text-white text-center mb-0">Oops! Something went wrong.</p>
                </div>
              )}
              {!loadingPopularMovies && !errorPopularMovies && popularMovies.length > 0 ? (
                popularMovies.map((movie) => (
                  <Card key={movie.id} media={movie} type={'movie'} path={location.pathname} />
                ))
              ) : (
                !loadingPopularMovies &&
                !errorPopularMovies && (
                  <div className="col mt-5 mb-5">
                    <p className="text-white text-center mb-0">No movies found.</p>
                  </div>
                )
              )}
            </div>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
              onClick={() => scrollMovies('right')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </>
      )}

      {/* Popular TV Shows Section */}
      {(filter === 'all' || filter === 'tv') && (
        <>
          <div className="d-flex align-items-center my-2">
            <i className="bi bi-tv me-2"></i>
            <h5 className="mb-0">Popular TV Shows</h5>
          </div>
          <div className="position-relative">
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
              onClick={() => scrollTvShows('left')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <div ref={tvRef} className="d-flex overflow-auto" style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}>
              {loadingPopularTv && (
                <div className="col mt-5 mb-5 d-flex justify-content-center">
                  <div className="spinner-border text-light spinner-size-1" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              )}
              {errorPopularTv && (
                <div className="col mt-5 mb-5">
                  <p className="text-white text-center mb-0">Oops! Something went wrong.</p>
                </div>
              )}
              {!loadingPopularTv && !errorPopularTv && popularTv.length > 0 ? (
                popularTv.map((show) => (
                  <Card key={show.id} media={show} type={'tv'} path={location.pathname} />
                ))
              ) : (
                !loadingPopularTv &&
                !errorPopularTv && (
                  <div className="col mt-5 mb-5">
                    <p className="text-white text-center mb-0">No TV shows found.</p>
                  </div>
                )
              )}
            </div>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
              onClick={() => scrollTvShows('right')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default MediaGrid;