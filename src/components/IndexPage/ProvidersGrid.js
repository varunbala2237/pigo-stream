// ProvidersGrid.js
import { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Card from '../Card';
import useFetchProviders from '../../hooks/IndexPage/useFetchProviders';
import './ProvidersGrid.css';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const PROVIDERS = [
    { id: 8, name: 'Netflix', region: 'IN', bg: 'dark', logo: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg' },
    { id: 9, name: 'Amazon Prime', region: 'US', bg: 'white', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png' },
    { id: 337, name: 'Disney+', region: 'US', bg: 'white', logo: 'https://upload.wikimedia.org/wikipedia/commons/3/3e/Disney%2B_logo.svg' },
    { id: 350, name: 'Apple TV+', region: 'US', bg: 'white', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/28/Apple_TV_Plus_Logo.svg' },
    { id: 15, name: 'Hulu', region: 'US', bg: 'dark', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/f9/Hulu_logo_%282018%29.svg' },
    { id: 2074, name: 'Lionsgate', region: 'IN', bg: 'white', logo: 'https://upload.wikimedia.org/wikipedia/commons/6/65/Lionsgate_Logo.svg' },
    { id: 2180, name: 'Sony Pictures', region: 'IN', bg: 'white', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg' },
    { id: 531, name: 'Paramount+', region: 'US', bg: 'white', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Paramount%2B_logo.svg' },
    { id: 1825, name: 'Max', region: 'US', bg: 'white', logo: 'https://upload.wikimedia.org/wikipedia/commons/c/ce/Max_logo.svg' },
    { id: 526, name: 'AMC+', region: 'US', bg: 'dark', logo: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/AMC%2B_logo.png' },
    { id: 123, name: 'FXNow', region: 'US', bg: 'white', logo: 'https://cdn2.downdetector.com/static/uploads/c/300/f4061/FXNOW-logo.png' },
    { id: 283, name: 'Crunchyroll', region: 'US', bg: 'white', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/85/Crunchyroll_2024_stacked.svg' },
];

const SESSION_PATH = ['HomeUI', 'Grids', 'ProvidersGrid'];

const ProvidersGrid = ({ setIsProvidersLoading, setIsProvidersError, setHasProvidersContent }) => {
    // Restore the selected provider value
    const [selectedProvider, setSelectedProvider] = useState(() => {
        return getSessionValue(...SESSION_PATH, 'selectedProvider') ?? PROVIDERS[0];
    });

    const selectedProviderId = selectedProvider?.id;
    const selectedRegion = PROVIDERS.find(p => p.id === selectedProviderId)?.region;

    const { movies, shows, loading: isLoading, error: isError } = useFetchProviders(
        selectedProviderId,
        selectedRegion
    );

    const location = useLocation();

    // Scroll references for movies and shows
    const moviesRef = useRef(null);
    const showsRef = useRef(null);
    const providersRef = useRef(null);

    // Loading handling
    useEffect(() => {
        if (isLoading) {
            setIsProvidersLoading(true);
        } else {
            setIsProvidersLoading(false);
        }
    }, [isLoading, setIsProvidersLoading]);

    // Error handling
    useEffect(() => {
        if (isError) {
            setIsProvidersError(isError);
        }
    }, [isError, setIsProvidersError]);

    // No content handling
    useEffect(() => {
        if (!isLoading && !isError) {
            const hasContent = (movies && movies.length > 0) || (shows && shows.length > 0);
            setHasProvidersContent(hasContent);
        }
    }, [isLoading, isError, movies, shows, setHasProvidersContent]);

    // Auto-scroll to selected provider on mount
    useLayoutEffect(() => {
        const container = providersRef.current;
        if (!container || !selectedProvider) return;

        const providerIndex = PROVIDERS.findIndex(p => p.id === selectedProvider.id);
        const providerCard = container.children[providerIndex];

        if (providerCard) {
            const containerRect = container.getBoundingClientRect();
            const cardRect = providerCard.getBoundingClientRect();

            const offset = cardRect.left - containerRect.left;
            const scrollAdjustment = offset - (container.clientWidth / 2) + (cardRect.width / 2);

            container.scrollBy({
                left: scrollAdjustment,
                behavior: 'instant',
            });
        }
    }, [selectedProvider]);

    // Load from sessionStorage on mount
    useEffect(() => {
        const savedMoviesScroll = getSessionValue(...SESSION_PATH, 'moviesScroll') || 0;
        const savedShowsScroll = getSessionValue(...SESSION_PATH, 'showsScroll') || 0;

        requestAnimationFrame(() => {
            if (moviesRef.current) moviesRef.current.scrollTo({ left: savedMoviesScroll, behavior: 'instant' });
            if (showsRef.current) showsRef.current.scrollTo({ left: savedShowsScroll, behavior: 'instant' });
        });
    }, [isLoading, isError]);

    // Save selectedProvider and providersScroll on change
    useEffect(() => {
        const providersNode = providersRef.current;
        if (!providersNode) return;

        if (selectedProvider !== null) {
            setSessionValue(...SESSION_PATH, 'selectedProvider', selectedProvider);
        }
    }, [selectedProvider]);

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

    const scroll = (ref, direction) => {
        if (ref.current) {
            ref.current.scrollBy({
                left: direction === 'left' ? -450 : 450,
                behavior: 'smooth',
            });
        }
    };

    return (
        <>
            <div className="d-flex justify-content-start align-items-center border-start border-4 theme-border-color dynamic-ts ps-2 mt-5">
                <b>Browse by Streaming Platform</b>
            </div>

            {/* Providers Selection Section */}
            <div className="d-flex my-2 justify-content-between align-items-stretch">
                <div
                    ref={providersRef}
                    className="d-flex overflow-auto scroll-hide"
                    style={{ scrollSnapType: 'x mandatory' }}
                >
                    {PROVIDERS.map((provider) => (
                        <div className="custom-provider-card-wrapper">
                        <div
                            key={provider.id}
                            className={
                                `custom-provider-card
                                bg-${provider.bg} 
                                d-flex justify-content-center align-items-center 
                                ${selectedProvider.id === provider.id ? 'border border-2 border-primary' : ''}`
                            }
                            onClick={() => setSelectedProvider(provider)}
                        >
                            <img
                                src={provider.logo}
                                alt={provider.name}
                                className="img-fluid custom-provider-card-img"
                            />
                        </div>
                        </div>
                    ))}
                </div>

                {/* Vertical scroll buttons */}
                <div className="d-none d-md-flex flex-column ms-2 align-self-stretch">
                    <button
                        className="btn btn-dark bd-callout-dark flex-fill py-2"
                        onClick={() => scroll(providersRef, 'left')}
                    >
                        <i className="bi bi-chevron-left"></i>
                    </button>
                    <button
                        className="btn btn-dark bd-callout-dark flex-fill py-2 mt-2"
                        onClick={() => scroll(providersRef, 'right')}
                    >
                        <i className="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            <div className="d-flex justify-content-start align-items-center border-start border-4 theme-border-color dynamic-ts ps-2 mt-5">
                <b>{selectedProvider.name}: Movies</b>
            </div>

            {/* Providers Movies Section */}
            <div className="d-flex my-2 justify-content-between align-items-stretch">
                <div ref={moviesRef} className="d-flex overflow-auto scroll-hide" style={{ scrollSnapType: 'x mandatory' }}>
                    {(
                        !isLoading && !isError && movies?.length > 0 ? movies : []
                    )
                        .concat(Array.from({ length: Math.max(0, 8 - (movies?.length || 0)) }))
                        .map((movie, index) =>
                            movie ? (
                                <Card key={movie.id} media={movie} type="movie" path={location.pathname} isDeletable={false} />
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

            <div className="d-flex justify-content-start align-items-center border-start border-4 theme-border-color dynamic-ts ps-2 mt-5">
                <b>{selectedProvider.name}: Shows</b>
            </div>

            {/* Providers Shows Section */}
            <div className="d-flex my-2 justify-content-between align-items-stretch">
                <div ref={showsRef} className="d-flex overflow-auto scroll-hide" style={{ scrollSnapType: 'x mandatory' }}>
                    {(
                        !isLoading && !isError && shows?.length > 0 ? shows : []
                    )
                        .concat(Array.from({ length: Math.max(0, 8 - (shows?.length || 0)) }))
                        .map((show, index) =>
                            show ? (
                                <Card key={show.id} media={show} type="tv" path={location.pathname} isDeletable={false} />
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
        </>
    );
}

export default ProvidersGrid;