import React, { useState, useEffect } from 'react';
import useSaveWatchHistory from '../hooks/useSaveWatchHistory';
import useFetchTrailer from '../hooks/useFetchTrailer';
import useAppVersion from '../hooks/useAppVersion';
import { useNavigate } from 'react-router-dom';

function Player({ mediaURL, averageVote, director, genres, mediaInfo, id, type, isInList, handleAddToList }) {
  const [imageUrl, setImageUrl] = useState('');
  const [inHistory, setInHistory] = useState(false);
  const { trailerLink, loading } = useFetchTrailer(id, type);
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
  const { version: appVersion } = useAppVersion(platform);

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
      <div className="col vh-35 d-flex justify-content-center align-items-center">
        <div className="spinner-border text-light spinner-size-1" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
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

  const handleShare = () => {
    const currentURL = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: mediaInfo.title || mediaInfo.name,
        url: currentURL,
      }).catch((err) => console.error('Error sharing:', err));
    } else {
      console.error('Web Share API not supported in this browser.');
    }
  };

  const redirectToStore = () => {
    navigate('/pigostore');
  };

  return (
    <div className="d-flex flex-column custom-bg custom-theme-radius w-100 p-2">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between w-100 m-1">
        <div className="d-flex flex-row align-items-start custom-theme-radius-low w-100 mb-3 mb-md-0">
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
                <i className="bi bi-youtube text-danger me-2"></i>
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
                <i className="bi bi-youtube text-danger me-2"></i>
                  {"Trailer"}
              </button>

              {/* Larger button for larger screen */}
              <button
                className="btn d-none d-md-block justify-content-center border-0 text-white nowrap rounded-pill btn-light bg-black"
                onClick={() => openPlayer(mediaURL)}
              >
                <i className="bi bi-play-circle-fill theme-color me-2"></i>
                Play
              </button>
              {/* Smaller button for smaller screen */}
              <button
                className="btn d-block d-md-none btn-sm justify-content-center border-0 text-white nowrap rounded-pill btn-light bg-black"
                onClick={() => openPlayer(mediaURL)}
              >
                <i className="bi bi-play-circle-fill theme-color me-2"></i>
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
      {showNote && (
        <div className="bd-callout-dark custom-theme-radius dynamic-fs text-white mt-3" style={{padding: '1rem'}}>
          <i className="bi bi-exclamation-circle me-1"></i>
          {platform === 'windows' || platform === 'android' ? (
            <>Note: Don't have the app? <span className="link text-primary" onClick={redirectToStore}>
              <i className="bi bi-bag-check-fill me-1"></i>Get it now
            </span></>
          ) : (
            <>Note: <span className="link text-danger">Unsupported platform.</span></>
          )}
        </div>
      )}
    </div>
  );
}

export default Player;