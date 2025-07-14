// SeasonSection.js
import { useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const SeasonSection = ({
  seasons,
  selectedSeason,
  onSeasonChange,
  seasonScrollRef
}) => {
  // Handling seasons scroll state
  useEffect(() => {
    if (seasonScrollRef.current) {
      const items = seasonScrollRef.current.querySelectorAll('.card');
      const selectedIndex = seasons.findIndex(s => s.season_number === selectedSeason);
      if (selectedIndex >= 0 && items[selectedIndex]) {
        const container = seasonScrollRef.current;
        const containerRect = container.getBoundingClientRect();
        const itemRect = items[selectedIndex].getBoundingClientRect();

        const offset = itemRect.left - containerRect.left;
        const scrollAdjustment = offset - (container.clientWidth / 2) + (itemRect.width / 2);

        container.scrollBy({
          left: scrollAdjustment,
          behavior: 'instant',
        });
      }
    }
  }, [seasonScrollRef, selectedSeason, seasons]);

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
      <div className="d-flex flex-row dynamic-ts mb-2">
        <i className="bi bi-layers me-2"></i>
        Seasons
      </div>

      <div className="d-flex justify-content-between align-items-stretch">
        <div
          ref={seasonScrollRef}
          className="d-flex flex-row overflow-auto scroll-hide align-items-start custom-theme-radius-low gap-2"
          style={{ scrollSnapType: 'x mandatory' }}
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
                      <Tippy
                        content={season.name}
                        placement="top"
                        delay={[500, 0]}
                        trigger="mouseenter focus click"
                        interactive={true}
                      >
                        <span className="text-truncate flex-grow-1 d-inline-block" style={{ maxWidth: '100%' }}>
                          {season.name}
                        </span>
                      </Tippy>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-white">No seasons available</div>
          )}
        </div>

        {/* Vertical scroll buttons */}
        <div className="d-none d-md-flex flex-column ms-2 align-self-stretch">
          <button
            className="btn btn-dark bd-callout-dark flex-fill py-2"
            onClick={() => scroll(seasonScrollRef, 'left')}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            className="btn btn-dark bd-callout-dark flex-fill py-2 mt-2"
            onClick={() => scroll(seasonScrollRef, 'right')}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default SeasonSection;