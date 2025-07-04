// HomeUI.js
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import SearchBar from './SearchBar';
import SearchGrid from './SearchGrid';
import TrendingGrid from './TrendingGrid';
import ProvidersGrid from './ProvidersGrid';
import useSaveSearchHistory from '../../hooks/IndexPage/useSaveSearchHistory';
import useFetchSearchHistory from '../../hooks/IndexPage/useFetchSearchHistory';
import useRemoveSearchHistory from '../../hooks/IndexPage/useRemoveSearchHistory';
import OverlaySpinner from '../../utils/OverlaySpinner';
import ConnectionModal from '../../utils/ConnectionModal';
import Alert from '../../utils/Alert';
import './HomeUI.css';

import { getSessionValue, setSessionValue, removeSessionValue } from '../../utils/sessionStorageStates';

const SESSION_PATH = ['HomeUI'];

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

  // Grid Switcher
  const [activeGrid, setActiveGrid] = useState('trending'); // default fallback

  // Error handling flags
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [isProvidersLoading, setIsProvidersLoading] = useState(true);
  const [isSearchLoading, setIsSearchLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

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
  const containerRef = useRef(null);

  const { searchHistory, refetch } = useFetchSearchHistory();
  const saveSearchHistory = useSaveSearchHistory();
  const removeSearchHistory = useRemoveSearchHistory();

  // Restoring page states
  useEffect(() => {
    const savedWelcomeMessage = getSessionValue(...SESSION_PATH, 'welcomeMessage');
    const savedActiveGrid = getSessionValue(...SESSION_PATH, 'activeGrid');
    const savedShowSearchBar = getSessionValue(...SESSION_PATH, 'showSearchBar');
    const savedSearchQuery = getSessionValue(...SESSION_PATH, 'searchQuery') || '';
    const savedTriggerSearch = getSessionValue(...SESSION_PATH, 'triggerSearch') || '';
    const savedScrollPosition = getSessionValue(...SESSION_PATH, 'pageScrollState') || 0;

    if (savedWelcomeMessage) {
      setAlert({ message: savedWelcomeMessage, type: 'success', key: 'welcome' });
      setTimeout(() => {
        setAlert((prev) => (prev.key === 'welcome' ? { message: '', type: '', key: '' } : prev));
        removeSessionValue(...SESSION_PATH, 'welcomeMessage');
      }, 5000);
    }

    if (savedActiveGrid) {
      setActiveGrid(savedActiveGrid);
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
      setSessionValue(...SESSION_PATH, 'pageScrollState', scrollPosition);
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
    if (showSearchBar) {
      if (!isSearchLoading) {
        setIsPageLoading(false);
      }
    } else {
      if (!isTrendingLoading || !isProvidersLoading) {
        setIsPageLoading(false);
      }
    }
  }, [showSearchBar, isTrendingLoading, isProvidersLoading, isSearchLoading]);

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

  const handleGridChange = (grid) => {
    setActiveGrid(grid);
    setSessionValue(...SESSION_PATH, 'activeGrid', grid);
  };

  const handleSearchBar = () => {
    setShowSearchBar((prevState) => {
      setSessionValue(...SESSION_PATH, 'showSearchBar', (!prevState).toString());
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
    setSessionValue(...SESSION_PATH, 'searchQuery', query);
    setTriggerSearch(query);
    setSessionValue(...SESSION_PATH, 'triggerSearch', query);
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
    <div className="d-flex flex-column justify-content-center align-items-center p-0">
      <div className="w-100">
        {/* Overlay spinner for loading state */}
        <OverlaySpinner visible={isPageLoading} />

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
            containerRef={containerRef}
            dropdownRef={dropdownRef}
          />
        ) : (
          <Header />
        )}

        {!showSearchBar && (
          !title ? (
            <div className="container my-5" style={{ textAlign: 'start' }}>
              <div className="d-flex flex-column text-white custom-theme-radius-low">
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
            <div className="container my-5" style={{ textAlign: 'start' }}>
              <div className="d-flex flex-column text-white custom-theme-radius-low">
                <div className="d-flex justify-content-start align-items-center dynamic-hs">
                  <b>{isRecommended ? 'Picked Just for You' : '#1 Most Watched'}</b>
                </div>
                <div className="d-flex justify-content-start align-items-center">
                  <span className="text-wrap fw-bold dynamic-ts">{title}</span>
                </div>
                <div className="dynamic-fs">
                  <div className="dynamic-fs my-2 text-white">
                    <span className="me-2">
                      {mediaType === 'movie' ? (
                        <span><i className="bi bi-film me-2"></i>Movie</span>
                      ) : (
                        <span><i className="bi bi-tv me-2"></i>Show</span>
                      )}
                    </span>
                    <span className="me-2 text-secondary">|</span>
                    <span className="me-2">{year}</span>
                    <span className="me-2 text-secondary">|</span>
                    <i className="bi bi-star-fill text-warning me-2"></i>
                    <span id="Rating">{rating}</span>
                  </div>
                  <div className="dynamic-fs text-secondary">{mediaDesc}</div>
                  <div className="d-flex justify-content-start">
                    <button
                      className="btn bg-transparent d-flex dynamic-fs border-0 rounded-pill text-white"
                      onClick={handlePlayMedia}
                    >
                      <i className="bi bi-arrow-right me-2"></i>
                      View More
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        )}

        {/* Main content area */}
        <div className="flex-row text-white w-100">
          {!showSearchBar ?
            <div className="container mb-5">
              <div className="d-flex justify-content-start align-items-center">
                <button
                  className={`btn bg-transparent text-white border-0 dynamic-hs 
                  ${activeGrid === 'trending' ? '' : 'opacity-50'}`}
                  onClick={() => handleGridChange('trending')}
                >
                  <i className="bi bi-fire theme-color me-2"></i>
                  <b>Trending</b>
                </button>

                {/* Divider Line */}
                <div className="border-start border-secondary align-self-stretch"></div>

                <button
                  className={`btn bg-transparent text-white border-0 dynamic-hs 
                  ${activeGrid === 'providers' ? '' : 'opacity-50'}`}
                  onClick={() => handleGridChange('providers')}
                >
                  <i className="bi bi-cast theme-color me-2"></i>
                  <b>Providers</b>
                </button>
              </div>

              {activeGrid === 'trending' && (
                <TrendingGrid setIsTrendingLoading={setIsTrendingLoading} setIsTrendingLoaded={setIsTrendingLoaded} setHasTrendingContent={setHasTrendingContent} />
              )}

              {activeGrid === 'providers' && (
                <ProvidersGrid setIsProvidersLoading={setIsProvidersLoading} setIsProvidersLoaded={setIsProvidersLoaded} setHasProvidersContent={setHasProvidersContent} />
              )}
            </div>
            :
            <div className="container my-5">
              {/* SearchGrid Spacing for SearchBar.js */}
              <div className="divider" style={{ height: '3rem' }}></div>
              <div className="d-flex justify-content-start align-items-center">
                <span className="dynamic-hs">
                  <i className="bi bi-search theme-color me-2"></i>
                  <b>Search</b>
                </span>
              </div>

              <SearchGrid searchQuery={triggerSearch} setIsSearchLoading={setIsSearchLoading} setIsSearchLoaded={setIsSearchLoaded} setHasSearchContent={setHasSearchContent} />
            </div>}
        </div>

        {/* Footer Backspace & Footer */}
        <div className="divider" style={{ height: '6rem' }}></div>
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