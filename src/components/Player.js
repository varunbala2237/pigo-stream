import { React, useState, useEffect } from 'react';
import useSaveWatchHistory from '../hooks/useSaveWatchHistory';
import useFetchTrailer from '../hooks/useFetchTrailer';
import useSaveMyList from '../hooks/useSaveMyList';
import useCheckMyList from '../hooks/useCheckMyList';
import { useNavigate } from 'react-router-dom'; // for navigation to PigoStore
import Alert from '../Alert';

function Player({ mediaURL, averageVote, title, id, type }) {
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState('');
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

  const handleAddToList = async () => {
    try {
      if (isInList) {
        setAlertMessage("Already exists in My List.");
        setAlertType("primary");
        setTimeout(() => setAlertMessage(''), 5000);
      } else {
        await addToList(id, type);
        refetch();
        setAlertMessage("Successfully added to My List.");
        setAlertType("success");
        setTimeout(() => setAlertMessage(''), 5000);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  const handleAlertDismiss = () => {
    setAlertMessage('');
  };

  // To Manage MyList
  const { addToList } = useSaveMyList();
  const { isInList, refetch } = useCheckMyList(id);
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
    <div className="d-flex flex-column align-items-center">
      <div className="d-flex flex-row p-4 custom-theme-radius custom-bg">

        <div className="d-flex flex-column align-items-center justify-content-center custom-theme-radius-low py-2">
          <h4 className="text-wrap mx-4">{title}</h4>
            <div className="align-items-start justify-content-start w-100">
              <div className="ms-4 rounded">
                <i className="bi bi-star-fill text-warning"></i>
                <span id="Rating" className="text-white"> {averageVote} </span>
              </div>
            </div>
        </div>

        <div className="d-flex flex-column align-items-top justify-content-center">
        {/* Watch Trailer Button */}
        <button
          className={`btn btn-block mb-3 justify-content-center border-0 nowrap rounded-pill ${trailerLink ? 'btn-light' : 'btn-secondary'}`}
          onClick={() => trailerLink && window.open(trailerLink, '_blank')}
          disabled={!trailerLink}
        >
          <i className="bi bi-youtube text-danger me-2"></i>
          {trailerLink ? 'Watch Trailer' : 'No Trailer Available'}
        </button>

        {/* Add to MyList Button */}
        <button
          className={`btn btn-block mb-3 justify-content-center border-0 text-white nowrap rounded-pill btn-light ${isInList ? 'bg-primary' : 'bg-black'}`}
          onClick={handleAddToList}
          title="Add to My List"
        >
          <i className={`bi-bookmark${isInList ? '-fill' : ''} me-2`}></i>
          { isInList ? 'Added' : 'Add' }
        </button>

        {/* Play in PigoPlayer Button */}
        {(platform === 'windows' || platform === 'android') && (
          <button
            className="btn btn-block justify-content-center border-0 text-white nowrap rounded-pill btn-light bg-black"
            onClick={() => openPlayer(mediaURL)}
          >
            <i className="bi bi-play-circle-fill text-primary me-2"></i>
            Play
          </button>
        )}
        </div>

      </div>

      {/* Note for App Download */}
      {showNote && (
        <div className="bd-callout-dark custom-theme-radius text-white mt-3">
          <i className="bi bi-exclamation-circle me-2"></i>
          {platform === 'windows' || platform === 'android' ? (
            <>Note: Don't have the app? <span className="link text-primary ms-2" onClick={redirectToStore}>
              <i className="bi bi-bag-check-fill me-2"></i>Get it now
            </span></>
          ) : (
            <>Note: Unsupported platform.</>
          )}
        </div>
      )}
      {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} type={alertType} />}
    </div>
  );
}

export default Player;