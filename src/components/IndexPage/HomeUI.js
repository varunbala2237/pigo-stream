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

  // Grid Switcher
  const [activeGrid, setActiveGrid] = useState('trending'); // default fallback

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
    const savedActiveGrid = getSessionValue(...SESSION_PATH, 'activeGrid');
    const savedScrollPosition = getSessionValue(...SESSION_PATH, 'pageScrollState') || 0;

    if (savedWelcomeMessage) {
      setAlert({ message: savedWelcomeMessage, type: 'success', key: 'welcome' });
      setTimeout(() => {
        setAlert((prev) => (prev.key === 'welcome' ? { message: '', type: '', key: '' } : prev));
        removeSessionValue(...SESSION_PATH, 'welcomeMessage');
      }, 5000);
    }

    if (savedActiveGrid) {
      setActiveGrid(savedActiveGrid);
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

  const handleGridChange = (grid) => {
    setActiveGrid(grid);
    setSessionValue(...SESSION_PATH, 'activeGrid', grid);
  };

  const handleAlertDismiss = () => {
    setAlert({ message: '', type: '', key: '' });
  };

  const handlePlayMedia = async () => {
    navigate(`/play?id=${mediaId}&type=${mediaType}`);
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
            <div className="d-flex flex-column text-white custom-theme-radius-low">
              <div className="d-flex align-items-center mb-2">
                <div className="hero-skeleton-title-bar bd-callout-dark"></div>
                <div className="hero-skeleton-badge custom-theme-radius-low custom-bg ms-2"></div>
              </div>
              <div className="dynamic-fs text-white">
                <div className="dynamic-fs my-2 d-flex align-items-center">
                  <div className="hero-skeleton-icon bd-callout-dark me-2"></div>
                  <div className="hero-skeleton-bar custom-bg me-2" style={{ width: '50px' }}></div>
                  <div className="hero-skeleton-icon bd-callout-dark me-2"></div>
                  <div className="hero-skeleton-bar custom-bg" style={{ width: '50px' }}></div>
                </div>
                <div className="dynamic-fs my-2">
                  <div className="hero-skeleton-bar" style={{ width: '100%' }}></div>
                </div>
                <div className="btn hero-skeleton-button my-2 bd-callout-dark"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="container my-5" style={{ textAlign: 'start' }}>
            <div className="d-flex flex-column text-white custom-theme-radius-low">
              <div className="d-flex justify-content-start align-items-center dynamic-hs">
                <b>{isRecommended ? 'Picked Just for You' : '#1 Most Watched'}</b>
              </div>
              <div className="d-flex justify-content-start align-items-center">
                <span className="text-wrap fw-bold dynamic-ts">{title}</span>
              </div>
              <div className="dynamic-fs">
                <div className="dynamic-fs d-flex my-2 text-white gap-2">
                  <span className="custom-bg rounded-pill px-2 py-1">
                    {mediaType === 'movie' ? (
                      <span><i className="bi bi-film me-2"></i>Movie</span>
                    ) : (
                      <span><i className="bi bi-tv me-2"></i>Show</span>
                    )}
                  </span>
                  <span className="custom-bg rounded-pill px-2 py-1">{year}</span>
                  <div className="custom-bg rounded-pill px-2 py-1">
                    <i className="bi bi-star-fill text-warning me-2"></i>
                    <span id="Rating">{rating}</span>
                  </div>
                </div>
                <div className="dynamic-fs text-secondary">{mediaDesc}</div>
                <div className="d-flex justify-content-start mt-2">
                  <button
                    className="btn btn-dark bd-callout-dark d-flex dynamic-fs border-0 rounded-pill text-white"
                    onClick={handlePlayMedia}
                  >
                    <i className="bi bi-play me-2"></i>
                    <span>Watch Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main content area */}
        <div className="flex-row text-white w-100">
          <div className="container mb-5">
            <div className="d-flex justify-content-start align-items-center">
              <button
                className={`btn bg-transparent text-white border-0 dynamic-hs 
                  ${activeGrid === 'trending' ? '' : 'opacity-50'}`}
                onClick={() => handleGridChange('trending')}
              >
                <i className="bi bi-fire theme-color me-2"></i>
                <b>Trending</b>
              </button>

              {/* Divider Line */}
              <div className="border-start border-secondary align-self-stretch"></div>

              <button
                className={`btn bg-transparent text-white border-0 dynamic-hs 
                  ${activeGrid === 'providers' ? '' : 'opacity-50'}`}
                onClick={() => handleGridChange('providers')}
              >
                <i className="bi bi-cast theme-color me-2"></i>
                <b>Providers</b>
              </button>
            </div>

            {activeGrid === 'trending' && (
              <TrendingGrid setIsTrendingLoading={setIsTrendingLoading} setIsTrendingError={setIsTrendingError} setHasTrendingContent={setHasTrendingContent} />
            )}

            {activeGrid === 'providers' && (
              <ProvidersGrid setIsProvidersLoading={setIsProvidersLoading} setIsProvidersError={setIsProvidersError} setHasProvidersContent={setHasProvidersContent} />
            )}
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