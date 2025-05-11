import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchMyList from '../../hooks/useFetchMyList';
import ConnectionModal from '../../utils/ConnectionModal';
import Alert from '../../utils/Alert';

function MyListGrid({ userUID }) {
    const [initialized, setInitialized] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [alertType, setAlertType] = useState('');
    const [movieLimit, setMovieLimit] = useState(12);
    const [tvLimit, setTvLimit] = useState(12);
    const { data, loading, error } = useFetchMyList(userUID, movieLimit, tvLimit);

    const [contentAlertMessage, setContentAlertMessage] = useState('');
    const [showConnectionModal, setShowConnectionModal] = useState(false);

    const [movieList, setMovieList] = useState([]);
    const [tvList, setTvList] = useState([]);
    const location = useLocation();

    // Scroll references for movies and TV shows (2 rows for each)
    const moviesRef1 = useRef(null);
    const moviesRef2 = useRef(null);
    const tvRef1 = useRef(null);
    const tvRef2 = useRef(null);

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

    // Connection modal handling
    useEffect(() => {
        if (error) {
            setShowConnectionModal(true);
        }
    }, [error]);

    // Alert handling for no content
    useEffect(() => {
        const hasContent = (movieList && movieList.length > 0) || (tvList && tvList.length > 0);
        // Check if there is no content available
        if (!loading && !error && !hasContent) {
            setContentAlertMessage('Your list is empty.');
        } else {
            setContentAlertMessage('');
        }

        if (!loading && !error && !hasContent) {
            // Show the alert for 5 seconds
            const timer = setTimeout(() => {
                setContentAlertMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [movieList, tvList, loading, error]);

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
            <div className="position-relative my-2">
                {movieList.filter(Boolean).length > 3 && (
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
                                onRemove={() => handleRemove(movie.id, 'movie')}
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
            <div className="position-relative my-2">
                {movieList.filter(Boolean).length > 3 && (
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
                                    onRemove={() => handleRemove(movie.id, 'movie')}
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
            <div className="position-relative my-2">
                {tvList.filter(Boolean).length > 3 && (
                    <>
                        <button
                            className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
                            onClick={() => scroll(tvRef1, 'left')}
                            style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <button
                            className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
                            onClick={() => scroll(tvRef1, 'right')}
                            style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </>
                )}

                <div
                    ref={tvRef1}
                    className="d-flex overflow-auto"
                    style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}
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
                                    onRemove={() => handleRemove(show.id, 'tv')}
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
            <div className="position-relative my-2">
                {tvList.filter(Boolean).length > 3 && (
                    <>
                        <button
                            className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
                            onClick={() => scroll(tvRef2, 'left')}
                            style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <button
                            className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
                            onClick={() => scroll(tvRef2, 'right')}
                            style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </>
                )}

                <div
                    ref={tvRef2}
                    className="d-flex overflow-auto"
                    style={{ scrollSnapType: 'x mandatory', gap: '1rem' }}
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
                                    onRemove={() => handleRemove(show.id, 'tv')}
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