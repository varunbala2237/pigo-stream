// IndexFooter.js
import React from 'react';

const Footer = () => {
  return (
    <div className="footer text-center text-white bd-callout-dark bottom-0 poppins-medium">    
      <div className="container p-2 justify-content-center align-items-center text-secondary">
        <div className="d-flex flex-column justify-content-center align-items-center">
          <span className="dynamic-fs">This site does not store any files on the server, we only linked to the media which is hosted on 3rd party services.</span>
          <div className="d-flex justify-content-between p-4">
              <div className="d-flex text-start flex-column align-items-center me-4">
                <span className="dynamic-fs">Contact us on</span>
                <a
                  href="https://t.me/pigostream"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary text-decoration-none dynamic-ts"
                >
                  <i className="bi bi-telegram"></i>
                </a>
              </div>
              <div className="d-flex text-end flex-column align-items-center">
              <span className="dynamic-fs">Source code</span>
                <a
                  href="https://github.com/varunbala2237/pigo-stream"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-secondary text-decoration-none dynamic-ts"
                >
                  <i className="bi bi-github"></i>
                </a>
              </div>
          </div>
          <small className="dynamic-ss">© {new Date().getFullYear()} PigoStream. All rights reserved.</small>
        </div>
      </div>
    </div>
  );
};

export default Footer;