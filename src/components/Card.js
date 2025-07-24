// Card.js
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useRemoveWatchHistory from '../hooks/WatchHistoryPage/useRemoveWatchHistory';
import useRemoveFromMyList from '../hooks/MyListPage/useRemoveMyList';
import './Card.css';

const Card = ({ media, type, path, onRemove, handleAlert, isDeletable = false, isSkeleton = false }) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const cardRef = useRef(null);

  const [imageUrl, setImageUrl] = useState('');
  const [isRemove, setIsRemove] = useState(false);
  const navigate = useNavigate();

  // Watch History
  const { removeFromHistory } = useRemoveWatchHistory();

  // My list
  const { removeFromList } = useRemoveFromMyList();

  useEffect(() => {
    setImageUrl(media.poster_path
      ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
      : 'https://placehold.co/200x300/212529/6c757d?text=?');
  }, [media.poster_path]);

  // Hide overlay if clicked outside the card
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        setShowOverlay(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const handleCardClick = (e) => {
    // Prevent immediate play or info button from triggering
    if (e.target.closest('button')) return;
    if (!showOverlay) setShowOverlay(true);
  };

  const handlePlayMedia = async (tab) => {
    if (!isSkeleton || isRemove) {
      navigate(`/play?id=${media.id}&type=${type}&tab=${tab}`);
    }
  };

  const handleRemove = async () => {
    setIsRemove(true);
    try {
      if (path === '/watch-history') {
        await removeFromHistory(media.id, type);
        handleAlert(`Successfully removed from Watch History.`);
      } else if (path === '/my-list') {
        await removeFromList(media.id, type);
        handleAlert(`Successfully removed from My List.`);
      }
      onRemove();
    } catch (error) {
      console.error('Failed to remove from history:', error);
    } finally {
      setIsRemove(false);
    }
  };

  // Extracting title, year & rating
  const title = media.title || media.name || null;
  const year = media.release_date
    ? new Date(media.release_date).getFullYear()
    : media.first_air_date
      ? new Date(media.first_air_date).getFullYear()
      : 'N/A';
  const rating = media.vote_average ? media.vote_average.toFixed(1) : '0.0';

  if (isSkeleton) {
    return (
      <div className="custom-card-wrapper">
        <div
          className="card custom-card custom-bg text-white border-0 shadow-sm"
          style={{ width: '160px', height: '240px' }}
        >
          <div
            className="custom-card-img rounded-top skeleton-bg"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="custom-card-wrapper position-relative">
      {/* Delete Button */}
      {isDeletable && (
        <button
          className="btn btn-dark bd-callout-dark custom-delete-btn rounded-circle position-absolute py-1 px-2"
          onClick={handleRemove}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      )}

      <div
        ref={cardRef}
        className={`card custom-card custom-bg text-white border-0 shadow-sm ${showOverlay ? 'show-overlay' : ''}`}
        onClick={handleCardClick}
        role='button'
        tabIndex="0"
      >
        <div className="custom-overlay d-flex flex-column justify-content-end align-items-start p-2">
          <div className="d-flex flex-column mb-2">
            <span className="dynamic-fs fw-bold text-wrap text-truncate clamp-6">{title}</span>
            <div className="d-flex justify-content-start align-items-center text-white dynamic-ms mt-2 gap-1">
              <div className="d-flex border border-1 border-secondary custom-theme-radius-low px-1">
                <span id="Year">{year}</span>
              </div>

              <div className="d-flex border border-1 border-secondary custom-theme-radius-low px-1">
                {type === 'movie' ? (
                  <span>Movie</span>
                ) : (
                  <span>Show</span>
                )}
              </div>

              <div className="d-flex border border-1 border-secondary custom-theme-radius-low px-1">
                <span id="Rating"><i className="bi bi-star-fill text-warning me-1"></i>{rating}</span>
              </div>
            </div>
          </div>

          <div className="d-flex gap-1">
            <button
              className="btn btn-dark bd-callout-dark btn-sm rounded-pill border-0"
              onClick={() => handlePlayMedia('info')}
            >
              <i className="bi bi-info-circle me-1"></i>Info
            </button>
            <button
              className="btn btn-primary bd-callout-primary btn-sm rounded-pill border-0"
              onClick={() => handlePlayMedia('play')}
            >
              <i className="bi bi-play-circle me-1"></i>Play
            </button>
          </div>
        </div>

        <img src={imageUrl} alt={title} className="custom-card-img rounded-top" />
      </div>
    </div>
  );
}

export default Card;