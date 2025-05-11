import React, { useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchSearch from '../../hooks/useFetchSearch';

function SearchGrid({ searchQuery, setIsSearchLoaded, setHasSearchContent }) {
  // Fetch data from useSearch
  const { data: movies, loading: moviesLoading, error: moviesError } = useFetchSearch('movie', searchQuery);
  const { data: shows, loading: showsLoading, error: showsError } = useFetchSearch('tv', searchQuery);

  const isLoading = moviesLoading || showsLoading;
  const isError = moviesError || showsError;
  const location = useLocation();

  // Scroll references for each row
  const firstMovieRef = useRef(null);
  const secondMovieRef = useRef(null);
  const firstTvShowRef = useRef(null);
  const secondTvShowRef = useRef(null);

  useEffect(() => {
    if (isError) {
      setIsSearchLoaded(false);
    } else {
      setIsSearchLoaded(true);
    }
  }, [isError, setIsSearchLoaded]);

  useEffect(() => {
    if (!isLoading && !isError) {
      const hasContent = (movies && movies.length > 0) || (shows && shows.length > 0);
      setHasSearchContent(hasContent);
    }
  }, [isLoading, isError, movies, shows, setHasSearchContent]);

  const scrollMovies = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -450 : 450,
        behavior: 'smooth',
      });
    }
  };

  const scrollTvShows = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -450 : 450,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="container mt-4 text-white" id="searchResults">
      <div className="d-flex align-items-center dynamic-ts m-2 px-1">
        <i className="bi bi-search theme-color me-2"></i>
        <b className="mb-0">Search</b>
      </div>

      {/* Movies Results */}
      <div className="position-relative my-2">
        {movies.length > 3 && (
          <>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
              onClick={() => scrollMovies(firstMovieRef, 'left')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
              onClick={() => scrollMovies(firstMovieRef, 'right')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </>
        )}
        <div ref={firstMovieRef} className="d-flex overflow-auto" style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}>
          {(movies?.length > 0 ? movies.slice(0, 6) : [])
            .concat(Array.from({ length: Math.max(0, 6 - (movies?.slice(0, 6).length || 0)) }))
            .map((movie, index) =>
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

      {/* Second Row Movies */}
      <div className="position-relative my-2">
        {movies.length > 3 && (
          <>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
              onClick={() => scrollMovies(secondMovieRef, 'left')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
              onClick={() => scrollMovies(secondMovieRef, 'right')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </>
        )}
        <div ref={secondMovieRef} className="d-flex overflow-auto" style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}>
          {(movies?.length > 6 ? movies.slice(6, 12) : [])
            .concat(Array.from({ length: Math.max(0, 6 - (movies?.slice(6, 12).length || 0)) }))
            .map((movie, index) =>
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

      {/* TV Shows Results */}
      <div className="position-relative my-2">
        {shows.length > 3 && (
          <>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
              onClick={() => scrollTvShows(firstTvShowRef, 'left')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
              onClick={() => scrollTvShows(firstTvShowRef, 'right')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </>
        )}
        <div ref={firstTvShowRef} className="d-flex overflow-auto" style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}>
          {(shows?.length > 0 ? shows.slice(0, 6) : [])
            .concat(Array.from({ length: Math.max(0, 6 - (shows?.slice(0, 6).length || 0)) }))
            .map((show, index) =>
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

      {/* Second Row TV Shows */}
      <div className="position-relative my-2">
        {shows.length > 3 && (
          <>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
              onClick={() => scrollTvShows(secondTvShowRef, 'left')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
              onClick={() => scrollTvShows(secondTvShowRef, 'right')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </>
        )}
        <div ref={secondTvShowRef} className="d-flex overflow-auto" style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}>
          {(shows?.length > 6 ? shows.slice(6, 12) : [])
            .concat(Array.from({ length: Math.max(0, 6 - (shows?.slice(6, 12).length || 0)) }))
            .map((show, index) =>
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
    </div>
  );
}

export default SearchGrid;