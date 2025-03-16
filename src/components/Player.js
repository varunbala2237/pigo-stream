import React, { useState, useEffect } from 'react';
import useSaveWatchHistory from '../hooks/useSaveWatchHistory';
import useFetchTrailer from '../hooks/useFetchTrailer';

import './Player.css';

function Player({ mediaURL, averageVote, director, genres, mediaInfo, id, type, isInList, handleAddToList }) {
const [imageUrl, setImageUrl] = useState('');
const [inHistory, setInHistory] = useState(false);
const { trailerLink, loading } = useFetchTrailer(id, type);
const [isIframeVisible, setIsIframeVisible] = useState(false);
const [showCloseButton, setShowCloseButton] = useState(true);
const [showExtensionModal, setShowExtensionModal] = useState(false);

useEffect(() => {
  setImageUrl(
    mediaInfo.poster_path
      ? `https://image.tmdb.org/t/p/w500${mediaInfo.poster_path}`
      : 'https://icons.iconarchive.com/icons/blackvariant/button-ui-system-folders-alt/512/Movie-icon.png'
  );
}, [mediaInfo.poster_path]);

// Add the Media to Watch History
const { addToHistory } = useSaveWatchHistory();

// Auto-hide close button after inactivity
useEffect(() => {
if (isIframeVisible) {
  let hideTimer = setTimeout(() => setShowCloseButton(false), 3000);
  const resetTimer = () => {
    setShowCloseButton(true);
    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => setShowCloseButton(false), 3000);
  };

  window.addEventListener("mousemove", resetTimer);
  window.addEventListener("touchstart", resetTimer);

  return () => {
    clearTimeout(hideTimer);
    window.removeEventListener("mousemove", resetTimer);
    window.removeEventListener("touchstart", resetTimer);
  };
}
}, [isIframeVisible]);

const checkExtensionAndOpenPlayer = async () => {
  try {
    // Check if Chrome Extension is installed
    if (window.chrome?.runtime) {
      window.chrome.runtime.sendMessage('giaahkaknjfipcgflifbmmaehededemi', { action: "check" }, async (response) => {
        if (window.chrome.runtime.lastError || !response?.installed) {
          setShowExtensionModal(true);
        } else {
          await openPlayer();
        }
      });
    } else {
      setShowExtensionModal(true);
    }
  } catch (error) {
    console.error("Error checking extension:", error);
    setShowExtensionModal(true);
  }
};

const openPlayer = async () => {
try {
  if (!inHistory) {
    setInHistory(true);
    await addToHistory(id, type);
  }
  setIsIframeVisible(true);
  setShowExtensionModal(false);
} catch (error) {
  console.error("Error opening player:", error);
}
};

const handleShare = () => {
const currentURL = window.location.href;
if (navigator.share) {
  navigator.share({
    title: mediaInfo.title || mediaInfo.name,
    url: currentURL,
  }).catch((err) => console.error("Error sharing:", err));
} else {
  console.error("Web Share API not supported in this browser.");
}
};

const openChromeStore = () => {
  setShowExtensionModal(false);
  window.open("https://chrome.google.com/webstore/search/PigoBlocker", "_blank");
};

if (loading) {
return (
  <div className="col vh-35 d-flex justify-content-center align-items-center">
    <div className="spinner-border text-light spinner-size-1" role="status">
      <span className="visually-hidden">Loading...</span>
    </div>
  </div>
);
}

