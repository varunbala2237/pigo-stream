// Footer.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css'; // Minimal, optional

const Footer = ({ showSearchBar = null, handleSearchBar = null }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/index', name: 'Home', icon: 'bi-house' },
    { path: '/my-list', name: 'My List', icon: 'bi-bookmark-fill' },
    { path: '/watch-history', name: 'Watch History', icon: 'bi-clock' },
  ];

  return (
    <div className="footer-fixed bd-callout-dark rounded-pill shadow">
      <ul className="nav h-100 gap-2 flex-nowrap overflow-auto justify-content-between align-items-center dynamic-fs">
        {navItems.map((item, index) => {
          const isActive = currentPath === item.path;
          return (
            <li key={index} className={`nav-item rounded-pill ${isActive ? 'bg-white fw-bold active' : ''}`}>
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center theme-color`}
              >
                <i className={`bi ${item.icon} dynamic-ts`}></i>
                {isActive && <span className="ms-2 text-black">{item.name}</span>}
              </Link>
            </li>
          );
        })}

        {showSearchBar !== null && (
          <li className="nav-item rounded-pill">
            <button className="btn btn-dark search-bar-btn theme-bg border-0 rounded-circle" onClick={handleSearchBar}>
              {showSearchBar ? <i className="bi bi-x-lg"></i> : <i className="bi bi-search"></i>}
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Footer;