import React, { useState, useEffect } from 'react';
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

  const getNavLinkClass = (path) => 
    location.pathname === path 
      ? "nav-link bd-callout-primary"
      : "nav-link";
  

  return (
    <>
      {/* Top Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark custom-theme-radius poppins-medium">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <img className="mr-3" src="favicon.ico" alt="PigoStream" width="40" height="40" />
            <span className="mb-0 dynamic-hs"><b>Pigo</b>Stream</span>
          </a>

          <button className="btn btn-dark bd-callout-dark text-white" onClick={() => setSidebarOpen(true)}>
            <i className="bi bi-list"></i> {/* Sidebar Open Button */}
          </button>
        </div>
      </nav>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`} onClick={() => setSidebarOpen(false)}></div>

      {/* Sidebar */}
      <div className={`sidebar d-flex flex-column bd-callout-dark text-white ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header d-flex justify-content-end">
          <button className="btn btn-dark bd-callout-dark text-white" onClick={() => setSidebarOpen(false)}>
            <i className="bi bi-x-lg"></i> {/* Sidebar Close Button */}
          </button>
        </div>

        {/* User Profile Section */}
        <div className="text-center mb-2">
          <img 
            src={userPhotoURL} 
            alt="User" 
            className="rounded-circle"
            style={{
              width : "70px",
              height: "70px",
            }}
          />
          <div className="text-wrap text-truncate dynamic-fs text-white">{userName}</div>
          <div className="text-wrap text-truncate dynamic-fs text-secondary" contentEditable={false}>{userEmail}</div>
        </div>

        {/* Navigation Section */}
        <ul className="navbar-nav my-2 flex-column dynamic-ss text-center custom-theme-radius overflow-hidden gap-1">
          <li className="nav-item">
            <a className={`btn btn-dark rounded-pill ${getNavLinkClass("/index")}`} href="/index">
              <i className="bi bi-house"></i> Home
            </a>
          </li>
          <li className="nav-item">
            <a className={`btn btn-dark rounded-pill ${getNavLinkClass("/my-list")}`} href="/my-list">
              <i className="bi bi-bookmark"></i> My List
            </a>
          </li>
          <li className="nav-item">
            <a className={`btn btn-dark rounded-pill ${getNavLinkClass("/watch-history")}`} href="/watch-history">
              <i className="bi bi-clock"></i> Watch History
            </a>
          </li>
        </ul>

        {/* Sign Out Button */}
        <div className="d-flex mt-auto justify-content-center align-items-center gap-4">
          <button className="btn btn-md d-none d-md-inline-block rounded-pill btn-danger" onClick={signOutWithAccount}>
            <i className="bi bi-box-arrow-left"></i> Sign Out
          </button>
          <button className="btn btn-sm d-md-none rounded-pill btn-danger" onClick={signOutWithAccount}>
            <i className="bi bi-box-arrow-left"></i> Sign Out
          </button>
          {/* Telegram Button */}
          <a
            href="https://t.me/pigostream"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-circle d-flex justify-content-center align-items-center"
            style={{ width: '20px', height: '20px' }} // Ensures a perfect circle
          >
            <i className="bi bi-telegram fs-2 theme-color"></i>
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
    </>
  );
}

export default Header;