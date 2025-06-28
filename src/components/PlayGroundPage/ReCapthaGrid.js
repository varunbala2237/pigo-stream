// ReCapthaGrid.js
import React from 'react';

function ReCaptchaGrid() {
    return (
        <div className="d-flex flex-column justify-content-center align-items-center p-0">
            <div className="flex-row text-white w-100">
                <div className="container">
                    <h2>Please complete reCAPTCHA to continue</h2>
                    {/* Replace this with actual reCAPTCHA integration */}
                    <p>reCAPTCHA verification required to unlock content.</p>
                </div>
            </div>
        </div>
    );
}

export default ReCaptchaGrid;