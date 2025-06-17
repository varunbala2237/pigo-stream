// EpisodeSection.js
function EpisodeSection({
  episodes,
  selectedEpisode,
  onEpisodeChange,
  isEpisodeAired,
  isEpisodeAiredToday,
  episodeScrollRef
}) {
  return (
    <div className="container-fluid custom-bg custom-theme-radius-low w-100 p-2 my-2">
      {/* Episodes Section */}
      <div className="d-flex flex-row dynamic-ts my-2">
        <i className="bi bi-play-circle me-2"></i>
        Episodes
      </div>

      <div
        ref={episodeScrollRef}
        className="d-flex flex-column episode-list overflow-auto custom-theme-radius-low gap-1"
      >
        {episodes.length > 0 ? (
          episodes.map(episode => {
            const aired = isEpisodeAired(episode.air_date);
            const airedToday = isEpisodeAiredToday(episode.air_date);

            return (
              <button
                key={episode.id}
                className={`btn btn-dark bd-callout-dark w-100 text-start custom-theme-radius-low text-white border-0 shadow-sm 
                ${selectedEpisode === episode.episode_number
                    ? 'active'
                    : ''
                  }`}
                onClick={() => onEpisodeChange(episode.episode_number)}
                disabled={!aired}
              >
                <div className={`d-flex flex-column text-wrap ${aired ? '' : 'text-black'}`}>
                  <div className="d-flex flex-row justify-content-between">
                    <span className="fw-bold dynamic-fs">
                      Episode <span className="theme-color">{episode.episode_number}</span>
                      {airedToday && <span className="badge bg-primary text-white ms-2">New!</span>}
                    </span>
                  </div>

                  <div className="d-flex flex-row justify-content-between">
                    {/* Tooltip applied here on episode name */}
                    <small className="text-truncate dynamic-ss">
                      {episode.name}
                    </small>

                    <small className="align-self-end dynamic-ss">
                      {new Date(episode.air_date).toLocaleDateString()}
                    </small>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className="text-white">No episodes available</div>
        )}
      </div>
    </div>
  );
}

export default EpisodeSection;