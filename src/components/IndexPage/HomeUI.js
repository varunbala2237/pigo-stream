import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import SearchBar from './SearchBar';
import SearchGrid from './SearchGrid';
import TrendingGrid from './TrendingGrid';
import useSaveSearchHistory from '../../hooks/IndexPage/useSaveSearchHistory';
import useFetchSearchHistory from '../../hooks/IndexPage/useFetchSearchHistory';
import useRemoveSearchHistory from '../../hooks/IndexPage/useRemoveSearchHistory';
import ConnectionModal from '../../utils/ConnectionModal';
import Alert from '../../utils/Alert';
import ProvidersGrid from './ProvidersGrid';
import './HomeUI.css';

function HomeUI({
  title,
  mediaId,
  mediaType,
  mediaDesc,
  rating,
  year,
  showSearchBar,
  setShowSearchBar,
  triggerSearch,
  setTriggerSearch,
  isRecommended,
}) {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedButton, setSelectedButton] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

  // Error handling flags
  const [isTrendingLoaded, setIsTrendingLoaded] = useState(true);
  const [isProvidersLoaded, setIsProvidersLoaded] = useState(true);
  const [isSearchLoaded, setIsSearchLoaded] = useState(true);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  // No content handling flags
  const [hasTrendingContent, setHasTrendingContent] = useState(true);
  const [hasProvidersContent, setHasProvidersContent] = useState(true);
  const [hasSearchContent, setHasSearchContent] = useState(true);
  const [contentAlertMessage, setContentAlertMessage] = useState('');

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const { searchHistory, refetch } = useFetchSearchHistory();
  const saveSearchHistory = useSaveSearchHistory();
  const removeSearchHistory = useRemoveSearchHistory();

  useEffect(() => {
    const savedWelcomeMessage = sessionStorage.getItem('welcomeMessage');
    if (savedWelcomeMessage) {
      setWelcomeMessage(savedWelcomeMessage);
      setTimeout(() => setWelcomeMessage(''), 5000);
      sessionStorage.removeItem('welcomeMessage');
    }

    const savedPageState = sessionStorage.getItem('indexPageState');
    if (savedPageState) {
      const { savedFilter, savedScrollPosition, savedSearchQuery } = JSON.parse(savedPageState);
      if (savedFilter) setSelectedButton(savedFilter);
      if (savedSearchQuery && savedSearchQuery.trim() !== '') {
        setSearchQuery(savedSearchQuery);
        setTriggerSearch(savedSearchQuery);
      }
      if (savedScrollPosition !== undefined) {
        setTimeout(() => {
          window.scrollTo({ top: savedScrollPosition });
        }, 500);
      }
    }

    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      updateLocalStorage(selectedButton, scrollPosition, searchQuery);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [searchQuery, selectedButton, setTriggerSearch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        !inputRef.current.contains(event.target)
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

  // Connection modal handling
  useEffect(() => {
    if (!isTrendingLoaded || !isProvidersLoaded || !isSearchLoaded) {
      setShowConnectionModal(true);
    }
  }, [isTrendingLoaded, isProvidersLoaded, isSearchLoaded]);

  // Function to handle alert message updates
  const handleAlertMessage = (hasTrendingContent, hasProvidersContent, hasSearchContent, searchQuery) => {
    let alertMessage = '';

    // Check if there's no content available for trending and providers
    if (!hasTrendingContent && !hasProvidersContent) {
      alertMessage = 'No content available from trending or providers.';
    } else if (!hasTrendingContent) {
      alertMessage = 'No trending content available.';
    } else if (!hasProvidersContent) {
      alertMessage = 'No content found for available providers.';
    }

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

    const alertMessage = handleAlertMessage(hasTrendingContent, hasProvidersContent, hasSearchContent, searchQuery);

    if (alertMessage) {
      showTimer = setTimeout(() => {
        setContentAlertMessage(alertMessage);

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
  }, [hasTrendingContent, hasProvidersContent, hasSearchContent, searchQuery]);

  const handleSearchBar = () => {
    setShowSearchBar((prevState) => !prevState);

    // Reset search query and trigger search
    handleSearchInputChange({ target: { value: '' } });

    // Scroll to Top
    window.scrollTo({ top: 0 });
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateLocalStorage(selectedButton, window.scrollY, query);
    if (query === '') setTriggerSearch('');
  };

  const handleSelectSearch = (query) => {
    setSearchQuery(query);
    setTriggerSearch(query);
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

  const updateLocalStorage = (filter, scrollPosition, query) => {
    const pageState = JSON.stringify({
      savedFilter: filter,
      savedScrollPosition: scrollPosition,
      savedSearchQuery: query,
    });
    sessionStorage.setItem('indexPageState', pageState);
  };

  const handleAlertDismiss = () => {
    setContentAlertMessage('');
    setWelcomeMessage('');
  };

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

  const handlePlayMedia = async () => {
    navigate(`/play?id=${mediaId}&type=${mediaType}`);
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center p-0">
      <div className="w-100">
        {showSearchBar ? (
          <SearchBar
            searchQuery={searchQuery}
            handleSearchInputChange={handleSearchInputChange}
            handleSelectSearch={handleSelectSearch}
            searchHistory={searchHistory}
            isDropdownOpen={isDropdownOpen}
            handleRemoveSearchHistory={handleRemoveSearchHistory}
            handleSearchSubmit={handleSearchSubmit}
            handleFocus={handleFocus}
            inputRef={inputRef}
            dropdownRef={dropdownRef}
          />
        ) : (
          <Header />
        )}

        {!showSearchBar && (
          !title ? (
            <div className="container justify-content-center" style={{ textAlign: 'start' }}>
              <div className="d-flex flex-column text-white custom-theme-radius" style={{ padding: '5%' }}>
                <div className="d-flex align-items-center mb-2">
                  <div className="hero-skeleton-title-bar bd-callout-dark"></div>
                  <div className="hero-skeleton-badge custom-theme-radius custom-bg ms-2"></div>
                </div>
                <div className="dynamic-fs text-white">
                  <div className="dynamic-fs my-2 d-flex align-items-center">
                    <div className="hero-skeleton-icon bd-callout-dark me-2"></div>
                    <div className="hero-skeleton-bar custom-bg me-2" style={{ width: '50px' }}></div>
                    <div className="hero-skeleton-icon bd-callout-dark me-2"></div>
                    <div className="hero-skeleton-bar custom-bg" style={{ width: '50px' }}></div>
                  </div>
                  <div className="dynamic-fs my-2">
                    <div className="hero-skeleton-bar" style={{ width: '100%' }}></div>
                  </div>
                  <div className="btn hero-skeleton-button my-2 bd-callout-dark"></div>
                </div>
              </div>
            </div>
          ) : (
            <div className="container justify-content-center" style={{ textAlign: 'start' }}>
              <div className="d-flex flex-column text-white custom-theme-radius" style={{ padding: '5%' }}>
                <div className="d-flex align-items-center">
                  <b className="text-wrap dynamic-ts">{title}</b>
                  {/* Badge for Recommended or Popular */}
                  <span className="badge bg-primary text-white rounded-pill ms-2">
                    {isRecommended ? 'Recommended' : 'Popular'}
                  </span>
                </div>
                <div className="dynamic-fs text-white">
                  <div className="dynamic-fs my-2">
                    <span className="me-2">
                      {mediaType === 'movie' ? (
                        <i className="bi bi-film"></i>
                      ) : (
                        <i className="bi bi-tv"></i>
                      )}
                    </span>
                    <span className="me-2">{year}</span>
                    <i className="bi bi-star-fill"></i>
                    <span id="Rating"> {rating}</span>
                  </div>
                  <div className="dynamic-fs my-2">{mediaDesc}</div>
                  <button
                    className="btn btn-dark btn-md d-none d-md-inline-block bd-callout-dark rounded-pill border-0 my-2"
                    onClick={handlePlayMedia}
                  >
                    <i className="bi bi-play-fill me-2"></i>
                    <span>Watch Now</span>
                  </button>
                  <button
                    className="btn btn-dark btn-sm d-md-none bd-callout-dark rounded-pill border-0 my-2"
                    onClick={handlePlayMedia}
                  >
                    <i className="bi bi-play-fill me-2"></i>
                    <span>Watch Now</span>
                  </button>
                </div>
              </div>
            </div>
          )
        )}

        {/* Main content area */}
        <div className="flex-row text-white w-100">
          {!showSearchBar ?
            <>
              <TrendingGrid setIsTrendingLoaded={setIsTrendingLoaded} setHasTrendingContent={setHasTrendingContent} />
              <ProvidersGrid setIsProvidersLoaded={setIsProvidersLoaded} setHasProvidersContent={setHasProvidersContent} />
            </>
            :
            <>
              <SearchGrid searchQuery={triggerSearch} setIsSearchLoaded={setIsSearchLoaded} setHasSearchContent={setHasSearchContent} />
            </>}
        </div>

        <button className="btn btn-dark fab bd-callout-dark border-0 rounded-circle shadow" onClick={handleSearchBar}>
          {showSearchBar ? <i className="bi bi-x-lg"></i> : <i className="bi bi-search"></i>}
        </button>

        {/* Connection Modal */}
        {showConnectionModal && <ConnectionModal show={showConnectionModal} />}

        {/* Alert for no content */}
        {contentAlertMessage && (
          <Alert message={contentAlertMessage} onClose={handleAlertDismiss} type="primary" />
        )}

        {/* Alert for welcome message */}
        {welcomeMessage && <Alert message={welcomeMessage} onClose={handleAlertDismiss} type="success" />}
      </div>

      {/* Footer Backspace */}
      <div style={{ height: '5rem' }}></div>
    </div>
  );
}

export default HomeUI;