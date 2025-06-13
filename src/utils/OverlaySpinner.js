// OverlaySpinner.js
import './OverlaySpinner.css'; // Import the CSS

const OverlaySpinner = ({ visible }) => {
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