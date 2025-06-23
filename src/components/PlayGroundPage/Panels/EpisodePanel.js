// EpisodePanel.js
import { useState, useMemo, useEffect } from 'react';
import { getSessionValue, setSessionValue } from '../../../utils/sessionStorageStates';

function EpisodePanel({ episodeCount, selectedEpisode, onEpisodeChange, selectedChainPath }) {
  const safeEpisodeCount = Math.max(1, episodeCount || 1);

  const episodes = useMemo(
    () => Array.from({ length: safeEpisodeCount }, (_, i) => i + 1),
    [safeEpisodeCount]
  );

  const [page, setPage] = useState(() =>
    getSessionValue(...selectedChainPath, 'episodePage') ?? 0
  );

  // Persist page
  useEffect(() => {
    setSessionValue(...selectedChainPath, 'episodePage', page);
  }, [page, selectedChainPath]);

  const pageSize = 50;
  const start = page * pageSize;
  const end = Math.min(start + pageSize, episodes.length);
  const currentEpisodes = episodes.slice(start, end);
  const totalPages = Math.ceil(episodes.length / pageSize);

  const handleNext = () => {
    if (page < totalPages - 1) setPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage(prev => prev - 1);
  };

  return (
    <div className="container-fluid custom-bg custom-theme-radius-low w-100 p-2 my-2">
      <div className="d-flex flex-row justify-content-between mb-2">
        <div className="dynamic-ts">
          <i className="bi bi-play-circle me-2"></i>
          Episodes
        </div>
        <div className="dynamic-fs d-flex align-items-center gap-2">
          <button
            className="btn btn-sm btn-dark border-0 rounded-pill px-2 py-1"
            onClick={handlePrev}
            disabled={page === 0}
          >
            <i className="bi bi-chevron-left"></i>
          </button>
          <span>Page: {start + 1} - {end}</span>
          <button
            className="btn btn-sm btn-dark border-0 rounded-pill px-2 py-1"
            onClick={handleNext}
            disabled={page >= totalPages - 1}
          >
            <i className="bi bi-chevron-right"></i>
          </button>
        </div>
      </div>

      <div className="row g-2">
        {currentEpisodes.map((epNum) => (
          <div key={epNum} className="col-3 col-md-2 col-lg-1">
            <button
              className={`btn btn-dark w-100 text-white border-0 custom-theme-radius-low shadow-sm 
                ${selectedEpisode === epNum ? 'bg-secondary' : 'bd-callout-dark'}`}
              onClick={() => onEpisodeChange(epNum)}
              aria-label={`Select episode ${epNum}`}
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