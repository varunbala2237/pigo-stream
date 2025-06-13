// SeasonSection.js
function SeasonSection({ seasons, selectedSeason, onSeasonChange }) {
  return (
    <div className="row g-2 mb-2">
      {seasons.length > 0 ? (
        seasons.map((season) => (
          <div key={season.id} className="d-flex col-6 col-sm-4 col-md-3 col-lg-2">
            <button
              className={`btn w-100 align-items-center justify-content-center text-white border-0 shadow-sm
                ${selectedSeason === season.season_number
                  ? 'btn-primary bd-callout-primary active'
                  : 'btn-dark bd-callout-dark'
                }`}
              onClick={() => onSeasonChange(season.season_number)}
            >
              <span className="text-truncate dynamic-ss">
                {season.name === 'Specials' ? season.name : `Season ${season.season_number}`}
              </span>
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