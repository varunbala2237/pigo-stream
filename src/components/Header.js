// Header.js
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { auth, signOutWithAccount } from "../firebase/firebase-auth";

import './Header.css';

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState('');
  const [userPhotoURL, setUserPhotoURL] = useState('');
  const [userName, setUserName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const defaultPhotoURL = 'https://cdn-icons-png.flaticon.com/512/149/149071.png';

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (user.displayName == null) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          await user.reload();
        }
        setUserEmail(user.email);
        setUserPhotoURL(user.providerData[0].photoURL || defaultPhotoURL);
        setUserName(user.displayName || 'User');
      } else {
        setUserEmail('');
        setUserPhotoURL(defaultPhotoURL);
        setUserName('');
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark custom-theme-radius-low">
        <div className="container-fluid">
          <div className="d-flex align-items-center gap-2">
            <div className="navbar-brand rounded-pill d-flex align-items-center">
              {/* Sidebar Open Button & Icon */}
              <div className="d-flex align-items-center custom-bg rounded-pill shadow me-2 ps-1">
                <button
                  className="btn btn-dark bd-callout-dark border-0 rounded-circle text-white shadow py-2"
                  onClick={() => setSidebarOpen(true)}
                >
                  <i className="bi bi-three-dots-vertical"></i> {/* Sidebar Open Button */}
                </button>
                <a href="/"><img src="favicon.ico" alt="PigoStream" width="48" height="48" /></a>
              </div>
              <span className="mb-0 dynamic-hs"><b>Pigo</b>Stream</span>
            </div>
          </div>

          {location.pathname === "/play" && (
            <>
              {/* Back button with navigation for small screens */}
              <button
                type="button"
                className="btn btn-dark bd-callout-dark border-0 btn-sm d-md-none text-white rounded-pill dynamic-fs"
                onClick={() => navigate(-1)} // Navigate to the previous page
              >
                <i className="bi bi-back me-2"></i>
                Back
              </button>
              {/* Back button with navigation for large screens */}
              <button
                type="button"
                className="btn btn-dark bd-callout-dark border-0 btn-md d-none d-md-inline-block text-white rounded-pill dynamic-fs"
                onClick={() => navigate(-1)} // Navigate to the previous page
              >
                <i className="bi bi-back me-2"></i>
                Back
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div className={`sidebar-backdrop ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)}></div>

      {/* Sidebar */}
      <div className={`sidebar d-flex flex-column bd-callout-dark text-white ${sidebarOpen ? "open" : ""}`} style={{ height: '100vh' }}>
        <div>
          {/* Close Button */}
          <div className="sidebar-header d-flex justify-content-end">
            <button className="btn btn-dark bd-callout-dark border-0 rounded-circle text-white shadow py-2" onClick={() => setSidebarOpen(false)}>
              <i className="bi bi-x-lg"></i>
            </button>
          </div>

          {/* User Info */}
          <div className="text-center text-white mb-2">
            <img
              src={userPhotoURL}
              alt="User"
              className="rounded-circle"
              style={{ width: "70px", height: "70px" }}
            />
            <div className="text-wrap text-truncate dynamic-ts">{userName}</div>
            <div className="text-wrap text-truncate dynamic-fs" contentEditable={false}>{userEmail}</div>
          </div>
        </div>

        <div className="mt-auto d-flex flex-column align-items-center custom-gap pb-3">
          <button className="btn btn-md rounded-pill btn-danger" onClick={signOutWithAccount}>
            <i className="bi bi-box-arrow-left"></i> Sign Out
          </button>

          <div className="d-flex gap-4">
            <a href="https://t.me/pigostream" target="_blank" rel="noopener noreferrer" className="d-flex justify-content-center">
              <i className="bi bi-telegram fs-2 text-secondary"></i>
            </a>
            <a href="https://github.com/varunbala2237/pigo-stream" target="_blank" rel="noopener noreferrer" className="d-flex justify-content-center">
              <i className="bi bi-github fs-2 text-secondary"></i>
            </a>
          </div>

          <p className="text-secondary dynamic-ss">Follow us for updates</p>
        </div>
      </div>
    </>
  );
}

export default Header;