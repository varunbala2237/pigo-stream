// PlayGroundFooter.js
import { useNavigate } from 'react-router-dom';
import '../Footer.css';

function PlayGroundFooter({ id, type }) {
    const navigate = useNavigate();

    return (
        <div className="footer-fixed bd-callout-dark w-100 position-fixed bottom-0 shadow">
            <ul className="nav h-100 w-100 d-flex justify-content-between align-items-center dynamic-fs">

                {/* Back button with navigation */}
                <li className="nav-item text-center mx-auto">
                    <button
                        onClick={() => navigate(-1)} // Navigate to the previous page
                        className="btn border-0 d-flex flex-column align-items-center justify-content-center text-decoration-none dynamic-ts"
                        aria-label="Back"
                        title="Back"
                    >
                        <i className="bi bi-arrow-left text-white me-2"></i>
                        <span className="text-white dynamic-ss">Back</span>
                    </button>
                </li>
            </ul>
        </div>
    );
}

export default PlayGroundFooter;