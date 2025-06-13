// Card.js
import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import useRemoveWatchHistory from '../hooks/WatchHistoryPage/useRemoveWatchHistory';
import useRemoveFromMyList from '../hooks/MyListPage/useRemoveMyList';

import './Card.css';

function Card({ media, type, path, onRemove, handleAlert, isDeletable = true, isSkeleton = false }) {
  const [imageUrl, setImageUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  // Ref to track outside clicks
  const modalRef = useRef();

  // Watch History
  const { removeFromHistory } = useRemoveWatchHistory();

  // My list
  const { removeFromList } = useRemoveFromMyList();

  useEffect(() => {
    setImageUrl(media.poster_path
      ? `https://image.tmdb.org/t/p/w500${media.poster_path}`
      : 'https://icons.iconarchive.com/icons/blackvariant/button-ui-system-folders-alt/512/Movie-icon.png');
  }, [media.poster_path]);

  useEffect(() => {
    const handleModalClose = (e) => {
      // Handle ESC key press to close modal
      if (e.key === 'Escape') {
        setModalVisible(false);
        setTimeout(() => setShowModal(false), 200); // Close after animation
        return;
      }

      // Handle click outside modal (on backdrop or outside modal)
      if (showModal && modalRef.current && !modalRef.current.contains(e.target)) {
        setModalVisible(false);
        setTimeout(() => setShowModal(false), 200); // Close after animation
      }

      // Handle backdrop click to close modal
      if (e.target.classList.contains('modal-backdrop')) {
        setModalVisible(false);
        setTimeout(() => setShowModal(false), 200); // Close after animation
      }
    };

    if (showModal) {
      document.body.addEventListener('mousedown', handleModalClose);  // handle click events
      document.body.addEventListener('keydown', handleModalClose);   // handle ESC key
    }

    // Cleanup listeners and unlock scroll when modal is closed
    return () => {
      document.body.removeEventListener('mousedown', handleModalClose);
      document.body.removeEventListener('keydown', handleModalClose);
    };
  }, [showModal]);

  const handlePlayMedia = async () => {
    if (!isRemove) {
      navigate(`/play?id=${media.id}&type=${type}`);
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
      setShowModal(false);
      setModalVisible(false);
    }
  };

  const handleLongClick = (event) => {
    event.preventDefault();
    if (!isDeletable) return;
    if (path === '/watch-history' || path === '/my-list') {
      setShowModal(true);
      setTimeout(() => {
        setModalVisible(true);
      }, 10); // Adding a short delay to trigger the fade-in effect
    }
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    if (!isDeletable) return;
    if (path === '/watch-history' || path === '/my-list') {
      setShowModal(true);
      setTimeout(() => {
        setModalVisible(true);
      }, 100);
    }
  };

  // Extracting rating
  const rating = media.vote_average ? media.vote_average.toFixed(1) : '0.0';

  if (isSkeleton) {
    return (
      <div className="custom-card-container">
        <div className="card bg-transparent border-0 position-relative custom-theme-radius-low skeleton-card">
          <div className="card-skeleton-image custom-theme-radius-low custom-bg"></div>
          <div className="card-overlay dynamic-size dynamic-fs px-1">
            <div className="d-flex justify-content-between align-items-center">
              <div className="rating-box text-start card-skeleton-bar rounded-pill custom-bg"></div>
              <div className="media-type-box text-end card-skeleton-bar rounded-pill custom-bg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="custom-card-container">
      <div
        className="card bg-transparent border-0 position-relative custom-theme-radius-low"
        onClick={handlePlayMedia}
        onContextMenu={handleRightClick}
        onMouseDown={(e) => e.button === 0 && setTimeout(() => handleLongClick(e), 700)}
        style={{ cursor: isRemove ? 'default' : 'pointer', overflow: 'hidden' }}
      >
        <img
          className="custom-card-img"
          src={imageUrl}
          alt='empty'
        />
        {/* Overlay Container */}
        <div className="card-overlay dynamic-size dynamic-fs px-1">
          <div className="d-flex justify-content-between align-items-center">
            <div className="rating-box rounded-pill text-start custom-bg px-2 py-1">
              <i className="bi bi-star-fill text-warning"></i>
              <span id="Rating" className="text-white"> {rating} </span>
            </div>
            <div className="media-type-box rounded-circle text-end custom-bg px-2 py-1">
              {type === 'movie' ? (
                <i className="bi bi-film text-white"></i>
              ) : (
                <i className="bi bi-tv text-white"></i>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div className={`modal-backdrop fade ${modalVisible ? 'show' : ''}`}></div>

          {/* Confirmation Modal */}
          <div className={`modal fade zoom-in-out ${modalVisible ? 'show' : ''} d-block`} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered mx-auto border-0 modal-pad">
              <div ref={modalRef} className="modal-content dynamic-fs bd-callout-dark custom-theme-radius-low text-white border-0">
                <div className="modal-body justify-content-center text-center border-0">
                  <span className="dynamic-fs">
                    Are you sure you want to remove <strong>"{media.title || media.name || 'this item'}"</strong> from {path === '/watch-history' ? 'Watch History' : 'My List'}?
                  </span>
                </div>
                <div className="d-flex justify-content-between w-100 my-2">
                  <div className="text-start text-center w-50">
                    <button
                      type="button"
                      className="btn btn-light rounded-pill btn-md d-none d-md-inline-block dynamic-fs m-1"
                      onClick={() => { setModalVisible(false); setTimeout(() => setShowModal(false), 200); }}
                    >
                      <i className="bi bi-x-lg me-2 text-black"></i>
                      <span className="text-black">Cancel</span>
                    </button>
                    <button
                      type="button"
                      className="btn btn-light rounded-pill btn-sm d-md-none dynamic-fs m-1"
                      onClick={() => { setModalVisible(false); setTimeout(() => setShowModal(false), 200); }}
                    >
                      <i className="bi bi-x-lg me-2 text-black"></i>
                      <span className="text-black">Cancel</span>
                    </button>
                  </div>

                  <div className="text-end text-center w-50">
                    <button type="button" className="btn btn-danger rounded-pill btn-md d-none d-md-inline-block dynamic-fs m-1"
                      onClick={handleRemove}
                    >
                      <i className="bi bi-trash me-2 text-white"></i>
                      <span className="text-white">Remove</span>
                    </button>
                    <button type="button" className="btn btn-danger rounded-pill btn-sm d-md-none dynamic-fs m-1"
                      onClick={handleRemove}
                    >
                      <i className="bi bi-trash me-2 text-white"></i>
                      <span className="text-white">Remove</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Card;