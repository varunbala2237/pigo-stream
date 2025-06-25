// PlayGroundFooter.js
import { useState, useRef } from 'react';
import useAppVersion from '../../hooks/PigoStorePage/useAppVersion';
import useSaveWatchHistory from '../../hooks/WatchHistoryPage/useSaveWatchHistory';
import { useNavigate } from 'react-router-dom';
import '../Footer.css';

function PlayGroundFooter({ id, type, mediaURL }) {
    const [inHistory, setInHistory] = useState(false);
    const [isLaunching, setIsLaunching] = useState(false);
    const launchInProgress = useRef(false);
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
    const { addToHistory } = useSaveWatchHistory();

    const openPlayer = (serverLink) => {
        if (launchInProgress.current) return;
        launchInProgress.current = true;
        setIsLaunching(true); // trigger re-render and disable button

        try {
            let appURL;

            if (platform === 'windows' || platform === 'android') {
                appURL = `pigoplayer://open?url=${encodeURIComponent(serverLink)}&version=${appVersion}`;
                let didBlur = false;

                window.location.href = appURL;

                const timeout = setTimeout(() => {
                    if (!didBlur) {
                        launchInProgress.current = false;
                        setIsLaunching(false);
                        redirectToStore();
                    }
                }, 3000);

                window.addEventListener(
                    'blur',
                    () => {
                        didBlur = true;
                        clearTimeout(timeout);
                        launchInProgress.current = false;
                        setIsLaunching(false);
                    },
                    { once: true }
                );
            } else {
                launchInProgress.current = false;
                setIsLaunching(false);
                redirectToStore();
            }

            if (!inHistory) {
                setInHistory(true);
                addToHistory(id, type).catch((err) => {
                    console.error('Failed to save watch history:', err);
                });
            }

        } catch (error) {
            launchInProgress.current = false;
            setIsLaunching(false);
            console.error('Error opening app:', error);
        }
    };

    const redirectToStore = () => {
        navigate('/pigostore');
    };

    return (
        <div className="footer-fixed bd-callout-dark w-100 position-fixed bottom-0 shadow">
            <ul className="nav h-100 w-100 d-flex justify-content-between align-items-center dynamic-fs">

                {/* Back button with navigation */}
                <li className="nav-item text-center mx-auto">
                    <button
                        onClick={() => navigate(-1)} // Navigate to the previous page
                        className="btn border-0 d-flex flex-column align-items-center justify-content-center text-decoration-none dynamic-ts"
                        aria-label="Back"
                        title="Back"
                    >
                        <i className="bi bi-arrow-left text-white me-2"></i>
                        <span className="text-white dynamic-ss">Back</span>
                    </button>
                </li>

                {/* Play button to play content */}
                {mediaURL && (
                    <li className="nav-item text-center mx-auto">
                        <button
                            onClick={() => openPlayer(mediaURL)}
                            disabled={isLaunching}
                            className="btn border-0 d-flex flex-column align-items-center justify-content-center text-decoration-none dynamic-ts"
                            aria-label="Play"
                            title="Play"
                        >
                            {isLaunching ? (
                                <span className="spinner-border spinner-border-sm text-light" />
                            ) : (
                                <i className="bi bi-play-fill theme-color me-2"></i>
                            )}

                            <span className="text-white dynamic-ss">Play</span>
                        </button>
                    </li>
                )}
            </ul>
        </div>
    );
}

export default PlayGroundFooter;