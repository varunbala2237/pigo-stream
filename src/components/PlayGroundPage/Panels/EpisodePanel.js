// EpisodePanel.js
function EpisodePanel({ episodeCount, selectedEpisode, onEpisodeChange }) {
  const episodes = Array.from({ length: episodeCount }, (_, i) => i + 1);

  return (
    <div className="container-fluid custom-bg custom-theme-radius-low w-100 p-2 my-2">
      <div className="d-flex flex-row dynamic-ts mb-2">
        <i className="bi bi-play-circle me-2"></i>
        Episodes
      </div>
      <div className="row g-2">
        {episodes.map((epNum) => (
          <div key={epNum} className="col-3 col-md-2 col-lg-1">
            <button
              className={`btn btn-dark w-100 text-white border-0 custom-theme-radius-low shadow-sm 
                ${selectedEpisode === epNum ? 'bg-secondary' : 'bd-callout-dark'}`}
              onClick={() => onEpisodeChange(epNum)}
            >
              <span className="dynamic-ss">{epNum}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EpisodePanel;