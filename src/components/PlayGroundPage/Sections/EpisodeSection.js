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
    <div
      ref={episodeScrollRef}
      className="d-flex flex-column overflow-auto custom-theme-radius-low"
      style={{ maxHeight: '235px' }}
    >
      {episodes.length > 0 ? (
        episodes.map(episode => {
          const aired = isEpisodeAired(episode.air_date);
          const airedToday = isEpisodeAiredToday(episode.air_date);

          return (
            <button
              key={episode.id}
              className={`btn btn-dark bd-callout-dark w-100 text-start custom-margin-top custom-theme-radius-low text-white border-0 shadow-sm 
                ${selectedEpisode === episode.episode_number
                  ? 'active'
                  : ''
                }`}
              onClick={() => onEpisodeChange(episode.episode_number)}
              disabled={!aired}
            >
              <div className={`d-flex flex-column text-wrap px-2 ${aired ? '' : 'text-black'}`}>
                <div className="d-flex flex-row justify-content-between">
                  <span className="fw-bold dynamic-fs">
                    Episode {episode.episode_number}
                    {airedToday && <span className="badge bg-primary text-white ms-2">New!</span>}
                  </span>
                </div>
                <div className="d-flex flex-row justify-content-between">
                  <small className="dynamic-ss">{episode.name}</small>
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
  );
}

export default EpisodeSection;