import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useRemoveWatchHistory from '../hooks/useRemoveWatchHistory';
import useRemoveFromMyList from '../hooks/useRemoveMyList';

function Card({ media, type, path, onRemove, handleAlert }) {
  const [imageUrl, setImageUrl] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [isRemove, setIsRemove] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();

  // Watch History
  const { removeFromHistory } = useRemoveWatchHistory();

  // My list
  const { removeFromList } = useRemoveFromMyList();

  useEffect(() => {
    setImageUrl(media.poster_path 
      ? `https://image.tmdb.org/t/p/w500${media.poster_path}` 
      : 'https://icons.iconarchive.com/icons/blackvariant/button-ui-system-folders-alt/512/Movie-icon.png');
  }, [media.poster_path]);

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
    if (path === '/watch-history' || path === '/my-list') {
      setShowModal(true);
      setTimeout(() => {
        setModalVisible(true);
      }, 10); // Adding a short delay to trigger the fade-in effect
    }
  };

  const handleRightClick = (event) => {
    event.preventDefault();
    if (path === '/watch-history' || path === '/my-list') {
      setShowModal(true);
      setTimeout(() => {
        setModalVisible(true);
      }, 10);
    }
  };

  // Extracting rating
  const rating = media.vote_average ? media.vote_average.toFixed(1) : '0.0';

  return (
    <div className="col-xl-1-5 col-lg-2-5 col-md-3-5 col-5 mb-3">
      <div
        className="card custom-card border-0 h-100 position-relative custom-theme-radius"
        onClick={handlePlayMedia}
        onContextMenu={handleRightClick}
        onMouseDown={(e) => e.button === 0 && setTimeout(() => handleLongClick(e), 2500)}
        style={{ cursor: isRemove ? 'default' : 'pointer', overflow: 'hidden' }}
      >
        <img
          src={imageUrl}
          className="card-img-top position-relative bg-dark"
          alt=''
          style={{ height: '250px', objectFit: 'cover' }}
        />
        {/* Rating Container */}
        <div className="position-absolute top-0 start-0 m-2 bd-callout-dark p-1 rounded">
          <i className="bi bi-star-fill text-warning"></i>
          <span id="Rating" className="text-white"> {rating} </span>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <>
          {/* Backdrop */}
          <div className={`modal-backdrop fade ${modalVisible ? 'show' : ''}`}></div>

          {/* Confirmation Modal */}
          <div className={`modal fade ${modalVisible ? 'show' : ''} d-block`} tabIndex="-1" aria-labelledby="confirmDeleteModalLabel" aria-hidden="true" style={{ zIndex: 1050 }}>
            <div className="modal-dialog border-0 my-0">
              <div className="modal-content bd-callout-dark custom-theme-radius-bottom text-white p-0 border-0">
                <div className="modal-header border-0">
                  Are you sure you want to remove this item?
                </div>
                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-light rounded-pill text-dark" 
                    onClick={() => { setModalVisible(false); setTimeout(() => setShowModal(false), 300); }}
                  >
                    <i className="bi bi-x-lg me-2"></i>
                    Cancel
                  </button>
                  <button type="button" className="btn bg-danger rounded-pill text-white"
                    onClick={handleRemove}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Remove
                  </button>
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