// SeasonSection.js
import { useEffect } from 'react';
import { Tooltip } from 'bootstrap';

function SeasonSection({ seasons, selectedSeason, onSeasonChange }) {
  useEffect(() => {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((el) => {
      new Tooltip(el);
    });
  }, [seasons]);

  return (
    <div className="d-flex row g-2">
      {seasons.length > 0 ? (
        seasons.map((season) => (
          <div key={season.id} className="d-flex col-3 col-md-2 col-lg-2">
            <button
              className={`btn btn-dark bd-callout-dark w-100 d-flex flex-column align-items-center justify-content-center text-white border-0 shadow-sm
                ${selectedSeason === season.season_number ? 'active' : ''}`}
              onClick={() => onSeasonChange(season.season_number)}
              title={season.name}
              data-bs-toggle="tooltip"
              data-bs-placement="top"
            >
              <small className="text-truncate w-100 dynamic-ss">
                {season.name}
              </small>
            </button>
          </div>
        ))
      ) : (
        <div className="text-white">No seasons available</div>
      )}
    </div>
  );
}

export default SeasonSection;