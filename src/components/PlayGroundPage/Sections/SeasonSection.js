// SeasonSection.js
import { useEffect } from 'react';
import { Tooltip } from 'bootstrap';

function SeasonSection({ seasons, selectedSeason, onSeasonChange }) {
  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');

    // Dispose existing tooltips to avoid duplicates
    tooltipTriggerList.forEach(el => {
      const tooltipInstance = Tooltip.getInstance(el);
      if (tooltipInstance) tooltipInstance.dispose();
      if (el) new Tooltip(el);
    });
  }, [seasons]);

  return (
    <div className="container-fluid custom-bg custom-theme-radius-low w-100 p-2 my-2">
      <div className="d-flex flex-row dynamic-ts my-2">
        <i className="bi bi-layers me-2"></i>
        Seasons
      </div>

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
                <small className="text-truncate w-100 theme-color dynamic-ss">
                  {season.season_number}
                </small>
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
    </div>
  );
}

export default SeasonSection;