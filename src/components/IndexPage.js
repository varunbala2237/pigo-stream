import React, { useState, useRef, useEffect } from 'react';
import Header from './Header';
import SearchGrid from './SearchGrid';
import CarouselGrid from './CarouselGrid';
import MediaGrid from './MediaGrid';
import Footer from './Footer';
import useSaveSearchHistory from '../hooks/useSaveSearchHistory';
import useFetchSearchHistory from '../hooks/useFetchSearchHistory';
import useRemoveSearchHistory from '../hooks/useRemoveSearchHistory';
import Alert from '../Alert';

function IndexPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [triggerSearch, setTriggerSearch] = useState('');
  const [selectedButton, setSelectedButton] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [welcomeMessage, setWelcomeMessage] = useState('');

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
  }, [searchQuery, selectedButton]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside); // For mobile

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside); // For mobile
    };
  }, []);

  const handleSearch = () => {
    const trimmedQuery = searchQuery.trim();
    setTriggerSearch(trimmedQuery);
  
    // Check if the last entry in search history matches the current query
    const lastSearch = searchHistory.length > 0 ? searchHistory[searchHistory.length - 1].query : null;

    if (trimmedQuery !== '' && trimmedQuery !== lastSearch) {
      saveSearchHistory(trimmedQuery); // Ensure save operation completes
      refetch();
    }
  
    setIsDropdownOpen(false);
    window.scrollTo({ top: 0 });
  };

  const handleButtonClick = (category) => {
    setSelectedButton(category);
    updateLocalStorage(category, window.scrollY, searchQuery);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setTriggerSearch('');
    updateLocalStorage(selectedButton, window.scrollY, '');
  };

  const updateLocalStorage = (filter, scrollPosition, query) => {
    const pageState = JSON.stringify({
      savedFilter: filter,
      savedScrollPosition: scrollPosition,
      savedSearchQuery: query,
    });
    sessionStorage.setItem('indexPageState', pageState);
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
    e.stopPropagation(); // Prevent event from propagating to the form's onSubmit event
    e.preventDefault(); // Prevent the default button behavior
    removeSearchHistory(id);
    refetch();
  };

  const handleFocus = () => {
    refetch();
    setIsDropdownOpen(true);
  };

  const handleAlertDismiss = () => {
    setWelcomeMessage('');
  };

  return (
    <div className="container-fluid d-flex flex-column justify-content-center align-items-center poppins-medium">
      <Header />
      <div className="flex-row text-white custom-w-size-95">
        <div className="d-flex justify-content-end position-relative">
          <div ref={inputRef} className="input-group custom-input-group custom-border">
            <input
              id="prompt"
              type="text"
              className="form-control custom-bg-primary text-white custom-textarea custom-border-l border-0"
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchInputChange}
              onFocus={handleFocus}
              inputMode="text"          
              aria-autocomplete="list"
            />

            {isDropdownOpen && (
              <ul 
                ref={dropdownRef} 
                className="dropdown-menu show position-absolute bd-callout-dark custom-theme-radius p-0" 
                style={{ top: '100%', left: 0, right: 0, maxWidth: '100vw', zIndex: 1000 }}
              >
                {searchHistory.length === 0 ? (
                  <li className="dropdown-item text-white bg-transparent text-nowrap text-truncate">No search history.</li>
                ) : (
                  [...searchHistory].reverse().map(({ id, query }, index) => (
                    <React.Fragment key={id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <i className="bi bi-clock text-white ms-3"></i>
                        <li
                          key={id}
                          className="dropdown-item d-flex justify-content-between align-items-center text-white bg-transparent"
                          onClick={() => handleSelectSearch(query)}
                          style={{ 
                            whiteSpace: 'nowrap', // Prevents text from wrapping
                            overflow: 'hidden',   // Hides overflow content
                            textOverflow: 'ellipsis' // Adds ellipsis if content overflows
                          }}
                        >
                          {query}
                        </li>
                        <button className="btn btn-transparent border-0 me-2" onClick={(e) => handleRemoveSearchHistory(e, id)}>
                          <i className="bi bi-x-lg text-white"></i>
                        </button>
                      </div>
                      {index < searchHistory.length - 1 && <li className="dropdown-divider bg-secondary m-0"></li>}
                    </React.Fragment>
                  ))
                )}
              </ul>
            )}

            <button className="btn btn-dark custom-bg-primary m-0 border-0 custom-border-r" onClick={handleSearch}>
              <i className="bi bi-search"></i>
            </button>

            {searchQuery && (
              <button className="btn btn-dark custom-bg-primary m-0 border-0 custom-border-r" type="button" onClick={handleClearSearch}>
                <i className="bi bi-x-lg"></i>
              </button>
            )}
          </div>

          {!isDropdownOpen && (
            <div className="d-flex ms-2" title="Filters">
            {/* Button for medium and large screens */}
              <button
                type="button"
                className={`rounded-pill btn ${selectedButton === 'all' ? 'btn-dark custom-bg-primary text-white' : 'btn-transparent btn-md text-secondary'} border-0 d-none d-md-inline-block`}
                onClick={() => handleButtonClick('all')}
              >
                All
              </button>
              {/* Button for small screens */}
              <button
                type="button"
                className={`rounded-pill btn ${selectedButton === 'all' ? 'btn-dark custom-bg-primary text-white' : 'btn-transparent btn-sm text-secondary'} border-0 d-md-none`}
                onClick={() => handleButtonClick('all')}
              >
                All
              </button>
              {/* Button for medium and large screens */}
              <button
                type="button"
                className={`rounded-pill btn ${selectedButton === 'movie' ? 'btn-dark custom-bg-primary text-white' : 'btn-transparent btn-md text-secondary'} border-0 d-none d-md-inline-block`}
                onClick={() => handleButtonClick('movie')}
              >
                Movies
              </button>
              {/* Button for small screens */}
              <button
                type="button"
                className={`rounded-pill btn ${selectedButton === 'movie' ? 'btn-dark custom-bg-primary text-white' : 'btn-transparent btn-sm text-secondary'} border-0 d-md-none`}
                onClick={() => handleButtonClick('movie')}
              >
                Movies
              </button>
              {/* Button for medium and large screens */}
              <button
                type="button"
                className={`rounded-pill btn ${selectedButton === 'tv' ? 'btn-dark custom-bg-primary text-white' : 'btn-transparent btn-md text-secondary'} border-0 d-none d-md-inline-block`}
                onClick={() => handleButtonClick('tv')}
              >
                TV Shows
              </button>
              {/* Button for small screens */}
              <button
                type="button"
                className={`rounded-pill btn ${selectedButton === 'tv' ? 'btn-dark custom-bg-primary text-white' : 'btn-transparent btn-sm text-secondary'} border-0 d-md-none`}
                onClick={() => handleButtonClick('tv')}
              >
                TV Shows
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Carousel Grid */}
      {triggerSearch === '' && (
        <CarouselGrid filter={selectedButton} />
      )}

      <div className="flex-row text-white custom-w-size-100">
        {triggerSearch.trim() === '' ? (
          <MediaGrid filter={selectedButton} />
        ) : (
          <SearchGrid searchQuery={triggerSearch} filter={selectedButton} />
        )}
      </div>
      <Footer />
      {welcomeMessage && (<Alert message={welcomeMessage} onClose={handleAlertDismiss} type="success" />)}
    </div>
  );
}

export default IndexPage;