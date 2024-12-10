import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from './Card';
import useFetchWatchHistory from '../hooks/useFetchWatchHistory';
import useClearWatchHistory from '../hooks/useClearWatchHistory';
import Alert from '../Alert';

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

    return (
        <div className="container text-white">
            <div className="d-flex justify-content-end align-items-center my-2">
                <div className="text-end">
                    <button
                        type="button"
                        className="btn bg-danger rounded-pill text-white"
                        onClick={handleClearHistory}
                    >
                        <i className="bi bi-trash me-2"></i>
                        Clear All
                    </button>
                </div>
            </div>

            {fetchLoading && (
                <div className="col mt-5 mb-5 d-flex justify-content-center">
                    <div className="spinner-border text-light spinner-size-1" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {fetchError && (
                <div className="col mt-5 mb-5">
                    <p className="text-white text-center">Oops! Something went wrong.</p>
                </div>
            )}
            {!fetchLoading && !fetchError && (
                <>
                    {/* Movies */}
                    <div className="d-flex align-items-center my-2">
                        <i className="bi bi-clock me-2"></i>
                        <h5 className="mb-0">Movies</h5>
                    </div>
                    <div className="position-relative">
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
                            {movieHistory.length > 0 ? (
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
                            ) : (
                                <div className="col mt-5 mb-5">
                                    <p className="text-white text-center mb-0">No movies found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {movieHistory.length === movieLimit && (
                        <div className="text-end mb-3">
                            <button
                                className="btn btn-light text-black rounded-pill btn-md d-none d-md-inline-block"
                                onClick={handleShowMoreMovies}
                            >
                                <i className="bi bi-chevron-down me-2"></i>
                                Show More
                            </button>
                            <button
                                className="btn btn-light text-black rounded-pill btn-sm d-md-none"
                                onClick={handleShowMoreMovies}
                            >
                                <i className="bi bi-chevron-down me-2"></i>
                                Show More
                            </button>
                        </div>
                    )}

                    {/* TV Shows */}
                    <div className="d-flex align-items-center my-2">
                        <i className="bi bi-clock me-2"></i>
                        <h5 className="mb-0">TV Shows</h5>
                    </div>
                    <div className="position-relative">
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
                            {tvHistory.length > 0 ? (
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
                            ) : (
                                <div className="col mt-5 mb-5">
                                    <p className="text-white text-center mb-0">No TV shows found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {tvHistory.length === tvLimit && (
                        <div className="text-end mb-3">
                            <button
                                className="btn btn-light text-black rounded-pill btn-md d-none d-md-inline-block"
                                onClick={handleShowMoreTV}
                            >
                                <i className="bi bi-chevron-down me-2"></i>
                                Show More
                            </button>
                            <button
                                className="btn btn-light text-black rounded-pill btn-sm d-md-none"
                                onClick={handleShowMoreTV}
                            >
                                <i className="bi bi-chevron-down me-2"></i>
                                Show More
                            </button>
                        </div>
                    )}
                </>
            )}
            {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} type={alertType} />}
        </div>
    );
}

export default WatchHistoryGrid;