import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
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

import { getSessionValue, setSessionValue, removeSessionValue } from '../../utils/sessionStorageStates';

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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Error handling flags
  const [isTrendingLoaded, setIsTrendingLoaded] = useState(true);
  const [isProvidersLoaded, setIsProvidersLoaded] = useState(true);
  const [isSearchLoaded, setIsSearchLoaded] = useState(true);
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  // No content handling flags
  const [hasTrendingContent, setHasTrendingContent] = useState(true);
  const [hasProvidersContent, setHasProvidersContent] = useState(true);
  const [hasSearchContent, setHasSearchContent] = useState(true);

  // Alert messages
  const [alert, setAlert] = useState({ message: '', type: '', key: '' });

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const { searchHistory, refetch } = useFetchSearchHistory();
  const saveSearchHistory = useSaveSearchHistory();
  const removeSearchHistory = useRemoveSearchHistory();

  // Restoring page states
  useEffect(() => {
    const savedWelcomeMessage = getSessionValue('HomeUI', 'welcomeMessage');
    const savedShowSearchBar = getSessionValue('HomeUI', 'showSearchBar');
    const savedSearchQuery = getSessionValue('HomeUI', 'searchQuery') || '';
    const savedTriggerSearch = getSessionValue('HomeUI', 'triggerSearch') || '';
    const savedScrollPosition = getSessionValue('HomeUI', 'pageScrollState') || 0;

    if (savedWelcomeMessage) {
      setAlert({ message: savedWelcomeMessage, type: 'success', key: 'welcome' });
      setTimeout(() => {
        setAlert((prev) => (prev.key === 'welcome' ? { message: '', type: '', key: '' } : prev));
        removeSessionValue('HomeUI', 'welcomeMessage');
      }, 5000);
    }

    if (savedShowSearchBar !== null) {
      setShowSearchBar(savedShowSearchBar === 'true');
    }

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
      setSessionValue('HomeUI', 'pageScrollState', scrollPosition);
    };

    window.addEventListener('scroll', handlePageScroll);
    return () => {
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, [setShowSearchBar, setTriggerSearch]);

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
  }, [hasTrendingContent, hasProvidersContent, hasSearchContent, searchQuery]);

  const handleSearchBar = () => {
    setShowSearchBar((prevState) => {
      setSessionValue('HomeUI', 'showSearchBar', (!prevState).toString());
      return !prevState;
    });

    // Reset search query and trigger search
    handleSearchInputChange({ target: { value: '' } });

    // Scroll to Top
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
  };

  const handleSearchInputChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSessionValue('HomeUI', 'searchQuery', query);
    setTriggerSearch(query);
    setSessionValue('HomeUI', 'triggerSearch', query);
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

  const handleAlertDismiss = () => {
    setAlert({ message: '', type: '', key: '' });
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
              <div className="d-flex flex-column text-white custom-theme-radius-low" style={{ padding: '5%' }}>
                <div className="d-flex align-items-center mb-2">
                  <div className="hero-skeleton-title-bar bd-callout-dark"></div>
                  <div className="hero-skeleton-badge custom-theme-radius-low custom-bg ms-2"></div>
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
              <div className="d-flex flex-column text-white custom-theme-radius-low" style={{ padding: '5%' }}>
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

        {/* Footer Backspace & Footer */}
        <div className="divider" style={{ height: '4rem' }}></div>
        <Footer showSearchBar={showSearchBar} setShowSearchBar={setShowSearchBar} handleSearchBar={handleSearchBar} />

        {/* Connection Modal */}
        {showConnectionModal && <ConnectionModal show={showConnectionModal} />}

        {/* Alert Message */}
        {alert.message && (
          <Alert message={alert.message} onClose={handleAlertDismiss} type={alert.type} />
        )}
      </div>
    </div>
  );
}

export default HomeUI;