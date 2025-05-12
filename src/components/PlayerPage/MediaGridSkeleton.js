// MediaGridSkeleton.js
import { useState, useEffect } from 'react';
import './MediaGridSkeleton.css';
import CastCard from '../CastCard';
import ConnectionModal from '../../utils/ConnectionModal';
import Alert from '../../utils/Alert';

function MediaGridSkeleton({ mediaInfo, servers, loadingInfo, loadingLink, errorInfo, errorLink }) {
  const [contentAlertMessage, setContentAlertMessage] = useState('');
  const [showConnectionModal, setShowConnectionModal] = useState(false);

  // Connection modal handling
  useEffect(() => {
    if (errorInfo || errorLink) {
      setShowConnectionModal(true);
    } else {
      setShowConnectionModal(false);
    }
  }, [errorInfo, errorLink]);

  // Alert handling for no content
  useEffect(() => {
    const hasContent = (mediaInfo && mediaInfo.length > 0) || (servers && servers.length > 0);
    // Check if there is no content available
    if (!loadingInfo && !loadingLink && !errorInfo && !errorLink && !hasContent) {
      setContentAlertMessage('No media or content available.');
    } else {
      setContentAlertMessage('');
    }

    if (!loadingInfo && !loadingLink && !errorInfo && !errorLink && !hasContent) {
      // Show the alert for 5 seconds
      const timer = setTimeout(() => {
        setContentAlertMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [loadingInfo, loadingLink, errorInfo, errorLink, mediaInfo, servers]);

  const handleAlertDismiss = () => {
    setContentAlertMessage('');
  };

  return (
    <>
      <div className="flex-row custom-w-size-100">
        <div className="row justify-content-center position-relative">
          <div className="col-12 px-2" style={{ maxWidth: '100%' }}>

            <div className="container bg-transparent">
              {/* Custom Player Skeleton Box */}
              <div className="player-skeleton custom-bg custom-theme-radius p-2">
                <div className="player-skeleton-poster custom-theme-radius-low custom-bg"></div>
                <div className="player-skeleton-text-block">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="player-skeleton-line custom-theme-radius-low custom-bg"
                      style={{ width: `${90 - idx * 10}%` }}
                    ></div>
                  ))}
                </div>
              </div>

              {/* Servers Section Skeleton */}
              <div className="container custom-bg custom-theme-radius w-100 p-2 my-2">
                <div className="dynamic-ts py-2">
                  {/* Grey box for Server Label */}
                  <div className="player-skeleton-placeholder custom-theme-radius bd-callout-dark" style={{ width: '150px', height: '20px' }}></div>
                </div>
                <div className="row g-2">
                  <div className="col-4 col-sm-3 col-md-4 col-lg-3 col-xl-2">
                    <button className="btn w-100 border-0 rounded-pill shadow-sm btn-grey bd-callout-dark">
                      <span className="player-skeleton-placeholder custom-theme-radius bd-callout-dark" style={{ width: '80%', height: '18px' }}></span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Cast Section Skeleton */}
              <div className="d-flex flex-column align-items-start custom-theme-radius my-2 w-100">
                <div className="container py-2">
                  <div className="dynamic-ts">
                    {/* Grey box for Cast Label */}
                    <div className="player-skeleton-placeholder custom-theme-radius bd-callout-dark" style={{ width: '100px', height: '20px' }}></div>
                  </div>
                  <div className="row justify-content-center">
                    {/* Skeleton for Cast Cards */}
                    {Array.from({ length: 4 }).map((_, index) => (
                      <CastCard key={index} isSkeleton={true} />
                    ))}
                  </div>
                  <div className="text-end">
                    <button className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-md d-none d-md-inline-block">
                      {/* Grey text for Show More */}
                      <div className="skeleton-placeholder skeleton-text" style={{ width: '100px', height: '20px' }}></div>
                    </button>

                    <button className="btn btn-dark bd-callout-dark dynamic-fs border-0 rounded-pill btn-sm d-md-none">
                      {/* Grey text for Show More */}
                      <div className="skeleton-placeholder skeleton-text" style={{ width: '80px', height: '20px' }}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Modal */}
      {showConnectionModal && <ConnectionModal show={showConnectionModal} />}

      {/* Alert for no content */}
      {contentAlertMessage && (
        <Alert message={contentAlertMessage} onClose={handleAlertDismiss} type="primary" />
      )}
    </>
  );
}

export default MediaGridSkeleton;