// IndexFooter.js
import React from 'react';

const Footer = () => {
  return (
    <div className="footer text-center text-white bd-callout-dark bottom-0 poppins-medium">    
      <div className="container p-4 justify-content-center align-items-center text-secondary">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <div className="d-flex justify-content-between gap-5 mb-3">
            {/* Telegram Button */}
            <a
              href="https://t.me/pigostream"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: '20px', height: '20px' }} // Ensures a perfect circle
            >
              <i className="bi bi-telegram fs-2 text-primary"></i>
            </a>

            {/* GitHub Button */}
            <a
              href="https://github.com/varunbala2237/pigo-stream"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black rounded-circle d-flex justify-content-center align-items-center"
              style={{ width: '20px', height: '20px' }} // Ensures a perfect circle
            >
              <i className="bi bi-github fs-2 text-white"></i>
            </a>
          </div>
        </div>
        <small>
          This site does not store any files on the server, we only link to media hosted on 3rd party services.
        </small>
      </div>
    </div>
  );
};

export default Footer;