import React from "react";

function SearchBar({
  searchQuery,
  handleSearchInputChange,
  handleSelectSearch,
  searchHistory,
  isDropdownOpen,
  handleRemoveSearchHistory,
  handleSearchSubmit,
  handleFocus,
  inputRef,
  dropdownRef,
}) {
    return (
        <div className="container-fluid px-3 my-3">
          <div className="d-flex position-relative justify-content-center align-items-center">
            <div ref={inputRef} className="input-group custom-input-group custom-border">
                  <input
                    id="prompt"
                    type="text"
                    className="form-control custom-bg text-white dynamic-fs custom-textarea custom-border-l border-0"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchInputChange}
                    onFocus={handleFocus}
                    aria-autocomplete="list"
                  />

                  {isDropdownOpen && (
                    <ul
                      ref={dropdownRef}
                      className="dropdown-menu show position-absolute bd-callout-dark custom-theme-radius p-0"
                      style={{ top: '100%', left: 0, right: 0, maxWidth: '100vw', zIndex: 1000 }}
                    >
                      {searchHistory.length === 0 ? (
                        <li className="dropdown-item text-white bg-transparent text-nowrap text-truncate dynamic-fs">No search history.</li>
                      ) : (
                        [...searchHistory].reverse().map(({ id, query }, index) => (
                          <React.Fragment key={id}>
                            <div className="d-flex justify-content-between align-items-center">
                              <i className="bi bi-clock text-white ms-3"></i>
                              <li
                                className="dropdown-item d-flex justify-content-between align-items-center text-white bg-transparent dynamic-fs"
                                onClick={() => handleSelectSearch(query)}
                                style={{
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
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

                  <button className="btn btn-dark custom-bg m-0 border-0 custom-border-r" onClick={handleSearchSubmit}>
                    <i className="bi bi-search"></i>
                  </button>

                  {searchQuery && (
                    <button className="btn btn-dark custom-bg m-0 border-0 custom-border-r" type="button" onClick={() => handleSearchInputChange({ target: { value: '' } })}>
                      <i className="bi bi-x-lg"></i>
                    </button>
                  )}
            </div>
          </div>
        </div>
    );
}

export default SearchBar;