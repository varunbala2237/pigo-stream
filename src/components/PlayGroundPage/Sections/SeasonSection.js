// SeasonSection.js
import { useEffect } from 'react';
import { Tooltip } from 'bootstrap';

function SeasonSection({ seasons, selectedSeason, onSeasonChange }) {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

    // Dispose existing tooltips
    tooltipTriggerList.forEach(el => {
      const tooltipInstance = Tooltip.getInstance(el);
      if (tooltipInstance) tooltipInstance.dispose();
    });

    // Reinitialize tooltips
    tooltipTriggerList.forEach(el => {
      new Tooltip(el);
    });
  }, [seasons]);

  return (
    <div className="d-flex row g-2">
      {seasons.length > 0 ? (
        seasons.map((season) => (
          <div key={season.id} className="d-flex col-4 col-md-3 col-lg-2">
            <button
              className={
                `btn btn-dark bd-callout-dark w-100 d-flex flex-column
                justify-content-center align-items-center text-white border-0 shadow-sm
                ${selectedSeason === season.season_number ? 'active' : ''}`
              }
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