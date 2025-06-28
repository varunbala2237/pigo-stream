// ReCaptchaGrid.js
import ReCAPTCHA from 'react-google-recaptcha';

import { setStorageValue } from '../../utils/localStorageStates';

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

function ReCaptchaGrid({ storagePath }) {
    const handleCaptchaSuccess = (token) => {
        if (token) {
            setStorageValue(...storagePath, 'recaptchaVerified', true);
            // Refresh the page
            window.location.reload();
        }
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-white">
            <div className="container text-center">
                <span className="dynamic-hs">Please complete reCAPTCHA to continue</span>
                <p className="dynamic-fs">Verification is required to unlock media content.</p>

                <div className="d-flex justify-content-center">
                    <ReCAPTCHA
                        sitekey={RECAPTCHA_SITE_KEY}
                        onChange={handleCaptchaSuccess}
                        theme="dark"
                    />
                </div>
            </div>
        </div>
    );
}

export default ReCaptchaGrid;