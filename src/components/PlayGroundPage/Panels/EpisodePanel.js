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
          <div key={epNum} className="col-4 col-md-3 col-lg-2">
            <button
              className={`btn w-100 text-white border-0 rounded-pill shadow-sm 
                ${selectedEpisode === epNum ? 'btn-primary bd-callout-primary active' : 'btn-dark bd-callout-dark'}`}
              onClick={() => onEpisodeChange(epNum)}
            >
              <span className="dynamic-ss">Episode {epNum}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EpisodePanel;