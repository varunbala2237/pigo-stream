// ChainPanel.js
import { useEffect } from 'react';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

function ChainPanel({ animeInfo, selectedChainIndex, onChainChange, chainScrollRef }) {
  useEffect(() => {
    if (chainScrollRef.current) {
      const items = chainScrollRef.current.querySelectorAll('.card');
      const selectedItem = items[selectedChainIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({ behavior: 'instant', inline: 'center' });
      }
    }
  }, [chainScrollRef, selectedChainIndex]);

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
      <div className="d-flex flex-row dynamic-ts mb-2">
        <i className="bi bi-layers me-2"></i>
        Anime Chain
      </div>

      <div className="position-relative">
        {animeInfo.length > 3 && (
          <>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute start-0 translate-middle-y d-none d-md-block"
              onClick={() => scroll(chainScrollRef, 'left')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            <button
              className="btn btn-dark custom-bg rounded-pill py-2 position-absolute end-0 translate-middle-y d-none d-md-block"
              onClick={() => scroll(chainScrollRef, 'right')}
              style={{ zIndex: 1, top: '50%', transform: 'translateY(-50%)' }}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </>
        )}

        <div
          ref={chainScrollRef}
          className="d-flex flex-row overflow-auto scroll-hide align-items-start custom-theme-radius-low gap-1"
        >
          {animeInfo.map((entry, index) => {
            const { title, coverImage, startDate, format } = entry;

            const displayTitle = title?.english || title?.romaji || 'Untitled';
            const dateString = startDate?.year ? `${startDate.year}-${startDate.month || '--'}-${startDate.day || '--'}` : 'Unknown';

            return (
              <div
                key={entry.id}
                className={`card text-white border-0 shadow-sm custom-theme-radius-low
                  ${selectedChainIndex === index ? 'bg-secondary' : 'bd-callout-dark'}`}
                style={{ minWidth: '160px', maxWidth: '160px' }}
                onClick={() => onChainChange(index)}
                role="button"
              >
                <img
                  src={coverImage?.medium || `https://placehold.co/160x230/212529/6c757d?text=?`}
                  className="custom-theme-radius-top-low"
                  alt="cover"
                  style={{ height: '230px', objectFit: 'cover' }}
                />
                <div className="card-body p-2">
                  <div className="dynamic-fs fw-bold text-truncate">{format}</div>
                  <Tippy content={displayTitle} placement="top" delay={[500, 0]} interactive={true}>
                    <div className="text-truncate dynamic-ss">{displayTitle}</div>
                  </Tippy>
                  <div className="text-secondary dynamic-ss">{dateString}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ChainPanel;