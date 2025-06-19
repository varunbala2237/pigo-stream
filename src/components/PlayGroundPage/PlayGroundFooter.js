// PlayGroundFooter.js
import { useState } from 'react';
import useAppVersion from '../../hooks/PigoStorePage/useAppVersion';
import useSaveWatchHistory from '../../hooks/WatchHistoryPage/useSaveWatchHistory';
import { useNavigate } from 'react-router-dom';
import '../Footer.css';

function PlayGroundFooter({ id, type, mediaURL }) {
    const [inHistory, setInHistory] = useState(false);
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

    const openPlayer = async (serverLink) => {
        try {
            if (!inHistory) {
                setInHistory(true);
                await addToHistory(id, type);
            }

            let appURL;
            if (platform === 'windows' || platform === 'android') {
                appURL = `pigoplayer://open?url=${encodeURIComponent(serverLink)}&version=${appVersion}`;

                let didBlur = false;

                const timeout = setTimeout(() => {
                    if (!didBlur) {
                        redirectToStore();
                    }
                }, 2000); // 2-second timeout

                window.location.href = appURL;

                window.addEventListener(
                    'blur',
                    () => {
                        didBlur = true;
                        clearTimeout(timeout);
                    },
                    { once: true }
                );
            } else {
                redirectToStore();
            }
        } catch (error) {
            console.error('Error opening app:', error);
        }
    };

    const redirectToStore = () => {
        navigate('/pigostore');
    };

    return (
        <div className="footer-fixed bd-callout-dark w-100 position-fixed bottom-0 shadow">
            <ul className="nav h-100 w-100 d-flex justify-content-between align-items-center dynamic-fs">

                <li className="nav-item text-center mx-auto">
                    <button
                        onClick={() => openPlayer(mediaURL)}
                        className="btn border-0 d-flex flex-column align-items-center justify-content-center text-decoration-none dynamic-ts"
                        aria-label="Play"
                        title="Play"
                    >
                        <i className="bi bi-play-fill theme-color me-2"></i>
                        <span className="text-white dynamic-ss">Play in <b>Pigo</b>Player</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default PlayGroundFooter;