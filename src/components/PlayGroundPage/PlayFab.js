// PlayFab.js
import { useState } from 'react';
import useAppVersion from '../../hooks/PigoStorePage/useAppVersion';
import useSaveWatchHistory from '../../hooks/WatchHistoryPage/useSaveWatchHistory';
import openIframeWindow from "../IframePage/openIframeWindow";
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

    // Add the Media to Watch History
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

    const redirectToStore = () => {
        navigate('/pigostore');
    };

    return (
        <button
            onClick={() => openPlayer(mediaURL)}
            className="btn btn-dark bd-callout-dark justify-content-center align-items-center rounded-circle shadow"
            style={{
                position: 'fixed',
                bottom: '1rem',
                right: '1rem',
                zIndex: 1020,
            }}
            aria-label="Play"
            title="Play"
        >
            <i className="bi bi-play-fill fs-4 theme-color"></i>
        </button>
    );
}

export default PlayFab;