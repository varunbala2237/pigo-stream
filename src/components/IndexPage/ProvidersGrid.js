import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchProviders from '../../hooks/useFetchProviders';

const PROVIDERS = [
    { id: 8, name: 'Netflix', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { id: 9, name: 'Amazon Prime', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png' },
    { id: 337, name: 'Disney+', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
    { id: 386, name: 'Apple TV+', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' },
    { id: 15, name: 'Hulu', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Hulu_logo_%282018%29.svg' },
    { id: 387, name: 'Paramount+', logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9f/Paramount_Network.svg' },
    { id: 531, name: 'Peacock', logo: 'https://upload.wikimedia.org/wikipedia/commons/d/d3/NBCUniversal_Peacock_Logo.svg' },
    { id: 43, name: 'YouTube', logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b8/YouTube_Logo_2017.svg' },
];

function ProvidersGrid({ setIsProvidersLoaded, setHasProvidersContent }) {
    const [selectedProvider, setSelectedProvider] = useState(null);
    const { movies, shows, isLoading, isError } = useFetchProviders(selectedProvider);
    const location = useLocation();

    // Scroll references for movies and TV shows
    const moviesRef = useRef(null);
    const tvRef = useRef(null);
    const providersRef = useRef(null);

    useEffect(() => {
        if (isError) {
            setIsProvidersLoaded(false);
        } else {
            setIsProvidersLoaded(true);
        }
    }, [isError, setIsProvidersLoaded]);

    useEffect(() => {
        if (!isLoading && !isError) {
            const hasContent = (movies && movies.length > 0) || (shows && shows.length > 0);
            setHasProvidersContent(hasContent);
        }
    }, [isLoading, isError, movies, shows, setHasProvidersContent]);

    // Load selected provider from localStorage or default to Netflix
    useEffect(() => {
        const savedProvider = localStorage.getItem('selectedProvider');
        if (savedProvider) {
            setSelectedProvider(Number(savedProvider));
        } else {
            setSelectedProvider(PROVIDERS[0].id);
        }
    }, []);

    // Save selected provider to localStorage whenever it changes
    useEffect(() => {
        if (selectedProvider !== null) {
            localStorage.setItem('selectedProvider', selectedProvider);
        }
    }, [selectedProvider]);

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

    const scrollProviders = (direction) => {
        if (providersRef.current) {
            providersRef.current.scrollBy({
                left: direction === 'left' ? -450 : 450,
                behavior: 'smooth',
            });
        }
    };

    return (
        <div className="container text-white">
            {/* Providers Selection Section */}
            <div className="position-relative my-3">
                {PROVIDERS.length > 4 && (
                    <>
                        <button
                            className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
                            onClick={() => scrollProviders('left')}
                            style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
                        >
                            <i className="bi bi-chevron-left"></i>
                        </button>
                        <button
                            className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
                            onClick={() => scrollProviders('right')}
                            style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
                        >
                            <i className="bi bi-chevron-right"></i>
                        </button>
                    </>
                )}
                <div
                    ref={providersRef}
                    className="d-flex overflow-auto gap-3 px-4"
                    style={{ scrollSnapType: 'x mandatory', scrollBehavior: 'smooth' }}
                >
                    {PROVIDERS.map((provider) => (
                        <div
                            key={provider.id}
                            className={`provider-card bg-white custom-theme-radius-low d-flex justify-content-center align-items-center ${selectedProvider === provider.id ? 'border border-3 border-primary' : ''}`}
                            onClick={() => setSelectedProvider(provider.id)}
                            style={{ scrollSnapAlign: 'start' }}
                        >
                            <img
                                src={provider.logo}
                                alt={provider.name}
                                className="img-fluid provider-logo"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Providers Movies Section */}
            <div className="position-relative my-2">
                {movies.length > 3 && (
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
                    {!isLoading && !isError && movies.length > 0
                        ? movies.map((movie) => (
                            <Card key={movie.id} media={movie} type="movie" path={location.pathname} />
                        ))
                        : Array.from({ length: 6 }).map((_, index) => (
                            <Card
                                key={`movie-skeleton-${index}`}
                                media={{ poster_path: null, vote_average: null }}
                                type="movie"
                                path="/"
                                isDeletable={false}
                                isSkeleton={true}
                            />
                        ))}
                </div>
            </div>

            {/* Providers TV Shows Section */}
            <div className="position-relative my-2">
                {shows.length > 3 && (
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
                    {!isLoading && !isError && shows.length > 0
                        ? shows.map((show) => (
                            <Card key={show.id} media={show} type="tv" path={location.pathname} />
                        ))
                        : Array.from({ length: 6 }).map((_, index) => (
                            <Card
                                key={`tv-skeleton-${index}`}
                                media={{ poster_path: null, vote_average: null }}
                                type="tv"
                                path="/"
                                isDeletable={false}
                                isSkeleton={true}
                            />
                        ))}
                </div>
            </div>
        </div>
    );
}

export default ProvidersGrid;