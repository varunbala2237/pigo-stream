// SearchUI.js
import { useEffect, useState, useRef } from "react";
import Header from '../Header';
import Footer from '../Footer';
import SearchBar from './SearchBar';
import SearchGrid from './SearchGrid';
import useSaveSearchHistory from '../../hooks/IndexPage/useSaveSearchHistory';
import useFetchSearchHistory from '../../hooks/IndexPage/useFetchSearchHistory';
import useRemoveSearchHistory from '../../hooks/IndexPage/useRemoveSearchHistory';
import OverlaySpinner from '../../utils/OverlaySpinner';
import ErrorModal from '../../utils/ErrorModal';
import Alert from '../../utils/Alert';

import { getSessionValue, setSessionValue, removeSessionValue } from '../../utils/sessionStorageStates';

const SESSION_PATH = ['SearchUI'];

const SearchUI = () => {
    const [triggerSearch, setTriggerSearch] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Loading and error handling flags
    const [isSearchLoading, setIsSearchLoading] = useState(true);
    const [isSearchError, setIsSearchError] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const isError = isSearchError;

    // No content handling flags
    const [hasSearchContent, setHasSearchContent] = useState(true);

    // Alert messages
    const [alert, setAlert] = useState({ message: '', type: '', key: '' });

    const dropdownRef = useRef(null);
    const containerRef = useRef(null);

    const { searchHistory, refetch } = useFetchSearchHistory();
    const saveSearchHistory = useSaveSearchHistory();
    const removeSearchHistory = useRemoveSearchHistory();

    // Restoring page states
    useEffect(() => {
        const savedSearchQuery = getSessionValue(...SESSION_PATH, 'searchQuery') || '';
        const savedTriggerSearch = getSessionValue(...SESSION_PATH, 'triggerSearch') || '';
        const savedScrollPosition = getSessionValue(...SESSION_PATH, 'pageScrollState') || 0;

        if (savedSearchQuery.trim() !== '' && savedTriggerSearch.trim() !== '') {
            setSearchQuery(savedSearchQuery);
            setTriggerSearch(savedTriggerSearch);
        }

        if (savedScrollPosition) {
            requestAnimationFrame(() => {
                window.scrollTo({ top: savedScrollPosition, behavior: 'instant' });
            });
        }

        const handlePageScroll = () => {
            const scrollPosition = window.scrollY;
            setSessionValue(...SESSION_PATH, 'pageScrollState', scrollPosition);
        };

        window.addEventListener('scroll', handlePageScroll);
        return () => {
            window.removeEventListener('scroll', handlePageScroll);
        };
    }, [setTriggerSearch]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target) &&
                !containerRef.current.contains(event.target)
            ) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    // Page loading state handling
    useEffect(() => {
        if (!isSearchLoading || searchQuery === '') {
            setIsSearchLoading(false);
        }
    }, [isSearchLoading, searchQuery]);

    // Error Modal handling
    useEffect(() => {
        if (isSearchError) {
            setShowErrorModal(true);
        }
    }, [isSearchError]);

    // Function to handle alert message updates
    const handleAlertMessage = (hasSearchContent, searchQuery) => {
        let alertMessage = '';

        // Check if there's no content available for search
        if (!hasSearchContent) {
            alertMessage = `No results found for "${searchQuery}".`;
        }

        return alertMessage;
    };

    // Alert handling for no content
    useEffect(() => {
        let showTimer;
        let hideTimer;

        const alertMessage = handleAlertMessage(hasSearchContent, searchQuery);

        if (alertMessage) {
            showTimer = setTimeout(() => {
                setAlert({ message: alertMessage, type: 'primary', key: 'content' });

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
    }, [hasSearchContent, searchQuery]);

    const handleSearchInputChange = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        setSessionValue(...SESSION_PATH, 'searchQuery', query);
        setTriggerSearch(query);
        setSessionValue(...SESSION_PATH, 'triggerSearch', query);
    };

    const handleSelectSearch = (query) => {
        setSearchQuery(query);
        setSessionValue(...SESSION_PATH, 'searchQuery', query);
        setTriggerSearch(query);
        setSessionValue(...SESSION_PATH, 'triggerSearch', query);
        
        setIsDropdownOpen(false);

        // Check if the last entry in search history matches the current query
        const lastSearch = searchHistory.length > 0 ? searchHistory[searchHistory.length - 1].query : null;

        if (query !== '' && query !== lastSearch) {
            saveSearchHistory(query);
            refetch();
        }
    };

    const handleRemoveSearchHistory = (e, id) => {
        e.stopPropagation();
        e.preventDefault();
        removeSearchHistory(id);
        refetch();
    };

    const handleAlertDismiss = () => {
        setAlert({ message: '', type: '', key: '' });
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        removeSessionValue(...SESSION_PATH, 'searchQuery');
        setTriggerSearch('');
        removeSessionValue(...SESSION_PATH, 'triggerSearch');
    }

    const handleSearchSubmit = () => {
        if (searchQuery.trim() !== '') {
            setTriggerSearch(searchQuery);

            // Check if the last entry in search history matches the current query
            const lastSearch = searchHistory.length > 0 ? searchHistory[searchHistory.length - 1].query : null;

            if (searchQuery !== lastSearch) {
                saveSearchHistory(searchQuery);
                refetch();
            }

            // Initially hide to make the results visible
            setIsDropdownOpen(false);
        }
    };

    const handleFocus = () => {
        refetch();
        setIsDropdownOpen(true);
    };

    return (
        <div className="container-fluid d-flex flex-column justify-content-center align-items-center p-0">
            <div className="w-100">
                {/* Overlay spinner for loading state */}
                <OverlaySpinner visible={isSearchLoading} />

                {/* Header */}
                <Header />

                <div className="d-flex flex-column justify-content-center align-items-center text-white p-0">

                    <div className="container mb-5 mt-4">
                        {/* SearchGrid Spacing for SearchBar.js */}
                        <div className="d-flex justify-content-start align-items-center mb-2">
                            <span className="dynamic-hs">
                                <i className="bi bi-search theme-color me-2"></i>
                                <b>Search</b>
                            </span>
                        </div>

                        <SearchBar
                            searchQuery={searchQuery}
                            handleSearchInputChange={handleSearchInputChange}
                            handleSelectSearch={handleSelectSearch}
                            searchHistory={searchHistory}
                            isDropdownOpen={isDropdownOpen}
                            handleRemoveSearchHistory={handleRemoveSearchHistory}
                            handleClearSearch={handleClearSearch}
                            handleSearchSubmit={handleSearchSubmit}
                            handleFocus={handleFocus}
                            containerRef={containerRef}
                            dropdownRef={dropdownRef}
                        />

                        <SearchGrid searchQuery={triggerSearch} setIsSearchLoading={setIsSearchLoading} setIsSearchError={setIsSearchError} setHasSearchContent={setHasSearchContent} />
                    </div>
                </div>

                {/* Error Modal */}
                {showErrorModal && <ErrorModal error={isError} />}

                {/* Alert Message */}
                {alert.message && (
                    <Alert message={alert.message} onClose={handleAlertDismiss} type={alert.type} />
                )}

                {/* Footer Backspace & Footer */}
                <div className="divider" style={{ height: '6rem' }}></div>
                <Footer />
            </div>
        </div>
    );
}

export default SearchUI;