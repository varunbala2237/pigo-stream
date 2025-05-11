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

  // Scroll references for movies and TV shows (2 rows for each)
  const moviesRef1 = useRef(null);
  const moviesRef2 = useRef(null);
  const showsRef1 = useRef(null);
  const showsRef2 = useRef(null);

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

  const scroll = (ref, direction) => {
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

      {/* First Movies Results */}
      {(
        <div className="position-relative my-2">
          {searchQuery.trim() && movies?.filter(Boolean).length > 3 && (
            <>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
                onClick={() => scroll(moviesRef1, 'left')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
                onClick={() => scroll(moviesRef1, 'right')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}
          <div
            ref={moviesRef1}
            className="d-flex overflow-auto"
            style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}
          >
            {(searchQuery.trim()
              ? (movies?.slice(0, Math.ceil(movies.length / 2)) || []).concat(
                Array.from({
                  length: Math.max(
                    0,
                    6 - (movies?.slice(0, Math.ceil(movies.length / 2))?.length || 0)
                  ),
                })
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

      {/* Second Movies Results */}
      {(
        <div className="position-relative my-2">
          {searchQuery.trim() && movies?.filter(Boolean).length > 3 && (
            <>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
                onClick={() => scroll(moviesRef2, 'left')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
                onClick={() => scroll(moviesRef2, 'right')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}
          <div
            ref={moviesRef2}
            className="d-flex overflow-auto"
            style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}
          >
            {(searchQuery.trim()
              ? (movies?.slice(Math.ceil(movies.length / 2)) || [])
                .concat(
                  Array.from({
                    length: Math.max(
                      0,
                      6 - (movies?.slice(Math.ceil(movies.length / 2))?.length || 0)
                    ),
                  })
                )
              : Array.from({ length: 6 }) // Fallback to 6 skeletons if query is empty
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

      {/* First TV Shows Results */}
      {(
        <div className="position-relative my-2">
          {searchQuery.trim() && shows?.filter(Boolean).length > 3 && (
            <>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
                onClick={() => scroll(showsRef1, 'left')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
                onClick={() => scroll(showsRef1, 'right')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}
          <div
            ref={showsRef1}
            className="d-flex overflow-auto"
            style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}
          >
            {(searchQuery.trim()
              ? (shows?.slice(0, Math.ceil(shows.length / 2)) || []).concat(
                Array.from({
                  length: Math.max(
                    0,
                    6 - (shows?.slice(0, Math.ceil(shows.length / 2))?.length || 0)
                  ),
                })
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

      {/* Second TV Shows Results */}
      {(
        <div className="position-relative my-2">
          {searchQuery.trim() && shows?.filter(Boolean).length > 3 && (
            <>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
                onClick={() => scroll(showsRef2, 'left')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
              <button
                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
                onClick={() => scroll(showsRef2, 'right')}
                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            </>
          )}
          <div
            ref={showsRef2}
            className="d-flex overflow-auto"
            style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}
          >
            {(searchQuery.trim()
              ? (shows?.slice(Math.ceil(shows.length / 2)) || []).concat(
                Array.from({
                  length: Math.max(
                    0,
                    6 - (shows?.slice(Math.ceil(shows.length / 2))?.length || 0)
                  ),
                })
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
    </div>
  );
}

export default SearchGrid;