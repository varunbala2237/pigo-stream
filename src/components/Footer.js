// IndexFooter.js
import React from 'react';

const Footer = () => {
  return (
    <div className="footer text-center text-white custom-w-size-90 m-4">      
      <div className="d-flex justify-content-center align-items-center">
        <div className="rounded-pill bg-white text-black px-2">
          <small className="me-2">Contact us on</small>
          <button className="btn m-0 py-0 px-1 rounded-circle">
            <a
              href="https://t.me/pigostream"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-decoration-none"
            >
              <i className="bi bi-telegram"></i>
            </a>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;