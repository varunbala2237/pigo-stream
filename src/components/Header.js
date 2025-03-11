import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { auth, signOutWithAccount } from "../firebase/firebase-auth";
import { Link } from "react-router-dom";

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
  
  const getNavLinkClass = (path) => 
    location.pathname === path 
      ? "btn btn-dark border-0 rounded-pill active" 
      : "btn border-0 rounded-pill";

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark custom-theme-radius">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img className="mr-3" src="favicon.ico" alt="PigoStream" width="40" height="40" />
            <span className="mb-0 dynamic-hs"><b>Pigo</b>Stream</span>
          </a>

          {/* Conditional Rendering */}
            {location.pathname === "/play" ? ( // Add more exceptions if needed
              <>
                {/* Back button with navigation for small screens */}
                <button 
                  type="button" 
                  className="btn btn-dark bd-callout-dark border-0 btn-sm d-md-none text-white rounded-pill dynamic-fs"
                  onClick={() => navigate(-1)} // Navigate to the previous page
                >
                  <i className="bi bi-chevron-left me-2"></i> 
                  Back
                </button>
                {/* Back button with navigation for large screens */}
                <button 
                  type="button" 
                  className="btn btn-dark bd-callout-dark border-0 btn-md d-none d-md-inline-block text-white rounded-pill dynamic-fs"
                  onClick={() => navigate(-1)} // Navigate to the previous page
                >
                  <i className="bi bi-chevron-left me-2"></i> 
                  Back
                </button>
              </>
            ) : (
              <>
                {/* Sidebar Open Button */}
                <button 
                  className="btn btn-dark bd-callout-dark border-0 text-white"  
                  onClick={() => setSidebarOpen(true)}
                >
                  <i className="bi bi-list"></i> {/* Sidebar Open Button */}
                </button>
              </>
            )}
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)}></div>

      {/* Sidebar */}
      <div className={`sidebar d-flex flex-column bd-callout-dark text-white ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header d-flex justify-content-end">
          <button className="btn btn-dark bd-callout-dark text-white border-0" onClick={() => setSidebarOpen(false)}>
            <i className="bi bi-x-lg"></i> {/* Sidebar Close Button */}
          </button>
        </div>

        {/* User Profile Section */}
        <div className="text-center text-white mb-2">
          <img 
            src={userPhotoURL} 
            alt="User" 
            className="rounded-circle"
            style={{
              width : "70px",
              height: "70px",
            }}
          />
          <div className="text-wrap text-truncate dynamic-ts">{userName}</div>
          <div className="text-wrap text-truncate dynamic-fs" contentEditable={false}>{userEmail}</div>
        </div>

        {/* Navigation Section */}
        <ul className="navbar-nav flex-column dynamic-fs flex-grow-1 justify-content-center custom-theme-radius gap-2">
          <li className="nav-item">
            <Link className={`text-white ${getNavLinkClass("/index")}`} to="/index" onClick={() => setSidebarOpen(false)}>
              <i className="bi bi-house theme-color"></i> Home
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`text-white ${getNavLinkClass("/my-list")}`} to="/my-list" onClick={() => setSidebarOpen(false)}>
              <i className="bi bi-bookmark theme-color"></i> My List
            </Link>
          </li>
          <li className="nav-item">
            <Link className={`text-white ${getNavLinkClass("/watch-history")}`} to="/watch-history" onClick={() => setSidebarOpen(false)}>
              <i className="bi bi-clock theme-color"></i> Watch History
            </Link>
          </li>
        </ul>

        {/* Sign Out + Social Icons (BOTTOM) */}
        <div className="d-flex flex-column align-items-center gap-3 pb-3">
          <button className="btn btn-md rounded-pill btn-danger" onClick={signOutWithAccount}>
            <i className="bi bi-box-arrow-left"></i> Sign Out
          </button>
    
          {/* Social Icons (GitHub + Telegram) */}
          <div className="d-flex gap-4">
            <a href="https://t.me/pigostream" target="_blank" rel="noopener noreferrer" 
              className="d-flex justify-content-center" 
            >
              <i className="bi bi-telegram fs-2 text-secondary"></i>
            </a>
      
            <a href="https://github.com/varunbala2237/pigo-stream" target="_blank" rel="noopener noreferrer" 
              className="d-flex justify-content-center" 
            >
              <i className="bi bi-github fs-2 text-secondary"></i>
            </a>
          </div>

          {/* Small Text Below Icons */}
          <p className="text-secondary" style={{ fontSize: "12px" }}>
            Follow us for updates
          </p>
        </div>
      </div>
    </>
  );
}

export default Header;