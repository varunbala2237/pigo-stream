// SeasonSection.js
function SeasonSection({ seasons, selectedSeason, onSeasonChange }) {
  return (
    <div className="row g-2 mb-2">
      {seasons.length > 0 ? (
        seasons.map((season) => (
          <div key={season.id} className="col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
            <button
              className={`btn w-100 d-flex justify-content-center align-items-center bd-callout-dark text-white shadow-sm ${selectedSeason === season.season_number
                ? 'btn btn-outline-primary border-2'
                : 'btn btn-dark border-0'
                }`}
              onClick={() => onSeasonChange(season.season_number)}
            >
              <span className="text-truncate dynamic-ss">
                {season.name === 'Specials' ? season.name : `S${season.season_number}`}
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