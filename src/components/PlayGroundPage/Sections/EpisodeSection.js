// EpisodeSection.js
function EpisodeSection({
  episodes,
  selectedEpisode,
  onEpisodeChange,
  isEpisodeAired,
  isEpisodeAiredToday,
  episodeScrollRef
}) {
  // Handing scroll using buttons
  const scroll = (ref, direction) => {
    if (ref.current) {
      ref.current.scrollBy({
        left: direction === 'left' ? -450 : 450,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="position-relative my-2">
      {episodes.filter(Boolean).length > 3 && (
        <>
          <button
            className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
            onClick={() => scroll(episodeScrollRef, 'left')}
            style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
            onClick={() => scroll(episodeScrollRef, 'right')}
            style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </>
      )}
      <div className="container-fluid custom-bg custom-theme-radius-low w-100 p-2 my-2">
        {/* Episodes Section */}
        <div className="d-flex flex-row dynamic-ts my-2">
          <i className="bi bi-play-circle me-2"></i>
          Episodes
        </div>

        <div
          ref={episodeScrollRef}
          className="d-flex flex-row overflow-auto scroll-hide align-items-start custom-theme-radius-low gap-1"
        >
          {episodes.length > 0 ? (
            episodes.map(episode => {
              const aired = isEpisodeAired(episode.air_date);
              const airedToday = isEpisodeAiredToday(episode.air_date);

              return (
                <div
                  key={episode.id}
                  className={
                    `card text-white border-0 shadow-sm custom-theme-radius-low
                  ${selectedEpisode === episode.episode_number ? 'bg-secondary' : 'bd-callout-dark'}`
                  }
                  style={{ minWidth: '160px', maxWidth: '160px', aspectRatio: '16 / 9', cursor: aired ? 'pointer' : 'not-allowed' }}
                  onClick={() => aired && onEpisodeChange(episode.episode_number)}
                  role="button"
                >
                  <img
                    src={
                      episode.still_path
                        ? `https://image.tmdb.org/t/p/w185${episode.still_path}`
                        : `https://placehold.co/160x90/212529/6c757d?text=?`
                    }
                    className="custom-theme-radius-top-low"
                    alt="empty"
                    style={{ aspectRatio: '16 / 9', objectFit: 'cover' }}
                  />
                  <div className={`card-body p-2 ${aired ? '' : 'text-secondary'}`}>
                    <div className="d-flex align-items-center dynamic-fs">
                      <span className="fw-bold theme-color me-2">{episode.episode_number}</span>
                      <span className="text-truncate flex-grow-1">{episode.name}</span>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="dynamic-ss">{new Date(episode.air_date).toLocaleDateString()}</span>
                      {airedToday && <span className="badge bg-primary ms-2">New!</span>}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="text-white">No episodes available</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default EpisodeSection;