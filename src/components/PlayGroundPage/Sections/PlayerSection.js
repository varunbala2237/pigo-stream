// PlayerSection.js
import ReactPlayer from 'react-player';
import './PlayerSection.css';

function PlayerSection() {

    return (
        <div className="d-flex justify-content-center w-100 mt-2">
            <div className="custom-bg custom-theme-radius-low p-2 player-container">
                <div className="position-relative">
                    <ReactPlayer
                        className="react-player"
                        url="https://www.w3schools.com/html/mov_bbb.mp4"
                        width="100%"
                        height="100%"
                        controls
                        playing
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