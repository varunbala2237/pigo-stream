// Footer.js
import { Link, useLocation } from 'react-router-dom';
import './Footer.css';

const Footer = ({ showSearchBar = null, handleSearchBar = null }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const navItems = [
    { path: '/index', name: 'Home', icon: 'bi-house' },
    { path: '/my-list', name: 'My List', icon: 'bi-bookmark-fill' },
    { path: '/watch-history', name: 'Watch History', icon: 'bi-clock-history' },
  ];

  return (
    <div className="footer-fixed bd-callout-dark w-100 position-fixed bottom-0 shadow">
      <ul className="nav h-100 flex-nowrap overflow-auto justify-content-evenly align-items-center px-2 dynamic-fs">
        {navItems.map((item, index) => {
          const isActive = currentPath === item.path;
          return (
            <li key={index} className="nav-item px-2 text-center">
              <Link
                to={item.path}
                className="nav-link d-flex flex-column align-items-center text-decoration-none"
              >
                <i className={`bi ${item.icon} ${isActive ? 'theme-color' : 'text-secondary'}`}></i>
                <span className={`dynamic-ss ${isActive ? 'text-white' : 'text-secondary'}`}>{item.name}</span>
              </Link>
            </li>
          );
        })}

        {showSearchBar !== null && (
          <li className="nav-item px-2 text-center">
            <button
              className={`btn border-0 d-flex flex-column align-items-center justify-content-center text-decoration-none`}
              style={{ width: '3rem', height: '3rem' }}
              onClick={handleSearchBar}
            >
              <i className={`bi ${showSearchBar ? 'bi-x-lg theme-color' : 'bi-search text-secondary'}`}></i>
              <span className={`dynamic-ss ${showSearchBar ? 'text-white' : 'text-secondary'}`}>{showSearchBar ? 'Close' : 'Search'}</span>
            </button>
          </li>
        )}
      </ul>
    </div>
  );
};

export default Footer;