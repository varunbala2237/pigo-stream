import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchWatchHistory from '../../hooks/useFetchWatchHistory';
import useClearWatchHistory from '../../hooks/useClearWatchHistory';
import Alert from '../../Alert';

function WatchHistoryGrid({ userUID }) {
    const [initialized, setInitialized] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [movieLimit, setMovieLimit] = useState(12);
    const [tvLimit, setTvLimit] = useState(12);
    const { data, loading: fetchLoading, error: fetchError } = useFetchWatchHistory(userUID, movieLimit, tvLimit);
    const { clearHistory } = useClearWatchHistory();

    const [movieHistory, setMovieHistory] = useState([]);
    const [tvHistory, setTvHistory] = useState([]);
    const location = useLocation();

    // Scroll references for movies and TV shows
    const moviesRef = useRef(null);
    const tvRef = useRef(null);

    useEffect(() => {
        if (userUID) {
            setInitialized(true);
        }
    }, [userUID]);

    useEffect(() => {
        if (data) {
            setMovieHistory(data.movieHistory || []);
            setTvHistory(data.tvHistory || []);
        }
    }, [data]);

    if (!initialized) {
        return null;
    }

    // Function to remove the movie from the movieHistory
    const handleRemove = (id, type) => {
        if (type === 'movie') {
            setMovieHistory(prevList => prevList.filter(movie => movie.id !== id));
        } else if (type === 'tv') {
            setTvHistory(prevList => prevList.filter(show => show.id !== id));
        }
    };

    const handleClearHistory = async () => {
        try {
            await clearHistory();
            setMovieHistory([]);
            setTvHistory([]);
            handleAlert('Watch history cleared successfully.');
        } catch (error) {
            handleAlert('Failed to clear watch history.', 'danger');
        }
    };

    // Function to load more movies
    const handleShowMoreMovies = () => {
        setMovieLimit(prevLimit => prevLimit + 12);
    };

    // Function to load more TV shows
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

    const isClearButtonDisabled = movieHistory.length === 0 && tvHistory.length === 0;

    return (
        <div className="container mt-4 text-white">
            <div className="d-flex justify-content-end align-items-center my-2">
                <div className="text-end">
                    <button
                        type="button"
                        className="btn btn-md d-none d-md-inline-block btn-danger bd-callout-danger rounded-pill border-0"
                        onClick={handleClearHistory}
                        disabled={isClearButtonDisabled}
                    >
                        <i className="bi bi-trash me-2"></i>
                        Clear History
                    </button>
                    <button
                        type="button"
                        className="btn btn-sm d-md-none btn-danger bd-callout-danger rounded-pill border-0"
                        onClick={handleClearHistory}
                        disabled={isClearButtonDisabled}
                    >
                        <i className="bi bi-trash me-2"></i>
                        Clear History
                    </button>
                </div>
            </div>

            {fetchError && (
                <div className="col d-flex vh-50 justify-content-center align-items-center">
                    <div className="d-flex align-items-center dynamic-fs">
                        <i className="bi bi-wifi-off me-2"></i>
                        <span className="mb-0">Something went wrong.</span>
                    </div>
                </div>
            )}
            {!fetchError && (
                <>
                    <div className="d-flex align-items-center dynamic-ts m-2 px-1">
                        <i className="bi bi-clock theme-color me-2"></i>
                        <b className="mb-0">Watch History</b>
                    </div>
                    {/* Movies */}
                    <div className="position-relative my-2">
                        {movieHistory.length > 3 && (
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
                            {fetchLoading && Array.from({ length: 6 }).map((_, index) => (
                                <Card
                                    key={`movie-skeleton-${index}`}
                                    media={{ poster_path: null, vote_average: null }}
                                    type="movie"
                                    path="/"
                                    isDeletable={false}
                                    isSkeleton={true}
                                />
                            ))}
                            {movieHistory.length > 0 && (
                                movieHistory.map((movie) => (
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
                    {movieHistory.length === movieLimit && (
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
                        {tvHistory.length > 3 && (
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
                            {fetchLoading && Array.from({ length: 6 }).map((_, index) => (
                                <Card
                                    key={`tv-skeleton-${index}`}
                                    media={{ poster_path: null, vote_average: null }}
                                    type="tv"
                                    path="/"
                                    isDeletable={false}
                                    isSkeleton={true}
                                />
                            ))}
                            {tvHistory.length > 0 && (
                                tvHistory.map((show) => (
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
                    {tvHistory.length === tvLimit && (
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
                    {!fetchLoading && movieHistory.length === 0 && tvHistory.length === 0 && (
                        <div className="col d-flex vh-50 justify-content-center align-items-center mt-3">
                            <div className="d-flex align-items-center">
                                <i className="bi bi-clock me-2"></i>
                                <span className="dynamic-fs">You haven't watched anything yet.</span>
                            </div>
                        </div>
                    )}
                </>
            )}
            {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} type={alertType} />}
        </div>
    );
}

export default WatchHistoryGrid;