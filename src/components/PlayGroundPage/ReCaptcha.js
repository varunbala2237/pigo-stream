// ReCaptcha.js
import ReCAPTCHA from 'react-google-recaptcha';

import { setStorageValue } from '../../utils/localStorageStates';

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

function ReCaptcha({ storagePath }) {
    const handleCaptchaSuccess = (token) => {
        if (token) {
            setStorageValue(...storagePath, 'recaptchaVerified', true);
            // Refresh the page
            window.location.reload();
        }
    };

    return (
        <>
            {/* Backspace & reCAPTCHA*/}
            <div className="divider" style={{ height: '6rem' }}></div>

            <div className="d-flex flex-column justify-content-center align-items-center text-white">
                <div className="container">
                    <div className="d-flex flex-column justify-content-center align-items-center p-2">
                        <p className="dynamic-hs">Please complete reCAPTCHA to continue</p>
                        <p className="dynamic-fs">Verification is required to unlock media content.</p>
                        <ReCAPTCHA
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={handleCaptchaSuccess}
                            theme="dark"
                        />
                        <div className="text-left mt-5">
                            <ul className="dynamic-fs text-white">
                                <li>reCAPTCHA is required only once per login session.</li>
                                <li>Your verification ensures secure access to media content.</li>
                                <li>Your session will remain verified until you sign out or clear your browser data.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReCaptcha;