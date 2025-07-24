// Footer.js
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import './Footer.css';

import { setSessionValue, getSessionValue } from '../utils/sessionStorageStates';

const SESSION_PATH = ['Footer'];
const SESSION_KEY = 'previousPath';

const navItems = [
  { path: '/index', name: 'Home', icon: 'bi-house' },
  { path: '/search', name: 'Search', icon: 'bi-search' },
  { path: '/my-list', name: 'My List', icon: 'bi-bookmark-fill' },
  { path: '/watch-history', name: 'Watch History', icon: 'bi-clock-history' },
];

const Footer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentPath = location.pathname;

  const lastValidPathRef = useRef(null);

  // Initialize last known nav path (once)
  if (lastValidPathRef.current === null) {
    const matched = navItems.find(item => item.path === currentPath);
    if (matched) {
      lastValidPathRef.current = matched.path;
      setSessionValue(...SESSION_PATH, SESSION_KEY, matched.path);
    } else {
      lastValidPathRef.current = getSessionValue(...SESSION_PATH, SESSION_KEY) || '/index';
    }
  }

  // Update last valid path on route change
  useEffect(() => {
    const matched = navItems.find(item => item.path === currentPath);
    if (matched) {
      lastValidPathRef.current = matched.path;
      setSessionValue(...SESSION_PATH, SESSION_KEY, matched.path);
    }
  }, [currentPath]);

  const matched = navItems.find(item => item.path === currentPath);

  return (
    <div className="footer-fixed bd-callout-dark w-100 position-fixed bottom-0 shadow">
      <ul className="nav h-100 w-100 d-flex justify-content-between align-items-center">
        {matched ? (
          navItems.map((item, index) => {
            const isActive = currentPath === item.path;
            return (
              <li key={index} className="nav-item text-center mx-auto">
                <Link
                  to={item.path}
                  className="nav-link d-flex flex-column align-items-center text-decoration-none dynamic-ts"
                >
                  <i className={`bi ${item.icon} ${isActive ? 'theme-color' : 'text-secondary'}`}></i>
                  <span className={`dynamic-ss ${isActive ? 'text-white' : 'text-secondary'}`}>{item.name}</span>
                </Link>
              </li>
            );
          })
        ) : (
          <li className="nav-item text-center mx-auto">
            <button
              className="btn btn-link d-flex flex-column align-items-center text-decoration-none dynamic-ts text-white"
              onClick={() => navigate(lastValidPathRef.current || '/index')}
            >
              <i className="bi bi-arrow-left me-2"></i>
              Back
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Footer;