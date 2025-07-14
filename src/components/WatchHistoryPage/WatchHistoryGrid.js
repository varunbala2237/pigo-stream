// WatchHistoryGrid.js
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchWatchHistory from '../../hooks/WatchHistoryPage/useFetchWatchHistory';
import OverlaySpinner from '../../utils/OverlaySpinner';
import ErrorModal from '../../utils/ErrorModal';
import Alert from '../../utils/Alert';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const SESSION_PATH = ['WatchHistoryUI', 'Grids', 'WatchHistoryGrid'];

const WatchHistoryGrid = ({ userUID }) => {
    const [movieLimit, setMovieLimit] = useState(12);
    const [showLimit, setShowLimit] = useState(12);
    const { data: { moviesHistory = [], showsHistory = [] } = {}, loading: isLoading, error: isError, refetch } = useFetchWatchHistory(userUID, movieLimit, showLimit);

    // Error Modal state
    const [showErrorModal, setShowErrorModal] = useState(false);

    // Alert messages
    const [alert, setAlert] = useState({ message: '', type: '', key: '' });

    const location = useLocation();

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

    // Error Modal handling
    useEffect(() => {
        if (isError) {
            setShowErrorModal(true);
        } else {
            setShowErrorModal(false);
        }
    }, [isError]);

    // Alert handling for no content
    useEffect(() => {
        const hasContent = (moviesHistory && moviesHistory.length > 0) || (showsHistory && showsHistory.length > 0);
        let showTimer;
        let hideTimer;

        if (!isLoading && !isError && !hasContent) {
            showTimer = setTimeout(() => {
                setAlert({ message: `Looks like you haven't watched anything yet.`, type: 'primary', key: 'content' });

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
    }, [moviesHistory, showsHistory, isLoading, isError]);

    const handleSeeMoreMovies = () => {
        setMovieLimit(prevLimit => {
            const newLimit = prevLimit + 12;
            setSessionValue(...SESSION_PATH, 'movieLimit', newLimit);
            return newLimit;
        });
    };

    const handleSeeMoreShows = () => {
        setShowLimit(prevLimit => {
            const newLimit = prevLimit + 12;
            setSessionValue(...SESSION_PATH, 'showLimit', newLimit);
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
                <div className="d-flex justify-content-between align-items-center">
                    <div className="text-start">
                        <span className="dynamic-hs">
                            <i className="bi bi-clock-history theme-color me-2"></i>
                            <b>Watch History</b>
                        </span>
                    </div>
                </div>

                <div className="d-flex justify-content-start align-items-center border-start border-4 theme-border-color dynamic-ts ps-2 mt-5">
                    <b>Watch History: Movies</b>
                </div>

                {/* Watch History: Movies */}
                <div className="d-flex my-2 justify-content-between align-items-stretch">
                    <div
                        ref={moviesRef}
                        className="d-flex overflow-auto scroll-hide"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {(moviesHistory || []).concat(
                            Array.from({ length: Math.max(0, 8 - (moviesHistory?.length || 0)) })
                        ).map((movie, index) =>
                            movie ? (
                                <Card
                                    key={index}
                                    media={movie}
                                    type="movie"
                                    path={location.pathname}
                                    onRemove={refetch}
                                    handleAlert={handleAlert}
                                    isDeletable={true}
                                />
                            ) : (
                                <Card
                                    key={`movie-skeleton-${index}`}
                                    media={{ poster_path: null, vote_average: null }}
                                    type="movie"
                                    path="/"
                                    isSkeleton={true}
                                />
                            )
                        )}
                    </div>

                    {/* Vertical scroll buttons */}
                    <div className="d-none d-md-flex flex-column ms-2 align-self-stretch">
                        <button
                            className="btn btn-dark bd-callout-dark flex-fill py-2"
                            onClick={() => scroll(moviesRef, 'left')}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <button
                            className="btn btn-dark bd-callout-dark flex-fill py-2 mt-2"
                            onClick={() => scroll(moviesRef, 'right')}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>

                {moviesHistory.length > movieLimit && (
                    <div className="d-flex justify-content-end align-items-center">
                        <button
                            className="btn btn-dark bd-callout-dark d-flex dynamic-fs border-0 rounded-pill text-white"
                            onClick={handleSeeMoreMovies}
                        >
                            <i className="bi bi-caret-right-fill me-2"></i>
                            See More
                        </button>
                    </div>
                )}

                <div className="d-flex justify-content-start align-items-center border-start border-4 theme-border-color dynamic-ts ps-2 mt-5">
                    <b>Watch History: Shows</b>
                </div>

                {/* Watch History: Shows */}
                <div className="d-flex my-2 justify-content-between align-items-stretch">
                    <div
                        ref={showsRef}
                        className="d-flex overflow-auto scroll-hide"
                        style={{ scrollSnapType: 'x mandatory' }}
                    >
                        {(showsHistory || []).concat(
                            Array.from({ length: Math.max(0, 8 - (showsHistory?.length || 0)) })
                        ).map((show, index) =>
                            show ? (
                                <Card
                                    key={index}
                                    media={show}
                                    type="tv"
                                    path={location.pathname}
                                    onRemove={refetch}
                                    handleAlert={handleAlert}
                                    isDeletable={true}
                                />
                            ) : (
                                <Card
                                    key={`tv-skeleton-${index}`}
                                    media={{ poster_path: null, vote_average: null }}
                                    type="tv"
                                    path="/"
                                    isSkeleton={true}
                                />
                            )
                        )}
                    </div>

                    {/* Vertical scroll buttons */}
                    <div className="d-none d-md-flex flex-column ms-2 align-self-stretch">
                        <button
                            className="btn btn-dark bd-callout-dark flex-fill py-2"
                            onClick={() => scroll(showsRef, 'left')}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <button
                            className="btn btn-dark bd-callout-dark flex-fill py-2 mt-2"
                            onClick={() => scroll(showsRef, 'right')}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </div>
                </div>

                {showsHistory.length > showLimit && (
                    <div className="d-flex justify-content-end align-items-center">
                        <button
                            className="btn btn-dark bd-callout-dark d-flex dynamic-fs border-0 rounded-pill text-white"
                            onClick={handleSeeMoreShows}
                        >
                            <i className="bi bi-caret-right-fill me-2"></i>
                            See More
                        </button>
                    </div>
                )}
            </div>

            {/* Error Modal */}
            {showErrorModal && <ErrorModal error={isError} />}

            {/* Alert Message */}
            {alert.message && (
                <Alert message={alert.message} onClose={handleAlertDismiss} type={alert.type} />
            )}
        </div>
    );
}

export default WatchHistoryGrid;