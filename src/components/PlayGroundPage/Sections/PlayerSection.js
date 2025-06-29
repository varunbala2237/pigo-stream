// PlayerSection.js
import { useRef } from 'react';
import useFetchStream from '../../../hooks/PlayGroundPage/useFetchStream';
import useLoadStream from '../../../hooks/PlayGroundPage/useLoadStream';
import './PlayerSection.css';

function PlayerSection({ depsReady, selectedServer }) {
    const videoRef = useRef(null);

    // Fetch stream from selectedServer
    const { stream, loading: loadingStream, error } = useFetchStream(selectedServer, depsReady);

    // Load stream from hook
    useLoadStream({ videoRef, stream, depsReady });

    const shouldOverlay = loadingStream || error;

    return (
        <div className="d-flex justify-content-center w-100">
            <div className="d-flex justify-content-center custom-bg custom-theme-radius-low p-2 player-container">
                <div className="position-relative custom-theme-radius-low player">
                    {shouldOverlay && (
                        <div className="stream-overlay d-flex flex-column justify-content-center align-items-center custom-theme-radius-low text-center text-white">
                            {!error ? (
                                <>
                                    <div className="spinner-border mb-2" role="status" />
                                    <span className="dynamic-fs">Fetching stream...</span>
                                </>
                            ) : (
                                <>
                                    <span className="dynamic-fs">{error}</span>
                                </>
                            )}
                        </div>
                    )}
                    <video
                        ref={videoRef}
                        className="w-100 h-100 custom-theme-radius-low"
                        controls
                        autoPlay
                    />
                </div>
            </div>
        </div>
    );
}

export default PlayerSection;