import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Card from './Card';
import useFetchMyList from '../hooks/useFetchMyList';
import Alert from '../Alert';

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
        <div className="container text-white">
            <div className="d-flex m-4 justify-content-center align-items-center">
                <div className="d-flex px-4 py-2 custom-bg-primary rounded-pill align-items-center">
                  <i className="bi bi-bookmark me-2"></i>
                  <h4 className="mb-0">My List</h4>
                </div>
            </div>

            {loading && (
                <div className="col mt-5 mb-5 d-flex justify-content-center">
                    <div className="spinner-border text-light spinner-size-1" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            )}
            {error && (
                <div className="col mt-5 mb-5">
                    <p className="text-white text-center">Oops! Something went wrong.</p>
                </div>
            )}
            {!loading && !error && (
                <>
                    {/* Movies */}
                    <div className="d-flex align-items-center my-2">
                        <i className="bi bi-film me-2"></i>
                        <h5 className="mb-0">Movies</h5>
                    </div>
                    <div className="position-relative">
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
                            {movieList.length > 0 ? (
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
                            ) : (
                                <div className="col mt-5 mb-5">
                                    <p className="text-white text-center mb-0">No movies found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {movieList.length === movieLimit && (
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
                        <i className="bi bi-tv me-2"></i>
                        <h5 className="mb-0">TV Shows</h5>
                    </div>
                    <div className="position-relative">
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
                            {tvList.length > 0 ? (
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
                            ) : (
                                <div className="col mt-5 mb-5">
                                    <p className="text-white text-center mb-0">No TV shows found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                    {tvList.length === tvLimit && (
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

export default MyListGrid;