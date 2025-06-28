// OverlaySpinner.js
import './OverlaySpinner.css'; // Import the CSS

const OverlaySpinner = ({ visible }) => {
    if (!visible) return null;

    return (
        <div className="overlay-spinner d-flex flex-column">
            <div className="spinner-border theme-color spinner-size-3 mb-2" role="status">
                <span className="visually-hidden">Loading...</span>
            </div>
            <div className="text-white">
                Please wait...
            </div>
        </div>
    );
};

export default OverlaySpinner;