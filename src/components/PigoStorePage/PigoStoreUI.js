import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import useAppVersion from '../../hooks/PigoStorePage/useAppVersion';
import useDownloadApp from '../../hooks/PigoStorePage/useDownloadApp';
import OverlaySpinner from '../../utils/OverlaySpinner';
import ConnectionModal from '../../utils/ConnectionModal';
import Alert from '../../utils/Alert';

import { getSessionValue, setSessionValue } from '../../utils/sessionStorageStates';

const PigostoreUI = () => {
  const [alertMessage, setAlertMessage] = useState(''); // State for alert message
  const [currentPlatform, setCurrentPlatform] = useState(''); // State for current platform
  const navigate = useNavigate(); // Initialize navigate

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

  // Restoring page states
  useEffect(() => {
    const savedScrollPosition = getSessionValue('PigoStoreUI', 'pageScrollState') || 0;

    if (savedScrollPosition) {
      requestAnimationFrame(() => {
        window.scrollTo({ top: savedScrollPosition, behavior: 'instant' });
      });
    }

    const handlePageScroll = () => {
      const scrollPosition = window.scrollY;
      setSessionValue('PigoStoreUI', 'pageScrollState', scrollPosition);
    };

    window.addEventListener('scroll', handlePageScroll);
    return () => {
      window.removeEventListener('scroll', handlePageScroll);
    };
  }, []);

  useEffect(() => {
    const platform = detectPlatform();
    setCurrentPlatform(platform); // Set current platform based on detection
  }, []);

  // Fetch the appVersion
  const { version: appVersion, loading: isLoading, error: isError } = useAppVersion(currentPlatform);
  // Fetch download link based on the detected platform
  const { downloadLink } = useDownloadApp(currentPlatform);

  const handleDownload = async () => {
    if (!downloadLink) return;
    else window.location.href = downloadLink;
  };

  useEffect(() => {
    if (!isLoading && !downloadLink) {
      setAlertMessage(`Sorry, downloading isn't available right now.`);
      const timer = setTimeout(() => {
        setAlertMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    } else {
      setAlertMessage('');
    }
  }, [isLoading, downloadLink]);

  const handleAlertDismiss = () => {
    setAlertMessage('');
  };

  // List of supported devices with dynamic check
  const supportedDevices = [
    { name: 'Windows', platform: 'windows' },
    { name: 'macOS', platform: 'macos' },
    { name: 'Linux', platform: 'linux' },
    { name: 'Android', platform: 'android' },
    { name: 'iOS', platform: 'ios' },
  ];

  return (
    <div className="d-flex flex-column vh-100 w-100"
      style={{ background: "linear-gradient(to bottom, #121229, #121229, black, black)" }}
    >
      {/* Overlay spinner for loading state */}
      <OverlaySpinner visible={isLoading} />

      <div className="container vh-100 d-flex bg-transparent justify-content-center align-items-center">
        <div className="card custom-bg custom-theme-radius-low p-2">
          <div className="section m-2">
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex justify-content-center align-items-center text-center">
                <p className="text-white me-2 dynamic-hs m-0"><b>Pigo</b>Player</p>
                <span className="text-secondary align-self-center">
                  v{appVersion || "0.1.0"} {/* Display app version */}
                </span>
              </div>

              {/* Back button with navigation */}
              <button
                type="button"
                className="btn btn-dark bd-callout-dark d-flex border-0 text-white rounded-pill dynamic-fs"
                onClick={() => navigate(-1)} // Navigate to the previous page
              >
                <i className="bi bi-arrow-left me-2"></i>
                Back
              </button>
            </div>
            <p className="text-white dynamic-fs">Install PigoPlayer for seamless streaming and access content without redirects.</p>
            <button
              className="btn btn-primary d-flex rounded-pill dynamic-fs"
              onClick={handleDownload}
              disabled={isLoading || isError}
            >
              <i className="bi bi-file-earmark-zip me-2"></i>
              Download
            </button>
          </div>

          {/* Horizontal Section with two columns for Supported Devices and Instructions */}
          <div className="section m-2">
            <div className="row">
              {/* Devices Section */}
              <div className="col-12 col-md-6 mb-3">
                <p className="text-white dynamic-ts">Detected Device</p>
                <ul className="list-unstyled">
                  {supportedDevices.map((device, index) => {
                    const isCurrentDevice = device.platform === currentPlatform;
                    const isSupported = currentPlatform === "windows" || currentPlatform === "android";

                    return (
                      <li
                        key={index}
                        className={`d-flex align-items-center ${isCurrentDevice ? (isSupported ? "text-success" : "text-danger") : "text-secondary"}`
                        }
                      >
                        {isCurrentDevice ? (
                          isSupported ? (
                            <i className="bi bi-check2-circle me-2"></i>
                          ) : (
                            <i className="bi bi-x-circle me-2"></i>
                          )
                        ) : (
                          <i className="bi bi-circle me-2" style={{ opacity: 0.5 }}></i>
                        )}
                        <span
                          className="dynamic-fs"
                          style={{ opacity: isCurrentDevice ? 1 : 0.5 }}
                        >
                          {device.name}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {/* Instructions Section */}
              <div className="col-md-6">
                <p className="text-white dynamic-ts">Instructions</p>
                <ul className="text-white dynamic-fs">
                  <li>Click "Download" to get the .zip file.</li>
                  <li>Extract the file and run the installer.</li>
                  <li>If needed, disable antivirus or ignore warnings.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Connection Modal */}
      {isError && <ConnectionModal show={isError} />}

      {/* Alert for successful removal */}
      {alertMessage && <Alert message={alertMessage} onClose={handleAlertDismiss} type="danger" />}
    </div>
  );
};

export default PigostoreUI;