import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from './Header';
import SearchBar from './SearchBar';
import SearchGrid from './SearchGrid';
import MediaGrid from './MediaGrid';
import GenreGrid from './GenreGrid';
import Footer from './Footer';
import useSaveSearchHistory from '../hooks/useSaveSearchHistory';
import useFetchSearchHistory from '../hooks/useFetchSearchHistory';
import useRemoveSearchHistory from '../hooks/useRemoveSearchHistory';
import Alert from '../Alert';

function HomePage({
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

  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const { searchHistory, refetch } = useFetchSearchHistory();
  const saveSearchHistory = useSaveSearchHistory();
  const removeSearchHistory = useRemoveSearchHistory();

  const fabStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.15)',
    cursor: 'pointer',
    border: 'none',
    zIndex: 1000,
  };

  const handleSearchBar = () => {
    setShowSearchBar((prevState) => !prevState);

    // Scroll to Top
    window.scrollTo({ top: 0 });
  };

  const handlePlayMedia = async () => {
    navigate(`/play?id=${mediaId}&type=${mediaType}`);
  };

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

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center poppins-medium p-0">
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

        {!showSearchBar && triggerSearch.trim() === '' && title && (
          <div 
            className="container justify-content-center"
            style={{
                textAlign: 'start',
              }}
          >
            <div
              className="d-flex flex-column text-white custom-theme-radius"
              style={{
                padding: '5%',
              }}
            >
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
                  <span id="Rating">
                    {' '}
                    {rating}
                  </span>
                </div>
                <div className="dynamic-fs my-2">{mediaDesc}</div>
                <button className="btn btn-md d-none d-md-inline-block bd-callout-dark rounded-pill border-0 my-2" onClick={handlePlayMedia}>
                  <i className="bi bi-chevron-down me-1 text-white"></i>
                  <span className="text-white">Show More</span>
                </button>
                <button className="btn btn-sm d-md-none bd-callout-dark rounded-pill border-0 my-2" onClick={handlePlayMedia}>
                  <i className="bi bi-chevron-down me-1 text-white"></i>
                  <span className="text-white">Show More</span>
                </button>
                </div>
            </div>
          </div>
        )}

        <div className="flex-row text-white w-100">
          {triggerSearch.trim() === '' ? <><MediaGrid /><GenreGrid /></> : <><SearchGrid searchQuery={triggerSearch} /><GenreGrid /></>}
        </div>

        <Footer />

        <button className="bd-callout-primary" style={fabStyle} onClick={handleSearchBar}>
          {showSearchBar ? <i className="bi bi-x-lg"></i> : <i className="bi bi-search"></i>}
        </button>

        {welcomeMessage && <Alert message={welcomeMessage} onClose={handleAlertDismiss} type="success" />}
      </div>
    </div>
  );
}

export default HomePage;