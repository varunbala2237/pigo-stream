// IndexFooter.js
import React from 'react';

const Footer = () => {
  return (
    <div className="footer text-center text-white p-3">      
      <div className="d-flex justify-content-center align-items-center">
          <button className="btn btn-light btn-sm rounded-pill rounded-circle">
            <a
              href="https://t.me/pigostream"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary text-decoration-none"
            >
              <span className="text-black">Contact us on </span>
              <i className="bi bi-telegram"></i>
            </a>
          </button>
      </div>
    </div>
  );
};

export default Footer;