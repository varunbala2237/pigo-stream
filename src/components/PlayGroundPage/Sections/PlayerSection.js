// PlayerSection.js
import React, { useState, useEffect } from 'react';
import useSaveWatchHistory from '../../../hooks/WatchHistoryPage/useSaveWatchHistory';
import useFetchTrailer from '../../../hooks/PlayGroundPage/useFetchTrailer';
import useAppVersion from '../../../hooks/PigoStorePage/useAppVersion';
import { useNavigate } from 'react-router-dom';
import openIframeWindow from "../../IframePage/openIframeWindow";

function PlayerSection({
  mediaURL,
  averageVote,
  director,
  genres,
  mediaInfo,
  id, type,
  isInList,
  handleAddToList,
}) {
  const [imageUrl, setImageUrl] = useState('');
  const [showFullDesc, setShowFullDesc] = useState(false);
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
      null
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
        window.location.href = appURL;
      } else if (platform === "macos" || platform === "ios") {
        openIframeWindow(serverLink);
      } else {
        // Return nothing
        return;
      }
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
    <div className="d-flex flex-column custom-bg custom-theme-radius-low w-100 p-2">
      <div className="d-flex flex-column flex-md-row align-items-start justify-content-between w-100">
        <div className="d-flex flex-row align-items-start custom-theme-radius-low w-100">
          <div className="section border-0">
            <img
              className="img-fluid custom-theme-radius-low mb-3"
              src={imageUrl}
              alt="empty"
              style={{
                width: '100%',
                maxWidth: '300px',
                height: 'auto',
                objectFit: 'cover',
              }}
            />

            <div className="d-flex flex-column align-items-stretch justify-content-center">

              <div className="d-flex justify-content-between rounded-pill w-100 mb-3">
                <div className="d-flex rounded-pill overflow-hidden border-0 w-100">
                  {/* Large and Small List Buttons*/}
                  <button
                    className="btn btn-dark d-none d-md-block rounded-pill-l border-0 text-white custom-bg flex-grow-1"
                    onClick={handleAddToList}
                  >
                    <i className={`bi-${isInList ? 'bookmark-fill theme-color' : 'bookmark'}`}></i>
                  </button>

                  <button
                    className="btn btn-dark d-block d-md-none btn-sm rounded-pill-l border-0 text-white custom-bg flex-grow-1"
                    onClick={handleAddToList}
                  >
                    <i className={`bi-${isInList ? 'bookmark-fill theme-color' : 'bookmark'}`}></i>
                  </button>

                  {/* Divider Line */}
                  <div className="bg-secondary" style={{ width: '1px' }}></div>

                  {/* Large and Small Share Buttons*/}
                  <button
                    className="btn btn-dark d-none d-md-block rounded-pill-r border-0 text-white custom-bg flex-grow-1"
                    onClick={handleShare}
                  >
                    <i className="bi bi-share-fill"></i>
                  </button>

                  <button
                    className="btn btn-dark d-block d-md-none btn-sm rounded-pill-r border-0 text-white custom-bg flex-grow-1"
                    onClick={handleShare}
                  >
                    <i className="bi bi-share-fill"></i>
                  </button>
                </div>
              </div>

              {/* Larger button for larger screen */}
              <button
                className={`btn d-none d-md-block mb-3 justify-content-center border-0 nowrap rounded-pill ${trailerLink ? 'btn-danger' : 'btn-secondary'
                  }`}
                onClick={() => trailerLink && window.open(trailerLink, '_blank')}
                disabled={!trailerLink}
              >
                <i className="bi bi-play-fill text-white me-2"></i>
                {"Trailer"}
              </button>
              {/* Smaller button for smaller screen */}
              <button
                className={`btn d-block d-md-none btn-sm mb-3 justify-content-center border-0 nowrap rounded-pill ${trailerLink ? 'btn-danger' : 'btn-secondary'
                  }`}
                onClick={() => trailerLink && window.open(trailerLink, '_blank')}
                disabled={!trailerLink}
              >
                <i className="bi bi-play-fill text-white me-2"></i>
                {"Trailer"}
              </button>

              {/* Larger button for larger screen */}
              <button
                className="btn btn-dark d-none d-md-block justify-content-center border-0 text-white nowrap rounded-pill custom-bg"
                onClick={() => {
                  openPlayer(mediaURL);
                }}
              >
                <i className="bi bi-play-fill theme-color me-2"></i>
                Play
              </button>
              {/* Smaller button for smaller screen */}
              <button
                className="btn btn-dark d-block d-md-none btn-sm justify-content-center border-0 text-white nowrap rounded-pill custom-bg"
                onClick={() => {
                  openPlayer(mediaURL);
                }}
              >
                <i className="bi bi-play-fill theme-color me-2"></i>
                Play
              </button>
            </div>
          </div>
          <div className="section ms-3">
            <h4 className="text-wrap dynamic-ts">{mediaInfo.title ? mediaInfo.title : mediaInfo.name}</h4>
            <div className="align-items-start justify-content-start w-100">
              <div className="rounded dynamic-fs">
                <i className="bi bi-star-fill text-warning me-2"></i>
                <span id="Rating" className="text-white">
                  {averageVote}
                </span>
              </div>
            </div>
            <div className="d-flex flex-column flex-wrap mt-2">
              <p className="dynamic-fs me-2">
                <b>Release Date: </b>
                {mediaInfo.release_date
                  ? new Date(mediaInfo.release_date).toLocaleDateString()
                  : new Date(mediaInfo.first_air_date).toLocaleDateString()}
                <br />
                <b>Director: </b>{director}<br />
                <b>Genres: </b>
                <span className="text-white">
                  {genres?.map((genre, index) => (
                    <React.Fragment key={index}>
                      {genre.name}
                      {index < genres.length - 1 && ", "}
                    </React.Fragment>
                  ))}
                </span><br />
              </p>
              <div className="text-wrap text-break dynamic-fs">
                <div
                  className={`${showFullDesc ? '' : 'text-clamp'}`}
                  style={{ whiteSpace: 'pre-line' }}
                >
                  {mediaInfo.overview}
                </div>

                {mediaInfo.overview.length > 280 && (
                  <div className="d-flex justify-content-end">
                    <button
                      className="btn d-none d-md-block dynamic-fs border-0 text-white"
                      onClick={() => setShowFullDesc(!showFullDesc)}
                    >
                      <i className={`bi bi-${showFullDesc ? 'chevron-up' : 'chevron-down'} me-2`}></i>
                      {showFullDesc ? 'Show Less' : 'Show More'}
                    </button>
                    <button
                      className="btn d-block d-md-none btn-sm dynamic-fs border-0 text-white"
                      onClick={() => setShowFullDesc(!showFullDesc)}
                    >
                      <i className={`bi bi-${showFullDesc ? 'chevron-up' : 'chevron-down'} me-2`}></i>
                      {showFullDesc ? 'Show Less' : 'Show More'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {
        showNote && (
          <div className="bd-callout-dark custom-theme-radius-low dynamic-fs text-white mt-3" style={{ padding: '1rem' }}>
            {platform === 'windows' || platform === 'android' ? (
              <>
                <i className="bi bi-info-circle me-2"></i>
                Don't have the player app?
                <span className="link text-primary" onClick={redirectToStore}>
                  <i className="bi bi-bag-check-fill mx-2"></i>Get it now
                </span>
              </>
            ) : platform === 'macos' || platform === 'ios' ? (
              <>
                <i className="bi bi-info-circle me-2"></i>
                This content may contain redirects and ads.
                <span className="link text-warning"> For the best experience, open in fullscreen mode.</span>
              </>
            ) : (
              <span className="link text-danger">Unsupported platform.</span>
            )}
          </div>
        )
      }
    </div>
  );
}

export default PlayerSection;