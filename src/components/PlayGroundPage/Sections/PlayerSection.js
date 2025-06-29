// PlayerSection.js
import './PlayerSection.css';

function PlayerSection() {

    return (
        <div className="d-flex justify-content-center w-100 mt-2">
            <div className="custom-bg custom-theme-radius-low p-2 player-container">
                <div className="position-relative bg-callout-dark custom-theme-radius-low player">
                    <video
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