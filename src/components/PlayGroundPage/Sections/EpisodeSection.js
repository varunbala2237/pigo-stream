// EpisodeSection.js
import { useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

const EpisodeSection = ({
  episodes,
  selectedEpisode,
  onEpisodeChange,
  episodeScrollRef
}) => {
  // Handling episode scroll state
  useEffect(() => {
    if (episodeScrollRef.current) {
      const items = episodeScrollRef.current.querySelectorAll('.card');
      const selectedIndex = episodes.findIndex(e => e.episode_number === selectedEpisode);
      if (selectedIndex >= 0 && items[selectedIndex]) {
        const container = episodeScrollRef.current;
        const containerRect = container.getBoundingClientRect();
        const itemRect = items[selectedIndex].getBoundingClientRect();

        const offset = itemRect.left - containerRect.left;
        const scrollAdjustment = offset - (container.clientWidth / 2) + (itemRect.width / 2);

        container.scrollBy({
          left: scrollAdjustment,
          behavior: 'instant',
        });
      }
    }
  }, [episodeScrollRef, selectedEpisode, episodes]);

  // Check if the episode has aired
  function isEpisodeAired(airDateString) {
    if (!airDateString) return false;

    const airDate = new Date(airDateString);
    const today = new Date();

    // Normalize both dates to midnight to avoid timezone issues
    airDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return airDate <= today;
  }

  // Check if the episode aired today
  function isEpisodeAiredToday(airDateString) {
    if (!airDateString) return false;

    const airDate = new Date(airDateString);
    const today = new Date();

    // Normalize both dates to midnight
    airDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return airDate.getTime() === today.getTime(); // Check if dates match
  }

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
    <div className="container-fluid custom-bg custom-theme-radius-low w-100 p-2 my-2">
      {/* Episodes Section */}
      <div className="d-flex flex-row dynamic-ts mb-2">
        <i className="bi bi-play-circle me-2"></i>
        Episodes
      </div>

      <div className="d-flex justify-content-between align-items-stretch">
        <div
          ref={episodeScrollRef}
          className="d-flex flex-row overflow-auto scroll-hide align-items-start custom-theme-radius-low gap-2"
          style={{ scrollSnapType: 'x mandatory' }}
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
                  style={{ minWidth: '160px', maxWidth: '160px', cursor: aired ? 'pointer' : 'not-allowed' }}
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
                    alt={episode.name}
                    style={{ height: '90px', objectFit: 'cover' }}
                  />
                  <div className={`card-body p-2 ${aired ? '' : 'text-secondary'}`}>
                    <div className="d-flex align-items-center dynamic-fs">
                      <span className="fw-bold theme-color me-2">{episode.episode_number}</span>
                      <Tippy
                        content={episode.name}
                        placement="top"
                        delay={[500, 0]}
                        trigger="mouseenter focus click"
                        interactive={true}
                      >
                        <span className="text-truncate flex-grow-1 d-inline-block" style={{ maxWidth: '100%' }}>
                          {episode.name}
                        </span>
                      </Tippy>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className={`dynamic-ss ${selectedEpisode === episode.episode_number ? 'text-dark' : 'text-secondary'}`}
                      >
                        {new Date(episode.air_date).toLocaleDateString()}
                      </span>
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

        {/* Vertical scroll buttons */}
        <div className="d-none d-md-flex flex-column ms-2 align-self-stretch">
          <button
            className="btn btn-dark bd-callout-dark flex-fill py-2"
            onClick={() => scroll(episodeScrollRef, 'left')}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <button
            className="btn btn-dark bd-callout-dark flex-fill py-2 mt-2"
            onClick={() => scroll(episodeScrollRef, 'right')}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default EpisodeSection;