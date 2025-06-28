// PlayerSection.js
import './PlayerSection.css';

function PlayerSection({ type, mediaInfo, selectedSeason, selectedEpisode }) {
    const title = mediaInfo?.title || mediaInfo?.name;

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
                        className="w-100 h-100 bd-callout-dark"
                        controls
                        autoPlay
                        src="https://www.w3schools.com/html/mov_bbb.mp4"
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