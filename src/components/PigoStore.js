import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import useAppVersion from '../hooks/useAppVersion';
import useDownloadApp from '../hooks/useDownloadApp';

const Pigostore = () => {
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

  useEffect(() => {
    const platform = detectPlatform();
    setCurrentPlatform(platform); // Set current platform based on detection
  }, []);


  // Fetch the appVersion
  const { version: appVersion } = useAppVersion(currentPlatform);
  // Fetch download link based on the detected platform
  const { downloadLink, loading, error } = useDownloadApp(currentPlatform);

  const handleDownload = async () => {
    if (!downloadLink) return;
    else window.location.href = downloadLink;
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
    <div className="vh-100 d-flex justify-content-center align-items-center poppins-medium" 
      style={{ background: "linear-gradient(to bottom, #121229, #121229, black, black)" }}
    >
      <div className="container bg-transparent p-0 mx-4 custom-theme-radius" style={{ maxWidth: '600px' }}>
        <div className="section p-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="d-flex justify-content-center align-items-center text-center">
              <p className="text-white me-2 dynamic-hs m-0">PigoPlayer</p>
              <span className="text-secondary align-self-center">
                v{appVersion || "1.0.0"}
              </span>
            </div>

            {/* Back button with navigation for small screens */}
            <button 
              type="button" 
              className="btn btn-dark bd-callout-dark border-0 btn-sm d-md-none text-white rounded-pill dynamic-fs"
              onClick={() => navigate(-1)} // Navigate to the previous page
            >
              <i className="bi bi-chevron-left me-2"></i> 
              Back
            </button>
            {/* Back button with navigation for large screens */}
            <button 
              type="button" 
              className="btn btn-dark bd-callout-dark border-0 btn-md d-none d-md-inline-block text-white rounded-pill dynamic-fs"
              onClick={() => navigate(-1)} // Navigate to the previous page
            >
              <i className="bi bi-chevron-left me-2"></i> 
              Back
            </button>
          </div>
          <p className="text-white dynamic-fs">Install PigoPlayer for seamless streaming and access content without redirects.</p>
          {loading && 
            <div className="col d-flex justify-content-start">
              <div className="spinner-border text-light spinner-size-1" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          }
          {!loading ? ( // Check if not loading and no error
            downloadLink && !error ? (
              <button
                className="btn btn-primary rounded-pill dynamic-fs"
                onClick={handleDownload}
              >
                <i className="bi bi-file-earmark-zip me-2"></i>
                Download
              </button>
            ) : (
              <p className="text-danger dynamic-fs">Currently not available.</p>
            )
          ) : null} 
        </div>

        {/* Horizontal Section with two columns for Supported Devices and Instructions */}
        <div className="section p-4">
          <div className="row">
            {/* Devices Section */}
            <div className="col-md-6">
              <p className="text-white dynamic-ts">Detected Device</p>
              <ul className="list-unstyled">
                {supportedDevices.map((device, index) => {
                  const isCurrentDevice = device.platform === currentPlatform;
                  const isSupported = currentPlatform === "windows" || currentPlatform === "android";

                  return (
                    <li 
                      key={index} 
                      className={`d-flex align-items-center ${
                        isCurrentDevice ? (isSupported ? "text-success" : "text-danger") : "text-secondary"}`
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
  );
};

export default Pigostore;