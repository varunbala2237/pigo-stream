import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchMyList from '../../hooks/MyListPage/useFetchMyList';
import ConnectionModal from '../../utils/ConnectionModal';
import Alert from '../../utils/Alert';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const SESSION_PATH = ['HomeUI', 'Grids', 'MyListGrid'];

function MyListGrid({ userUID }) {
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [movieLimit, setMovieLimit] = useState(12);
    const [tvLimit, setTvLimit] = useState(12);
    const { data: { movieList = [], tvList = [] } = {}, loading: isLoading, error: isError, refetch } = useFetchMyList(userUID, movieLimit, tvLimit);

    const [contentAlertMessage, setContentAlertMessage] = useState('');
    const [showConnectionModal, setShowConnectionModal] = useState(false);

    const location = useLocation();

    // Scroll references for movies and TV shows (2 rows for each)
    const moviesRef1 = useRef(null);
    const moviesRef2 = useRef(null);
    const showsRef1 = useRef(null);
    const showsRef2 = useRef(null);

    // Load from sessionStorage on mount
    useEffect(() => {
        const savedMoviesScroll1 = getSessionValue(...SESSION_PATH, 'moviesScroll1') || 0;
        const savedMoviesScroll2 = getSessionValue(...SESSION_PATH, 'moviesScroll2') || 0;
        const savedShowsScroll1 = getSessionValue(...SESSION_PATH, 'showsScroll1') || 0;
        const savedShowsScroll2 = getSessionValue(...SESSION_PATH, 'showsScroll2') || 0;

        requestAnimationFrame(() => {
            if (moviesRef1.current) moviesRef1.current.scrollTo({ left: savedMoviesScroll1, behavior: 'instant' });
            if (moviesRef2.current) moviesRef2.current.scrollTo({ left: savedMoviesScroll2, behavior: 'instant' });
            if (showsRef1.current) showsRef1.current.scrollTo({ left: savedShowsScroll1, behavior: 'instant' });
            if (showsRef2.current) showsRef2.current.scrollTo({ left: savedShowsScroll2, behavior: 'instant' });
        });
    }, [isLoading, isError]);

    // Save scroll positions for movies and shows
    useEffect(() => {
        const moviesNode1 = moviesRef1.current;
        const moviesNode2 = moviesRef2.current;
        const showsNode1 = showsRef1.current;
        const showsNode2 = showsRef2.current;

        if (!moviesNode1 || !moviesNode2 || !showsNode1 || !showsNode2) return;

        const handleMoviesScroll1 = () => {
            setSessionValue(...SESSION_PATH, 'moviesScroll1', moviesNode1.scrollLeft);
        };

        const handleMoviesScroll2 = () => {
            setSessionValue(...SESSION_PATH, 'moviesScroll2', moviesNode2.scrollLeft);
        };

        const handleShowsScroll1 = () => {
            setSessionValue(...SESSION_PATH, 'showsScroll1', showsNode1.scrollLeft);
        };

        const handleShowsScroll2 = () => {
            setSessionValue(...SESSION_PATH, 'showsScroll2', showsNode2.scrollLeft);
        };

        moviesNode1.addEventListener('scroll', handleMoviesScroll1);
        moviesNode2.addEventListener('scroll', handleMoviesScroll2);
        showsNode1.addEventListener('scroll', handleShowsScroll1);
        showsNode2.addEventListener('scroll', handleShowsScroll2);

        return () => {
            moviesNode1.removeEventListener('scroll', handleMoviesScroll1);
            moviesNode2.removeEventListener('scroll', handleMoviesScroll2);
            showsNode1.removeEventListener('scroll', handleShowsScroll1);
            showsNode2.removeEventListener('scroll', handleShowsScroll2);
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
        const hasContent = (movieList && movieList.length > 0) || (tvList && tvList.length > 0);
        let showTimer;
        let hideTimer;

        if (!isLoading && !isError && !hasContent) {
            showTimer = setTimeout(() => {
                setContentAlertMessage('Your list is empty.');

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
    }, [movieList, tvList, isLoading, isError]);

    const handleShowMoreMovies = () => {
        setMovieLimit(prevLimit => prevLimit + 12);
    };

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

    return (
        <div className="container mt-4 text-white">
            <div className="d-flex align-items-center dynamic-ts m-2 px-1">
                <i className="bi bi-bookmark-fill theme-color me-2"></i>
                <b className="mb-0">My List</b>
            </div>
            {/* First Row of Movies */}
            <div className="position-relative my-3">
                {(movieList.filter(Boolean).length / 2) > 3 && (
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
                    {(movieList?.slice(0, Math.ceil(movieList.length / 2)) || []).concat(
                        Array.from({
                            length: Math.max(
                                0,
                                6 - (movieList?.slice(0, Math.ceil(movieList.length / 2))?.length || 0)
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
                {(movieList.filter(Boolean).length / 2) > 3 && (
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
                    {(movieList?.slice(Math.ceil(movieList.length / 2)) || [])
                        .concat(
                            Array.from({
                                length: Math.max(
                                    0,
                                    6 - (movieList?.slice(Math.ceil(movieList.length / 2))?.length || 0)
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

            {/* First Row of TV Shows */}
            <div className="position-relative my-3">
                {(tvList.filter(Boolean).length / 2) > 3 && (
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
                    {(tvList?.slice(0, Math.ceil(tvList.length / 2)) || [])
                        .concat(
                            Array.from({
                                length: Math.max(
                                    0,
                                    6 - (tvList?.slice(0, Math.ceil(tvList.length / 2))?.length || 0)
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

            {/* Second Row of TV Shows */}
            <div className="position-relative my-3">
                {(tvList.filter(Boolean).length / 2) > 3 && (
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
                    {(tvList?.slice(Math.ceil(tvList.length / 2)) || [])
                        .concat(
                            Array.from({
                                length: Math.max(
                                    0,
                                    6 - (tvList?.slice(Math.ceil(tvList.length / 2))?.length || 0)
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

            {/* Connection Modal */}
            {showConnectionModal && <ConnectionModal show={showConnectionModal} />}

            {/* Alert for no content */}
            {contentAlertMessage && (
                <Alert message={contentAlertMessage} onClose={handleAlertDismiss} type="primary" />
            )}

            {/* Alert for successful removal */}
            {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} type={alertType} />}
        </div>
    );
}

export default MyListGrid;