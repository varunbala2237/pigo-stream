// PlayerSection.js
import React from "react";

function PlayerSection() {
    return (
        <div className="d-flex flex-column custom-bg custom-theme-radius-low w-100 p-2">
            <div className="d-flex flex-column align-items-center justify-content-center w-100">
                <div
                    className="position-relative bg-callout-dark custom-theme-radius-low w-100"
                    style={{
                        maxWidth: '768px',
                        aspectRatio: '16 / 9',
                    }}
                >
                    <video
                        className="w-100 h-100 bd-callout-dark"
                        controls
                        autoPlay
                        src="https://www.w3schools.com/html/mov_bbb.mp4"
                        style={{
                            objectFit: 'contain',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default PlayerSection;