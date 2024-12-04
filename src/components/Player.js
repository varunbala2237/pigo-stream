import { React, useState, useEffect } from 'react';
import useSaveWatchHistory from '../hooks/useSaveWatchHistory';
import useFetchTrailer from '../hooks/useFetchTrailer';
import { useNavigate } from 'react-router-dom'; // for navigation to PigoStore

function Player({ mediaURL, id, type }) {
  const [inHistory, setInHistory] = useState(false);
  const { trailerLink, loading, error } = useFetchTrailer(id, type);
  const [showNote, setShowNote] = useState(false);
  const navigate = useNavigate(); // Use navigate to redirect to PigoStore

  // Function to detect current platform
  const detectPlatform = () => {
    // Use navigator.userAgentData if available
    if (navigator.userAgentData) {
      const platform = navigator.userAgentData.platform.toLowerCase();
      if (platform.includes('windows')) return 'windows';
      if (platform.includes('mac')) return 'macos';
      if (platform.includes('linux')) return 'linux';
      if (platform.includes('android')) return 'android';
      if (platform.includes('ios') || platform.includes('iphone') || platform.includes('ipad')) return 'ios';
    }
    
    // Fallback to navigator.userAgent if userAgentData is not available
    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('mac')) return 'macos';
    if (userAgent.includes('linux')) return 'linux';
    if (/android/i.test(userAgent)) return 'android';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'ios';
    return 'unknown';
  };
  
  // Detect the platform once and use it for conditional rendering
  const platform = detectPlatform();

  // Watch History
  const { addToHistory } = useSaveWatchHistory();

  useEffect(() => {
    let timer;
    if (showNote) {
      timer = setTimeout(() => {
        setShowNote(false);
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [showNote]);

  if (loading) {
    return (
      <div className="col mt-5 mb-5 d-flex justify-content-center">
        <div className="spinner-border text-light spinner-size-1" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="col mt-5 mb-5">
        <p className="text-white text-center">Oops! Something went wrong.</p>
      </div>
    );
  }

  const openPlayer = async (serverLink) => {
    try {
      // Add to watch history
      if (!inHistory) {
        setInHistory(true);
        await addToHistory(id, type);
      }

      // Show note when "Play" is clicked
      setShowNote(true);

      // Initialize the appURL
      let appURL;

      if (platform === 'windows') {
        // Windows URL scheme
        appURL = `pigoplayer://open?url=${encodeURIComponent(serverLink)}`;
      } else if (platform === 'android') {
        // Android intent URL scheme for deep linking
        appURL = `pigoplayer://open?url=${encodeURIComponent(serverLink)}`;
      } else {
        // Not supported
        return;
      }

      window.location.href = appURL; // Try to open the app
    } catch (error) {
      console.error("Error opening app:", error);
    }
  };

  const redirectToStore = () => {
    navigate('/pigostore');
  };

  return (
    <>
      {trailerLink ? (
        <div className="trailer-container">
          <iframe
            className="trailer-iframe custom-theme-radius-low"
            src={trailerLink}
            title="YouTube trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p className="text-center text-white mt-5 mb-5">No trailer found.</p>
      )}
      <div className="mt-4">
        {(platform === 'windows' || platform === 'android') && ( // Show button only for supported platforms
          <>
            {/* Default */}
            <button
              className="btn btn-light rounded-pill"
              onClick={() => openPlayer(mediaURL)}
            >
              Play in <i className="bi bi-play-circle-fill text-primary"></i> <b>Pigo</b>Player
            </button>
          </>
        )}
      </div>
      <div className="mt-2">
        {showNote && (
          <div className={platform === 'windows' || platform === 'android' ? 'bd-callout-dark text-white' : 'bd-callout-dark text-danger'}>
            <i className="bi bi-exclamation-circle me-2"></i>
            {platform === 'windows' || platform === 'android' ? (
              <>Note: Don't have the app?<span className="link text-primary ms-2" onClick={redirectToStore}>
              <i className="bi bi-bag-check-fill me-2"></i>Get it now</span></>
            ) : (
              <>Note: Unsupported platform.</>
            )}
          </div>
        )}
      </div>
    </>
  );
}

export default Player;