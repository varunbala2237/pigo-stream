// SeasonSection.js
function SeasonSection({ seasons, selectedSeason, onSeasonChange }) {
  return (
    <div className="row g-2 mb-2">
      {seasons.length > 0 ? (
        seasons.map((season) => (
          <div key={season.id} className="col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
            <button
              className={`btn btn-dark bd-callout-dark w-100 justify-content-center align-items-center text-white shadow-sm 
                ${selectedSeason === season.season_number
                  ? 'border border-2 border-primary'
                  : 'border-0'
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