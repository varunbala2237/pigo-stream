// HomeUI.js
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../Header';
import Footer from '../Footer';
import TrendingGrid from './TrendingGrid';
import ProvidersGrid from './ProvidersGrid';
import OverlaySpinner from '../../utils/OverlaySpinner';
import ErrorModal from '../../utils/ErrorModal';
import Alert from '../../utils/Alert';
import './HomeUI.css';

import { getSessionValue, setSessionValue, removeSessionValue } from '../../utils/sessionStorageStates';

const SESSION_PATH = ['HomeUI'];

const HomeUI = ({
  title,
  mediaId,
  mediaType,
  mediaDesc,
  rating,
  year,
  isRecommended,
  isIndexError,
}) => {
  const navigate = useNavigate();

  // Loading handling flags
  const [isTrendingLoading, setIsTrendingLoading] = useState(true);
  const [isProvidersLoading, setIsProvidersLoading] = useState(true);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Error handling flags
  const [isTrendingError, setIsTrendingError] = useState(false);
  const [isProvidersError, setIsProvidersError] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  const isError = isIndexError || isTrendingError || isProvidersError;

  // No content handling flags
  const [hasTrendingContent, setHasTrendingContent] = useState(true);
  const [hasProvidersContent, setHasProvidersContent] = useState(true);

  // Alert messages
  const [alert, setAlert] = useState({ message: '', type: '', key: '' });

  // Restoring page states
  useEffect(() => {
    const savedWelcomeMessage = getSessionValue(...SESSION_PATH, 'welcomeMessage');
    const savedScrollPosition = getSessionValue(...SESSION_PATH, 'pageScrollState') || 0;

    if (savedWelcomeMessage) {
      setAlert({ message: savedWelcomeMessage, type: 'success', key: 'welcome' });
      setTimeout(() => {
        setAlert((prev) => (prev.key === 'welcome' ? { message: '', type: '', key: '' } : prev));
        removeSessionValue(...SESSION_PATH, 'welcomeMessage');
      }, 5000);
    }

    if (savedScrollPosition) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollPosition, behavior: 'instant' });
      });
    }

    const handlePageScroll = () => {
      const scrollPosition = window.scrollY;
      setSessionValue(...SESSION_PATH, 'pageScrollState', scrollPosition);
    };

    window.addEventListener('scroll', handlePageScroll);
    return () => {
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, []);

  // Page loading state handling
  useEffect(() => {
    if (!isTrendingLoading || !isProvidersLoading) {
      setIsPageLoading(false);
    }
  }, [isTrendingLoading, isProvidersLoading]);

  // Error Modal handling
  useEffect(() => {
    if (isIndexError || isTrendingError || isProvidersError) {
      setShowErrorModal(true);
    }
  }, [isIndexError, isTrendingError, isProvidersError]);

  // Function to handle alert message updates
  const handleAlertMessage = (hasTrendingContent, hasProvidersContent) => {
    let alertMessage = '';

    // Check if there's no content available for trending and providers
    if (!hasTrendingContent && !hasProvidersContent) {
      alertMessage = 'No content available from trending or providers.';
    } else if (!hasTrendingContent) {
      alertMessage = 'No trending content available.';
    } else if (!hasProvidersContent) {
      alertMessage = 'No content found for available providers.';
    }

    return alertMessage;
  };

  // Alert handling for no content
  useEffect(() => {
    let showTimer;
    let hideTimer;

    const alertMessage = handleAlertMessage(hasTrendingContent, hasProvidersContent);

    if (alertMessage) {
      showTimer = setTimeout(() => {
        setAlert({ message: alertMessage, type: 'primary', key: 'content' });

        hideTimer = setTimeout(() => {
          setAlert({ message: '', type: '', key: '' });
        }, 5000);
      }, 2000);
    } else {
      setAlert((prev) => (prev.key === 'content' ? { message: '', type: '', key: '' } : prev));
    }

    return () => {
      clearTimeout(showTimer);
      clearTimeout(hideTimer);
    };
  }, [hasTrendingContent, hasProvidersContent]);

  const handleAlertDismiss = () => {
    setAlert({ message: '', type: '', key: '' });
  };

  const handlePlayMedia = async (tab) => {
    navigate(`/play?id=${mediaId}&type=${mediaType}&tab=${tab}`);
  };

  return (
    <div className="d-flex flex-column justify-content-center align-items-center p-0">
      <div className="w-100">
        {/* Overlay spinner for loading state */}
        <OverlaySpinner visible={isPageLoading} />

        {/* Header */}
        <Header />

        {!title ? (
          <div className="container my-5" style={{ textAlign: 'start' }}>
            <div className="d-flex flex-column text-white custom-theme-radius-low mx-2 p-2">
              <div className="d-flex flex-column align-items-start gap-2">
                <div className="hero-skeleton-badge custom-theme-radius-low custom-bg"></div>
                <div className="hero-skeleton-title-bar bd-callout-dark"></div>
              </div>
              <div className="dynamic-fs text-white gap-2 mt-2">
                <div className="dynamic-fs d-flex align-items-center gap-2">
                  <div className="hero-skeleton-bar custom-bg" style={{ width: '50px' }}></div>
                  <div className="hero-skeleton-bar custom-bg" style={{ width: '50px' }}></div>
                  <div className="hero-skeleton-bar custom-bg" style={{ width: '50px' }}></div>
                </div>
                <div className="hero-skeleton-title-bar my-2 bd-callout-dark w-100"></div>
                <div className="d-flex gap-2">
                  <div className="btn hero-skeleton-button my-2 custom-bg"></div>
                  <div className="btn hero-skeleton-button my-2 bd-callout-primary"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container my-5" style={{ textAlign: 'start' }}>
            <div className="d-flex flex-column text-white custom-theme-radius-low mx-2 p-2">
              <div className="d-flex justify-content-start align-items-center dynamic-fs text-white fw-bold">
                {isRecommended ? 'Picked Just for You' : '#1 Most Watched'}
              </div>

              <div className="d-flex justify-content-start align-items-center">
                <span className="text-wrap fw-bold dynamic-hs">{title}</span>
              </div>

              <div className="d-flex justify-content-start align-items-center text-white dynamic-fs mt-2 gap-2">
                <div className="d-flex border border-1 border-secondary custom-theme-radius-low px-1">
                  <span id="Year">{year}</span>
                </div>

                <div className="d-flex border border-1 border-secondary custom-theme-radius-low px-1">
                  {mediaType === 'movie' ? (
                    <span>Movie</span>
                  ) : (
                    <span>Show</span>
                  )}
                </div>

                <div className="d-flex border border-1 border-secondary custom-theme-radius-low px-1">
                  <span id="Rating"><i className="bi bi-star-fill text-warning me-1"></i>{rating}</span>
                </div>
              </div>

              <div className="dynamic-fs clamp-3 text-white my-2">{mediaDesc}</div>

              <div className="d-flex justify-content-start gap-2">
                <button
                  className="btn btn-dark bd-callout-dark d-flex dynamic-fs border-0 rounded-pill text-white"
                  onClick={() => handlePlayMedia('info')}
                >
                  <i className="bi bi bi-info-circle me-2"></i>
                  <span>Info</span>
                </button>
                <button
                  className="btn btn-primary bd-callout-primary d-flex dynamic-fs border-0 rounded-pill text-white"
                  onClick={() => handlePlayMedia('play')}
                >
                  <i className="bi bi-play-circle me-2"></i>
                  <span>Play</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-row text-white w-100">
          <div className="container">
            <TrendingGrid setIsTrendingLoading={setIsTrendingLoading} setIsTrendingError={setIsTrendingError} setHasTrendingContent={setHasTrendingContent} />
            <ProvidersGrid setIsProvidersLoading={setIsProvidersLoading} setIsProvidersError={setIsProvidersError} setHasProvidersContent={setHasProvidersContent} />
          </div>
        </div>

        {/* Footer Backspace & Footer */}
        <div className="divider" style={{ height: '6rem' }}></div>
        <Footer />

        {/* Error Modal */}
        {showErrorModal && <ErrorModal error={isError} />}

        {/* Alert Message */}
        {alert.message && (
          <Alert message={alert.message} onClose={handleAlertDismiss} type={alert.type} />
        )}
      </div>
    </div>
  );
}

export default HomeUI;