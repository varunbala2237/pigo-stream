import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchWatchHistory from '../../hooks/WatchHistoryPage/useFetchWatchHistory';
import useClearWatchHistory from '../../hooks/WatchHistoryPage/useClearWatchHistory';
import ConnectionModal from '../../utils/ConnectionModal';
import Alert from '../../utils/Alert';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const SESSION_PATH = ['WatchHistoryUI', 'Grids', 'WatchHistoryGrid'];

function WatchHistoryGrid({ userUID }) {
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [movieLimit, setMovieLimit] = useState(12);
    const [tvLimit, setTvLimit] = useState(12);
    const { data: { movieHistory = [], tvHistory = [] } = {}, loading: isLoading, error: isError, refetch } = useFetchWatchHistory(userUID, movieLimit, tvLimit);
    const { clearHistory } = useClearWatchHistory();

    const [contentAlertMessage, setContentAlertMessage] = useState('');
    const [showConnectionModal, setShowConnectionModal] = useState(false);

    const location = useLocation();

    // Scroll references for movies and TV shows (2 rows for each)
    const moviesRef1 = useRef(null);
    const moviesRef2 = useRef(null);
    const showsRef1 = useRef(null);
    const showsRef2 = useRef(null);

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
        const hasContent = (movieHistory && movieHistory.length > 0) || (tvHistory && tvHistory.length > 0);
        let showTimer;
        let hideTimer;

        if (!isLoading && !isError && !hasContent) {
            showTimer = setTimeout(() => {
                setContentAlertMessage(`You haven't watched anything yet.`);

                hideTimer = setTimeout(() => {
                    setContentAlertMessage('');
                }, 5000);
            }, 2000);
        } else {
            setContentAlertMessage('');
        }

        return () => {
            clearTimeout(showTimer);
            clearTimeout(hideTimer);
        };
    }, [movieHistory, tvHistory, isLoading, isError]);

    const handleClearHistory = async () => {
        try {
            await clearHistory();
            refetch();
            handleAlert('Watch history cleared successfully.');
        } catch (isError) {
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
        setContentAlertMessage('');
        setAlertMessage('');
    };

    const handleAlert = (message) => {
        setAlertMessage(message);
        setAlertType("success");
        setTimeout(() => setAlertMessage(''), 5000);
    };

    const scroll = (ref, direction) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: direction === 'left' ? -450 : 450,
                behavior: 'smooth',
            });
        }
    };

    const isClearButtonDisabled = movieHistory.length === 0 && tvHistory.length === 0;

    return (
        <div className="container mt-4 text-white">
            <div className="d-flex justify-content-between align-items-center my-2 m-2 px-1">
                <div className="text-start dynamic-ts">
                    <i className="bi bi-clock theme-color me-2"></i>
                    <b className="mb-0">Watch History</b>
                </div>
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

            {/* First Row of Movies */}
            <div className="position-relative my-3">
                {(movieHistory.filter(Boolean).length / 2) > 3 && (
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
                    className="d-flex overflow-auto gap-3"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {(movieHistory?.slice(0, Math.ceil(movieHistory.length / 2)) || []).concat(
                        Array.from({
                            length: Math.max(
                                0,
                                6 - (movieHistory?.slice(0, Math.ceil(movieHistory.length / 2))?.length || 0)
                            ),
                        })
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

            {/* Second Row of Movies */}
            <div className="position-relative my-3">
                {(movieHistory.filter(Boolean).length / 2) > 3 && (
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
                    className="d-flex overflow-auto gap-3"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {(movieHistory?.slice(Math.ceil(movieHistory.length / 2)) || [])
                        .concat(
                            Array.from({
                                length: Math.max(
                                    0,
                                    6 - (movieHistory?.slice(Math.ceil(movieHistory.length / 2))?.length || 0)
                                ),
                            })
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

            {movieHistory.length === movieLimit && (
                <div className="text-end mb-3">
                    <button
                        className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-md d-none d-md-inline-block"
                        onClick={handleShowMoreMovies}
                    >
                        <i className="bi bi-chevron-right text-white me-2"></i>
                        <span className="text-white">Show More</span>
                    </button>
                    <button
                        className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-sm d-md-none"
                        onClick={handleShowMoreMovies}
                    >
                        <i className="bi bi-chevron-right text-white me-2"></i>
                        <span className="text-white">Show More</span>
                    </button>
                </div>
            )}

            {/* First Row of TV Shows */}
            <div className="position-relative my-3">
                {(tvHistory.filter(Boolean).length / 2) > 3 && (
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
                    className="d-flex overflow-auto gap-3"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {(tvHistory?.slice(0, Math.ceil(tvHistory.length / 2)) || [])
                        .concat(
                            Array.from({
                                length: Math.max(
                                    0,
                                    6 - (tvHistory?.slice(0, Math.ceil(tvHistory.length / 2))?.length || 0)
                                ),
                            })
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

            {/* Second Row of TV Shows */}
            <div className="position-relative my-3">
                {(tvHistory.filter(Boolean).length / 2) > 3 && (
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
                    className="d-flex overflow-auto gap-3"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {(tvHistory?.slice(Math.ceil(tvHistory.length / 2)) || [])
                        .concat(
                            Array.from({
                                length: Math.max(
                                    0,
                                    6 - (tvHistory?.slice(Math.ceil(tvHistory.length / 2))?.length || 0)
                                ),
                            })
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

            {tvHistory.length === tvLimit && (
                <div className="text-end mb-3">
                    <button
                        className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-md d-none d-md-inline-block"
                        onClick={handleShowMoreTV}
                    >
                        <i className="bi bi-chevron-right text-white me-2"></i>
                        <span className="text-white">Show More</span>
                    </button>
                    <button
                        className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-sm d-md-none"
                        onClick={handleShowMoreTV}
                    >
                        <i className="bi bi-chevron-right text-white me-2"></i>
                        <span className="text-white">Show More</span>
                    </button>
                </div>
            )}

            {/* Connection Modal */}
            {showConnectionModal && <ConnectionModal show={showConnectionModal} />}

            {/* Alert for no content */}
            {contentAlertMessage && (
                <Alert message={contentAlertMessage} onClose={handleAlertDismiss} type="primary" />
            )}

            {/* Alert for clearing history */}
            {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} type={alertType} />}
        </div>
    );
}

export default WatchHistoryGrid;