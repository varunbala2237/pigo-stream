import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchMyList from '../../hooks/useFetchMyList';
import Alert from '../../utils/Alert';

function MyListGrid({ userUID }) {
    const [initialized, setInitialized] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [movieLimit, setMovieLimit] = useState(12);
    const [tvLimit, setTvLimit] = useState(12);
    const { data, loading, error } = useFetchMyList(userUID, movieLimit, tvLimit);

    const [movieList, setMovieList] = useState([]);
    const [tvList, setTvList] = useState([]);
    const location = useLocation();

    // Refs for scrolling
    const moviesRef = useRef(null);
    const tvRef = useRef(null);

    useEffect(() => {
        if (userUID) {
            setInitialized(true);
        }
    }, [userUID]);

    useEffect(() => {
        if (data) {
            setMovieList(data.movieList || []);
            setTvList(data.tvList || []);
        }
    }, [data]);

    if (!initialized) {
        return null;
    }

    const handleRemove = (id, type) => {
        if (type === 'movie') {
            setMovieList(prevList => prevList.filter(movie => movie.id !== id));
        } else if (type === 'tv') {
            setTvList(prevList => prevList.filter(show => show.id !== id));
        }
    };

    const handleShowMoreMovies = () => {
        setMovieLimit(prevLimit => prevLimit + 12);
    };

    const handleShowMoreTV = () => {
        setTvLimit(prevLimit => prevLimit + 12);
    };

    const handleAlertDismiss = () => {
        setAlertMessage('');
    };

    const handleAlert = (message) => {
        setAlertMessage(message);
        setAlertType("success");
        setTimeout(() => setAlertMessage(''), 5000);
    };

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
            {error && (
                <div className="col d-flex vh-50 justify-content-center align-items-center">
                    <div className="d-flex align-items-center dynamic-fs">
                        <i className="bi bi-wifi-off me-2"></i>
                        <span className="mb-0">Something went wrong.</span>
                    </div>
                </div>
            )}
            {!error && (
                <>
                    <div className="d-flex align-items-center dynamic-ts m-2 px-1">
                        <i className="bi bi-bookmark-fill theme-color me-2"></i>
                        <b className="mb-0">My List</b>
                    </div>
                    <div className="position-relative my-2">
                        {movieList.length > 3 && (
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
                            {loading && Array.from({ length: 6 }).map((_, index) => (
                                <Card
                                    key={`movie-skeleton-${index}`}
                                    media={{ poster_path: null, vote_average: null }}
                                    type="movie"
                                    path="/"
                                    isDeletable={false}
                                    isSkeleton={true}
                                />
                            ))}
                            {movieList.length > 0 && (
                                movieList.map((movie) => (
                                    <Card
                                        key={movie.id}
                                        media={movie}
                                        type={'movie'}
                                        path={location.pathname}
                                        onRemove={() => handleRemove(movie.id, 'movie')}
                                        handleAlert={handleAlert}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                    {movieList.length === movieLimit && (
                        <div className="text-end mb-3">
                            <button
                                className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-md d-none d-md-inline-block"
                                onClick={handleShowMoreMovies}
                            >
                                <i className="bi bi-chevron-down text-white me-2"></i>
                                <span className="text-white">Show More</span>
                            </button>
                            <button
                                className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-sm d-md-none"
                                onClick={handleShowMoreMovies}
                            >
                                <i className="bi bi-chevron-down text-white me-2"></i>
                                <span className="text-white">Show More</span>
                            </button>
                        </div>
                    )}

                    {/* TV Shows */}
                    <div className="position-relative my-2">
                        {tvList.length > 3 && (
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
                            {loading && Array.from({ length: 6 }).map((_, index) => (
                                <Card
                                    key={`tv-skeleton-${index}`}
                                    media={{ poster_path: null, vote_average: null }}
                                    type="tv"
                                    path="/"
                                    isDeletable={false}
                                    isSkeleton={true}
                                />
                            ))}
                            {tvList.length > 0 && (
                                tvList.map((show) => (
                                    <Card
                                        key={show.id}
                                        media={show}
                                        type={'tv'}
                                        path={location.pathname}
                                        onRemove={() => handleRemove(show.id, 'tv')}
                                        handleAlert={handleAlert}
                                    />
                                ))
                            )}
                        </div>
                    </div>
                    {tvList.length === tvLimit && (
                        <div className="text-end mb-3">
                            <button
                                className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-md d-none d-md-inline-block"
                                onClick={handleShowMoreTV}
                            >
                                <i className="bi bi-chevron-down text-white me-2"></i>
                                <span className="text-white">Show More</span>
                            </button>
                            <button
                                className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-sm d-md-none"
                                onClick={handleShowMoreTV}
                            >
                                <i className="bi bi-chevron-down text-white me-2"></i>
                                <span className="text-white">Show More</span>
                            </button>
                        </div>
                    )}

                    {/* If both Movies and TV Shows are empty */}
                    {!loading && movieList.length === 0 && tvList.length === 0 && (
                        <div className="col d-flex vh-25 justify-content-center align-items-center mt-3">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-bookmark me-2"></i>
                                <span className="dynamic-fs">Your list is empty.</span>
                            </div>
                        </div>
                    )}
                </>
            )}
            {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} type={alertType} />}
        </div>
    );
}

export default MyListGrid;