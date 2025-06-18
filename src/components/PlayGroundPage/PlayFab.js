// PlayFab.js
import { useState } from 'react';
import useAppVersion from '../../hooks/PigoStorePage/useAppVersion';
import useSaveWatchHistory from '../../hooks/WatchHistoryPage/useSaveWatchHistory';
import { useNavigate } from 'react-router-dom';

function PlayFab({ id, type, mediaURL }) {
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
        <button
            onClick={() => openPlayer(mediaURL)}
            className="btn btn-dark bd-callout-dark d-flex justify-content-center align-items-center rounded-pill dynamic-fs shadow"
            style={{
                position: 'fixed',
                bottom: '1rem',
                right: '1rem',
                zIndex: 1020,
            }}
            aria-label="Play"
            title="Play"
        >
            <i className="bi bi-play-fill theme-color me-2"></i>
            <b>Pigo</b>Player
        </button>
    );
}

export default PlayFab;