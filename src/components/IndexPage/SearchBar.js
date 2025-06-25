// SearchBar.js
import React from "react";
import "./SearchBar.module.css";

function SearchBar({
  searchQuery,
  handleSearchInputChange,
  handleSelectSearch,
  searchHistory,
  isDropdownOpen,
  handleRemoveSearchHistory,
  handleSearchSubmit,
  handleFocus,
  containerRef,
  dropdownRef,
}) {
  return (
    <div className="floating-search-wrapper">
      <div className="d-flex position-relative justify-content-center align-items-center shadow">
        <div ref={containerRef} className="search-bar input-group custom-input-group">
          <input
            id="prompt"
            type="text"
            className="form-control custom-bg text-white dynamic-fs custom-textarea rounded-pill-l border-0"
            placeholder="Type here..."
            value={searchQuery}
            onChange={handleSearchInputChange}
            onFocus={handleFocus}
            aria-autocomplete="list"
          />

          {isDropdownOpen && (
            <ul
              ref={dropdownRef}
              className="search-bar-dropdown dropdown-menu show bd-callout-dark custom-theme-radius-low"
            >
              {searchHistory.length === 0 ? (
                <li className="dropdown-item text-white bg-transparent text-nowrap text-truncate dynamic-fs">
                  No search history.
                </li>
              ) : (
                [...searchHistory].reverse().map(({ id, query }, index) => (
                  <React.Fragment key={id}>
                    <div className="d-flex justify-content-between align-items-center">
                      <i className="bi bi-clock-history text-white mx-3"></i>
                      <li
                        className="dropdown-item d-flex justify-content-between align-items-center text-white bg-transparent dynamic-fs"
                        onClick={() => handleSelectSearch(query)}
                        style={{
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {query}
                      </li>
                      <button
                        className="btn btn-transparent border-0 me-2"
                        onClick={(e) => handleRemoveSearchHistory(e, id)}
                      >
                        <i className="bi bi-trash text-white"></i>
                      </button>
                    </div>
                    {index < searchHistory.length - 1 && (
                      <li className="dropdown-divider bg-secondary"></li>
                    )}
                  </React.Fragment>
                ))
              )}
            </ul>
          )}

          <button className="btn btn-primary border-0 rounded-pill-r" onClick={handleSearchSubmit}>
            <i className="bi bi-search me-2"></i>
            <span className="dynamic-fs">Search</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SearchBar;