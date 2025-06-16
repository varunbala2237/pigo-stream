// MyListGrid.js
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchMyList from '../../hooks/MyListPage/useFetchMyList';
import OverlaySpinner from '../../utils/OverlaySpinner';
import ConnectionModal from '../../utils/ConnectionModal';
import Alert from '../../utils/Alert';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const SESSION_PATH = ['MyListUI', 'Grids', 'MyListGrid'];

function MyListGrid({ userUID }) {
    const location = useLocation();
    const [movieLimit, setMovieLimit] = useState(12);
    const [showLimit, setShowLimit] = useState(12);
    const { data: { moviesList = [], showsList = [] } = {}, loading: isLoading, error: isError, refetch } = useFetchMyList(userUID, movieLimit, showLimit);

    // Connection modal state
    const [showConnectionModal, setShowConnectionModal] = useState(false);

    // Alert messages
    const [alert, setAlert] = useState({ message: '', type: '', key: '' });

    // Scroll references for movies and shows (2 rows for each)
    const moviesRef = useRef(null);
    const showsRef = useRef(null);

    // Load from sessionStorage on mount
    useEffect(() => {
        const savedMovieLimit = getSessionValue(...SESSION_PATH, 'movieLimit') || 12;
        const savedShowLimit = getSessionValue(...SESSION_PATH, 'showLimit') || 12;

        const savedMoviesScroll = getSessionValue(...SESSION_PATH, 'moviesScroll') || 0;
        const savedShowsScroll = getSessionValue(...SESSION_PATH, 'showsScroll') || 0;

        if (savedMovieLimit) setMovieLimit(savedMovieLimit);
        if (savedShowLimit) setShowLimit(savedShowLimit);

        requestAnimationFrame(() => {
            if (moviesRef.current) moviesRef.current.scrollTo({ left: savedMoviesScroll, behavior: 'instant' });
            if (showsRef.current) showsRef.current.scrollTo({ left: savedShowsScroll, behavior: 'instant' });
        });
    }, [isLoading, isError]);

    // Save scroll positions for movies and shows
    useEffect(() => {
        const moviesNode = moviesRef.current;
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

    // Connection modal handling
    useEffect(() => {
        if (isError) {
            setShowConnectionModal(true);
        } else {
            setShowConnectionModal(false);
        }
    }, [isError]);

    // Alert handling for no content
    useEffect(() => {
        const hasContent = (moviesList && moviesList.length > 0) || (showsList && showsList.length > 0);
        let showTimer;
        let hideTimer;

        if (!isLoading && !isError && !hasContent) {
            showTimer = setTimeout(() => {
                setAlert({ message: 'Looks like your list is empty.', type: 'primary', key: 'content' });

                hideTimer = setTimeout(() => {
                    setAlert({ message: '', type: '', key: '' });
                }, 5000);
            }, 2000);
        } else {
            setAlert((prev) => (prev.key === 'content' ? { message: '', type: '', key: '' } : prev));
        }

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [moviesList, showsList, isLoading, isError]);

    const handleViewMoreMovies = () => {
        setMovieLimit(prevLimit => {
            const newLimit = prevLimit + 12;
            setSessionValue(...SESSION_PATH, 'movieLimit', newLimit);
            return newLimit;
        });
    };

    const handleViewMoreShows = () => {
        setShowLimit(prevLimit => {
            const newLimit = prevLimit + 12;
            setSessionValue(...SESSION_PATH, 'tvLimit', newLimit);
            return newLimit;
        });
    };

    const handleAlertDismiss = () => {
        setAlert({ message: '', type: '', key: '' });
    };

    const handleAlert = (message) => {
        setAlert({ message: message, type: 'success', key: 'feedback' });
        setTimeout(() => setAlert(''), 5000);
    };

    const scroll = (ref, direction) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: direction === 'left' ? -450 : 450,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center text-white p-0">
            {/* Overlay spinner for loading state */}
            <OverlaySpinner visible={isLoading} />

            <div className="container mb-5 mt-4">
                <div className="d-flex justify-content-start align-items-center">
                    <span className="dynamic-hs">
                        <i className="bi bi-bookmark-fill theme-color me-2"></i>
                        <b>My List</b>
                    </span>
                </div>

                <div className="d-flex justify-content-start align-items-center mt-5">
                    <span className="dynamic-ts">
                        <b>My List Movies</b>
                    </span>
                </div>

                {/* My List Movies */}
                <div className="position-relative my-2">
                    {(moviesList.filter(Boolean).length / 2) > 3 && (
                        <>
                            <button
                                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
                                onClick={() => scroll(moviesRef, 'left')}
                                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <i className="bi bi-chevron-left"></i>
                            </button>
                            <button
                                className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
                                onClick={() => scroll(moviesRef, 'right')}
                                style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
                            >
                                <i className="bi bi-chevron-right"></i>
                            </button>
                        </>
                    )}

                    <div
                        ref={moviesRef}
                        className="d-flex custom-theme-radius-low overflow-auto scroll-hide custom-gap"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {(moviesList || []).concat(
                            Array.from({ length: Math.max(0, 6 - (moviesList?.length || 0)) })
                        ).map((movie, index) =>
                            movie ? (
                                <Card
                                    key={index}
                                    media={movie}
                                    type="movie"
                                    path={location.pathname}
                                    onRemove={refetch}
                                    handleAlert={handleAlert}
                                />
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

                {moviesList.length > movieLimit && (
                    <div className="text-end">
                        <button
                            className="btn bg-transparent d-flex dynamic-fs border-0 rounded-pill text-white"
                            onClick={handleViewMoreMovies}
                        >
                            <i className="bi bi-arrow-right me-2"></i>
                            View More
                        </button>
                    </div>
                )}

                <div className="d-flex justify-content-start align-items-center mt-5">
                    <span className="dynamic-ts">
                        <b>My List Shows</b>
                    </span>
                </div>

                {/* My List Shows */}
                <div className="position-relative my-2">
                    {(showsList.filter(Boolean).length / 2) > 3 && (
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
                        {(showsList || []).concat(
                            Array.from({ length: Math.max(0, 6 - (showsList?.length || 0)) })
                        ).map((show, index) =>
                            show ? (
                                <Card
                                    key={index}
                                    media={show}
                                    type="tv"
                                    path={location.pathname}
                                    onRemove={refetch}
                                    handleAlert={handleAlert}
                                />
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

                {showsList.length > showLimit && (
                    <div className="text-end">
                        <button
                            className="btn bg-transparent d-flex dynamic-fs border-0 rounded-pill text-white"
                            onClick={handleViewMoreShows}
                        >
                            <i className="bi bi-arrow-right me-2"></i>
                            View More
                        </button>
                    </div>
                )}
            </div>

            {/* Connection Modal */}
            {showConnectionModal && <ConnectionModal show={showConnectionModal} />}

            {/* Alert Message */}
            {alert.message && (
                <Alert message={alert.message} onClose={handleAlertDismiss} type={alert.type} />
            )}
        </div>
    );
}

export default MyListGrid;