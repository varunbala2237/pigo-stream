// OverlaySpinner.js
import React, { useEffect } from 'react';
import './OverlaySpinner.css'; // Import the CSS

const OverlaySpinner = ({ visible }) => {
    useEffect(() => {
        if (visible) {
            document.body.style.overflow = 'hidden'; // Lock the scroll
        } else {
           document.body.style.overflow = 'auto'; // Unlock the scroll 
        }

        return () => {
            document.body.style.overflow = 'auto'; // Unlock the scroll
        };
    }, [visible]);

    if (!visible) return null;

    return (
        <div className="overlay-spinner">
            <div className="spinner-border theme-color spinner-size-3" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
        </div>
    );
};

export default OverlaySpinner;