return (
  <>
    {!isIframeVisible ? (
        <div className="d-flex flex-column custom-bg custom-theme-radius w-100 p-2">
          <div className="d-flex flex-column flex-md-row align-items-start justify-content-between w-100">
            <div className="d-flex flex-row align-items-start custom-theme-radius-low w-100">
              <div className="section border-0">
                <img
                  className="img-fluid custom-theme-radius-low mb-3 w-100"
                  src={imageUrl}
                  alt=""
                  style={{ height: 'auto', objectFit: 'cover', width: '100%' }}
                />
                <div className="d-flex flex-column align-items-stretch justify-content-center">

                  <div className="d-flex justify-content-between w-100 mb-3">
                    <div className="d-flex justify-content-center text-start w-50">
                    {/* Larger button for larger screen */}
                    <button
                      className={`btn px-2 py-1 d-none d-md-block border-0 text-white rounded-circle btn-light bg-black`}
                      onClick={handleAddToList}
                    >
                      <i className={`bi-${isInList ? 'bookmark-fill' : 'bookmark'}`}></i>
                    </button>
                    {/* Smaller button for smaller screen */}
                    <button
                      className={`btn d-block d-md-none btn-sm border-0 text-white rounded-circle btn-light bg-black`}
                      onClick={handleAddToList}
                    >
                      <i className={`bi-${isInList ? 'bookmark-fill' : 'bookmark'}`}></i>
                    </button>
                    </div>

                    <div className="d-flex justify-content-center text-end w-50">
                    {/* Larger button for larger screen */}
                    <button
                      className={`btn px-2 py-1 d-none d-md-block border-0 text-white rounded-circle btn-light bg-primary`}
                      onClick={handleShare}
                    >
                      <i className={`bi bi-share-fill`}></i>
                    </button>
                    {/* Smaller button for smaller screen */}
                    <button
                      className={`btn d-block d-md-none btn-sm border-0 text-white rounded-circle btn-light bg-primary`}
                      onClick={handleShare}
                    >
                      <i className={`bi bi-share-fill`}></i>
                    </button>
                    </div>
                  </div>

                  {/* Larger button for larger screen */}
                  <button
                    className={`btn d-none d-md-block mb-3 justify-content-center border-0 nowrap rounded-pill ${
                      trailerLink ? 'btn-light' : 'btn-secondary'
                    }`}
                    onClick={() => trailerLink && window.open(trailerLink, '_blank')}
                    disabled={!trailerLink}
                  >
                    <i className="bi bi-youtube text-danger me-1"></i>
                      {"Trailer"}
                  </button>
                  {/* Smaller button for smaller screen */}
                  <button
                    className={`btn d-block d-md-none btn-sm mb-3 justify-content-center border-0 nowrap rounded-pill ${
                      trailerLink ? 'btn-light' : 'btn-secondary'
                    }`}
                    onClick={() => trailerLink && window.open(trailerLink, '_blank')}
                    disabled={!trailerLink}
                  >
                    <i className="bi bi-youtube text-danger me-1"></i>
                      {"Trailer"}
                  </button>

                  {/* Larger button for larger screen */}
                  <button
                    className="btn btn-dark d-none d-md-block justify-content-center border-0 text-white rounded-pill custom-bg"
                    onClick={checkExtensionAndOpenPlayer}
                  >
                    <i className="bi bi-play-circle-fill theme-color me-1"></i>
                    Play
                  </button>
                  {/* Smaller button for smaller screen */}
                  <button
                    className="btn btn-dark d-block d-md-none btn-sm justify-content-center border-0 text-white rounded-pill custom-bg"
                    onClick={checkExtensionAndOpenPlayer}
                  >
                    <i className="bi bi-play-circle-fill theme-color me-1"></i>
                    Play
                  </button>
                </div>
              </div>
              <div className="section ms-3">
                <h4 className="text-wrap dynamic-ts">{mediaInfo.title ? mediaInfo.title : mediaInfo.name}</h4>
                <div className="align-items-start justify-content-start w-100">
                  <div className="rounded dynamic-fs">
                    <i className="bi bi-star-fill text-warning me-1"></i>
                    <span id="Rating" className="text-white">
                      {averageVote} 
                    </span>
                  </div>
                </div>
                <div className="d-flex flex-column flex-wrap mt-2">
                  <p className="dynamic-fs me-2">
                    <b>Release Date: </b>{mediaInfo.release_date ? mediaInfo.release_date : mediaInfo.first_air_date}<br/>
                    <b>Director: </b>{director}<br/>
                    <b>Genres: </b>
                      <span className="text-white">
                        {genres?.map((genre, index) => (
                          <React.Fragment key={index}>
                            {genre.name}
                            {index < genres.length - 1 && ", "}
                          </React.Fragment>
                        ))}
                      </span><br />
                    <div className="text-wrap text-break mt-2 dynamic-fs">{mediaInfo.overview}</div><br/>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="d-flex flex-column custom-bg custom-theme-radius w-100 p-0">
          <div className="d-flex flex-column flex-md-row align-items-start justify-content-between w-100">
            <div className="d-flex flex-row align-items-start custom-theme-radius-low w-100">
              { /* Iframe section */ }
              <section className="w-100 position-relative">
                <iframe
                  src={mediaURL}
                  className="custom-theme-radius"
                  title="Media Player"
                  allowFullScreen
                ></iframe>

                {showCloseButton && (
                  <button
                    className="btn btn-dark custom-bg border-0 position-absolute rounded-pill dynamic-fs"
                    style={{
                      top: "10px",
                      right: "10px",
                      left: "auto",
                      transform: "none",
                      zIndex: 10,
                    }}
                    onClick={() => setIsIframeVisible(false)}
                  >
                    <i className="bi bi-x-lg me-1"></i>
                    Close
                  </button>
                )}
              </section>
            </div>
          </div>
        </div>
      )
    }

    {/* Modal for Chrome Extension */}
    {showExtensionModal && (
      <>
        {/* Backdrop */}
        <div className={`modal-backdrop fade ${showExtensionModal ? 'show' : ''}`}></div>

        <div className={`modal fade zoom-in-out ${showExtensionModal ? 'show' : ''} d-block`} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered mx-auto border-0 modal-pad">
            <div className="modal-content dynamic-fs bd-callout-dark custom-theme-radius text-white border-0">
              <div className="modal-body justify-content-center border-0">
                <p className="dynamic-ts">Chrome Extension Required</p> 
                <p className="dynamic-fs">
                  You need to install our Chrome extension <span className="text-primary">PigoBlocker</span> for the best experience.
                </p>
              </div>
              <div className="d-flex justify-content-end w-100 my-2">
                {/* Continue Without Extension Button */}
                <button
                  className="btn btn-dark bd-callout-dark border-0 rounded-pill btn-md d-none d-md-inline-block dynamic-fs m-1"
                  onClick={() => {
                    setShowExtensionModal(false);
                    openPlayer();  // Open the iframe directly
                  }}
                >
                  <i className="bi bi-play-circle-fill theme-color me-1"></i>
                  Continue
                </button>

                <button
                  className="btn btn-dark bd-callout-dark border-0 rounded-pill btn-sm d-md-none dynamic-fs m-1"
                  onClick={() => {
                    setShowExtensionModal(false);
                    openPlayer();
                  }}
                >
                  <i className="bi bi-play-circle-fill theme-color me-1"></i>
                  Continue
                </button>

                <div className="text-center">
                  <button className="btn btn-primary bd-callout-primary rounded-pill btn-md d-none d-md-inline-block dynamic-fs m-1"
                    onClick={openChromeStore}>
                    <i className="bi bi-browser-chrome me-1"></i>
                    Go to Store
                  </button>
                  <button className="btn btn-primary bd-callout-primary rounded-pill btn-sm d-md-none dynamic-fs m-1"
                    onClick={openChromeStore}>
                    <i className="bi bi-browser-chrome me-1"></i>
                    Go to Store
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    )}
  </>
);
}

export default Player;