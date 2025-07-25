// ReCaptcha.js
import { useState, useEffect } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useReCaptcha } from '../../hooks/PlayGroundPage/useReCaptcha';
import ErrorModal from '../../utils/ErrorModal';
import Alert from '../../utils/Alert';

import { setStorageValue } from '../../utils/localStorageStates';

const RECAPTCHA_SITE_KEY = process.env.REACT_APP_RECAPTCHA_SITE_KEY;

const ReCaptcha = ({ storagePath }) => {
    const { validateCaptcha, error: isError } = useReCaptcha();

    const [showErrorModal, setShowErrorModal] = useState(false);
    const [alert, setAlert] = useState({ message: '', type: '', key: '' });

    useEffect(() => {
        if (isError) {
            setShowErrorModal(true);
        } else {
            setShowErrorModal(false);
        }
    }, [isError]);

    const handleCaptchaSuccess = async (token) => {
        const isValid = await validateCaptcha(token);

        if (isValid) {
            setStorageValue(...storagePath, 'recaptchaVerified', true);
            window.location.reload();
        } else {
            setAlert({
                message: 'Verification failed. Please try again.',
                type: 'danger',
                key: 'recaptcha-failed',
            });

            setTimeout(() => {
                setAlert((prev) => (prev.key === 'recaptcha-failed' ? { message: '', type: '', key: '' } : prev));
            }, 5000);
        }
    };

    const handleAlertDismiss = () => {
        setAlert({ message: '', type: '', key: '' });
    };

    return (
        <>
            {/* Backspace & reCAPTCHA*/}
            <div className="divider" style={{ height: '6rem' }}></div>

            <div className="d-flex flex-column justify-content-center align-items-center text-white">
                <div className="container">
                    <div className="d-flex flex-column justify-content-center align-items-center p-2">
                        <p className="dynamic-hs fw-bold">Verify that you are human</p>
                        <p className="dynamic-fs">Verification is required to unlock media content.</p>
                        <ReCAPTCHA
                            sitekey={RECAPTCHA_SITE_KEY}
                            onChange={handleCaptchaSuccess}
                            theme="dark"
                        />
                        <div className="text-left mt-4">
                            <ul className="dynamic-fs text-white">
                                <li>reCAPTCHA is required only once per login session.</li>
                                <li>Your verification ensures secure access to media content.</li>
                                <li>Your session will remain verified until you sign out or clear your browser data.</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Error Modal */}
            {showErrorModal && <ErrorModal error={isError} />}

            {/* Alert Message */}
            {alert.message && (
                <Alert message={alert.message} onClose={handleAlertDismiss} type={alert.type} />
            )}
        </>
    );
}

export default ReCaptcha;