// SeasonSection.js
function SeasonSection({
  seasons,
  selectedSeason,
  onSeasonChange,
  seasonScrollRef
}) {
  // Handling scroll using buttons
  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -450 : 450,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="container-fluid custom-bg custom-theme-radius-low w-100 p-2 my-2">
      {/* Seasons Section */}
      <div className="d-flex flex-row dynamic-ts my-2">
        <i className="bi bi-layers me-2"></i>
        Seasons
      </div>

      <div className="position-relative">
        {seasons.filter(Boolean).length > 3 && (
          <>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
              onClick={() => scroll(seasonScrollRef, 'left')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
              onClick={() => scroll(seasonScrollRef, 'right')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </>
        )}

        <div
          ref={seasonScrollRef}
          className="d-flex flex-row overflow-auto scroll-hide align-items-start custom-theme-radius-low gap-1"
        >
          {seasons.length > 0 ? (
            seasons.map(season => {

              return (
                <div
                  key={season.id}
                  className={
                    `card text-white border-0 shadow-sm custom-theme-radius-low
                    ${selectedSeason === season.season_number ? 'bg-secondary' : 'bd-callout-dark'}`
                  }
                  style={{ minWidth: '160px', maxWidth: '160px' }}
                  onClick={() => onSeasonChange(season.season_number)}
                  role="button"
                  title={season.name}
                >
                  <img
                    src={
                      season.poster_path
                        ? `https://image.tmdb.org/t/p/w185${season.poster_path}`
                        : `https://placehold.co/200x300/212529/6c757d?text=?`
                    }
                    className="custom-theme-radius-top-low"
                    alt="empty"
                    style={{ height: '240px', objectFit: 'cover' }}
                  />
                  <div className={`card-body p-2`}>
                    <div className="d-flex align-items-center dynamic-fs">
                      <span className="fw-bold theme-color me-2">{season.season_number}</span>
                      <span className="text-truncate flex-grow-1">{season.name}</span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-white">No seasons available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SeasonSection;