// Footer.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Footer.css'; // Minimal, optional

const Footer = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/index', name: 'Home', icon: 'bi-house' },
    { path: '/my-list', name: 'My List', icon: 'bi-bookmark-fill' },
    { path: '/watch-history', name: 'Watch History', icon: 'bi-clock' },
  ];

  return (
    <div className="footer-fixed bd-callout-dark rounded-pill shadow p-2">
      <ul className="nav flex-nowrap overflow-auto w-100 justify-content-between align-items-center dynamic-fs">
        {navItems.map((item, index) => {
          const isActive = currentPath === item.path;
          return (
            <li key={index} className="nav-item">
              <Link
                to={item.path}
                className={`nav-link d-flex align-items-center ${isActive ? 'theme-color fw-bold active' : 'text-secondary'}`}
              >
                <i className={`bi ${item.icon} dynamic-ts`}></i>
                {isActive && <span className="ms-2 text-white">{item.name}</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Footer;