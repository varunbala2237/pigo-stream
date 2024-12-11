import { React, useState, useEffect } from 'react';
import useSaveWatchHistory from '../hooks/useSaveWatchHistory';
import useFetchTrailer from '../hooks/useFetchTrailer';
import { useNavigate } from 'react-router-dom';

function Player({ mediaURL, averageVote, director, genres, mediaInfo, id, type, isInList, handleAddToList }) {
  const [imageUrl, setImageUrl] = useState('');
  const [inHistory, setInHistory] = useState(false);
  const { trailerLink, loading, error } = useFetchTrailer(id, type);
  const [showNote, setShowNote] = useState(false);
  const navigate = useNavigate();

  const detectPlatform = () => {
    if (navigator.userAgentData) {
      const platform = navigator.userAgentData.platform.toLowerCase();
      if (platform.includes('windows')) return 'windows';
      if (platform.includes('mac')) return 'macos';
      if (platform.includes('linux')) return 'linux';
      if (platform.includes('android')) return 'android';
      if (platform.includes('ios')) return 'ios';
    }

    const userAgent = navigator.userAgent.toLowerCase();
    if (userAgent.includes('win')) return 'windows';
    if (userAgent.includes('mac')) return 'macos';
    if (userAgent.includes('linux')) return 'linux';
    if (/android/i.test(userAgent)) return 'android';
    if (/iphone|ipad|ipod/i.test(userAgent)) return 'ios';
    return 'unknown';
  };

  const platform = detectPlatform();
  const appVersion = "0.1.0"; // Dummy

  useEffect(() => {
    setImageUrl(
      mediaInfo.poster_path
        ? `https://image.tmdb.org/t/p/w500${mediaInfo.poster_path}`
        : 'https://icons.iconarchive.com/icons/blackvariant/button-ui-system-folders-alt/512/Movie-icon.png'
    );
  }, [mediaInfo.poster_path]);

  // Add the Media to Watch History
  const { addToHistory } = useSaveWatchHistory();

  useEffect(() => {
    let timer;
    if (showNote) {
      timer = setTimeout(() => setShowNote(false), 5000);
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
      if (!inHistory) {
        setInHistory(true);
        await addToHistory(id, type);
      }

      setShowNote(true);

      let appURL;
      if (platform === 'windows' || platform === 'android') {
        appURL = `pigoplayer://open?url=${encodeURIComponent(serverLink)}&version=${appVersion}`;
      } else {
        return;
      }

      window.location.href = appURL;
    } catch (error) {
      console.error('Error opening app:', error);
    }
  };

  const redirectToStore = () => {
    navigate('/pigostore');
  };

  return (
    <div className="d-flex flex-column custom-bg custom-theme-radius w-100 p-4">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between w-100">
        <div className="d-flex flex-row align-items-start custom-theme-radius-low w-100 mb-3 mb-md-0">
          <div className="section border-0">
            <img
              className="position-relative custom-theme-radius bg-dark mb-3"
              src={imageUrl}
              alt=""
              style={{ height: '250px', objectFit: 'cover', width: '150px' }}
            />
            <div className="d-flex flex-column align-items-stretch justify-content-center">
              <button
                className={`btn btn-block mb-3 justify-content-center border-0 nowrap rounded-pill ${
                  trailerLink ? 'btn-light' : 'btn-secondary'
                }`}
                onClick={() => trailerLink && window.open(trailerLink, '_blank')}
                disabled={!trailerLink}
              >
                <i className="bi bi-youtube text-danger me-2"></i>
                {trailerLink ? 'Watch Trailer' : 'No Trailer Available'}
              </button>
              <button
                className={`btn btn-block mb-3 justify-content-center border-0 text-white nowrap rounded-pill btn-light ${
                isInList ? 'bg-primary' : 'bg-black'
                }`}
                onClick={handleAddToList}
              >
                <i className={`bi-bookmark${isInList ? '-fill' : ''} me-2`}></i>
                {isInList ? 'Added' : 'Add'}
              </button>
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
          <div className="section ms-3">
            <h4 className="text-wrap">{mediaInfo.title ? mediaInfo.title : mediaInfo.name}</h4>
            <div className="align-items-start justify-content-start w-100">
              <div className="rounded">
                <i className="bi bi-star-fill text-warning me-1"></i>
                <span id="Rating" className="text-white">
                  {averageVote} 
                </span>
              </div>
            </div>
            <div className="d-flex flex-column mt-2">
              <small>
                <b className="me-2">Release Date: </b>{mediaInfo.release_date ? mediaInfo.release_date : mediaInfo.first_air_date}<br/>
                <b className="me-2">Director: </b>{director}<br/>
                <b className="me-2">Genres: </b>{genres?.map((genre, index) => (
                  <span key={index} className="custom-bg rounded-pill px-2 m-1">
                    {genre.name}
                  </span>
                ))}<br/>
                <div className="mt-2">{mediaInfo.overview}</div><br/>
              </small>
            </div>
          </div>
        </div>
      </div>
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
    </div>
  );
}

export default Player;