// PlayerSection.js
import { useRef } from 'react';
import useFetchStream from '../../../hooks/PlayGroundPage/useFetchStream';
import useLoadStream from '../../../hooks/PlayGroundPage/useLoadStream';
import './PlayerSection.css';

function PlayerSection({ type, mediaInfo, selectedSeason, selectedEpisode, depsReady, selectedServer }) {
    const videoRef = useRef(null);
    const title = mediaInfo?.title || mediaInfo?.name;

    // Fetch stream from selectedServer
    const { stream, loading: loadingStream } = useFetchStream(selectedServer, depsReady);

    // Load stream from hook
    useLoadStream({ videoRef, stream, depsReady });

    return (
        <div className="d-flex justify-content-center w-100">
            <div className="custom-bg custom-theme-radius-low p-2 player-container">
                <div className="d-flex flex-row justify-content-between mb-2">
                    <div className="text-start">
                        <span className="text-wrap fw-bold dynamic-ts">{title}</span>
                    </div>
                    <div className="text-end">
                        {type === "tv" ? (
                            <span className="text-wrap dynamic-ts">S{selectedSeason} - E{selectedEpisode}</span>
                        ) : type === "anime" ? (
                            <span className="text-wrap dynamic-ts">R{selectedSeason} - E{selectedEpisode}</span>
                        ) : null}
                    </div>
                </div>
                <div
                    className="position-relative bg-callout-dark custom-theme-radius-low player"
                >
                    <video
                        ref={videoRef}
                        className="w-100 h-100 bd-callout-dark custom-theme-radius-low"
                        controls
                        autoPlay
                        style={{
                            aspectRatio: '16 / 9',
                            objectFit: 'contain',
                            display: 'block',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default PlayerSection;