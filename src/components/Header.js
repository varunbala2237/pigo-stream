import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { auth, signOutWithAccount } from "../firebase/firebase-auth";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userEmail, setUserEmail] = useState('');
  const [userPhotoURL, setUserPhotoURL] = useState('');
  const [userName, setUserName] = useState('');
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

  // Determine the active link based on the current location
  const getNavLinkClass = (path) => {
    return location.pathname === path ? 'nav-link active' : 'nav-link';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark w-100 custom-theme-radius poppins-medium">
      <div className="container-fluid">
        <a className="navbar-brand d-flex align-items-center" href="/">
          <img
            className="mr-3"
            src="favicon.ico"
            alt="PigoStream"
            width="40"
            height="40"
          />
          <span className="mb-0 dynamic-hs"><b>Pigo</b>Stream</span>
        </a>
        <button
          className="navbar-toggler"
        >
          <span
            className="navbar-toggler-icon"
            type="button"
            data-bs-toggle="modal"
            data-bs-target="#navItemsModal"
            aria-label="Toggle navigation"
            title="Navigate"></span>
          <span>
          <button
              className="btn p-0 text-secondary"
              id="userDropdown"
              data-bs-toggle="modal"
              data-bs-target="#accountModal"
              aria-label="Toggle account menu"
              style={{ background: 'none', border: 'none' }}
              title="Account"
            >
              <img
                src={userPhotoURL}
                alt="User"
                className="rounded-circle ms-2"
                style={{ width: '40px', height: '40px' }}
              />
            </button>
          </span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0 text-center">
            <li className="nav-item">
              <a className={getNavLinkClass("/index")} href="/index">
                <i className="bi bi-house me-1"></i>
                Home
              </a>
            </li>
            <li><hr className="text-secondary" /></li>
            <li className="nav-item">
              <a className={getNavLinkClass("/my-list")} href="/my-list">
                <i className="bi bi-plus-lg me-1"></i>
                Watchlist
              </a>
            </li>
            <li><hr className="text-secondary" /></li>
            <li className="nav-item">
              <a className={getNavLinkClass("/watch-history")} href="/watch-history">
                <i className="bi bi-clock me-1"></i>
                History
              </a>
            </li>
          </ul>
          <div className="d-flex d-none d-lg-block align-items-center ms-auto">
            <button
              className="btn p-0 text-secondary"
              id="userDropdown"
              data-bs-toggle="modal"
              data-bs-target="#accountModal"
              aria-label="Toggle account menu"
              style={{ background: 'none', border: 'none' }}
              title="Account"
            >
              <img
                src={userPhotoURL}
                alt="User"
                className="rounded-circle ms-2"
                style={{ width: '40px', height: '40px' }}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Modal for mobile navbar items */}
      <div className="modal fade" id="navItemsModal" tabIndex="-1" aria-labelledby="navItemsModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered mx-auto border-0 m-0 modal-pad">
          <div className="modal-content dynamic-fs bd-callout-dark custom-theme-radius text-white p-0 border-0">
            <div className="modal-body text-center p-0">
              <ul className="navbar-nav">
                <li className="nav-item m-1">
                  <a className={getNavLinkClass("/index")} href="/index">
                    <i className="bi bi-house me-1"></i> Home
                  </a>
                </li>
                <li><hr className="text-secondary m-0" /></li>
                <li className="nav-item m-1">
                  <a className={getNavLinkClass("/my-list")} href="/my-list">
                    <i className="bi bi-plus-lg me-1"></i> Watchlist
                  </a>
                </li>
                <li><hr className="text-secondary m-0" /></li>
                <li className="nav-item m-1">
                  <a className={getNavLinkClass("/watch-history")} href="/watch-history">
                    <i className="bi bi-clock me-1"></i> History
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Account Details Modal */}
      <div className="modal fade" id="accountModal" tabIndex="-1" aria-labelledby="accountModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered mx-auto border-0 m-0 modal-pad">
          <div className="modal-content dynamic-fs custom-theme-radius bd-callout-dark text-white border-0">
            <div className="modal-body text-center">
              <img
                src={userPhotoURL}
                alt="User"
                className="rounded-circle mb-2"
                style={{ width: '70px', height: '70px' }}
              />
              <div className="dynamic-ts">{userName}</div>
              <div className="dynamic-fs">{userEmail}<i className="bi bi-patch-check-fill text-primary ms-1"></i></div>
              <div className="dynamic-ss text-secondary">
                <i>
                  We prioritize the security and confidentiality of your personal data above all else. Please be assured that we do not access, store, or retrieve any information from your Google Account or its associated services, ensuring your privacy remains fully intact.
                </i>
              </div>
            </div>
            <div className="modal-footer p-0" style={{ borderTop: '1px solid #343a40' }}>
              <div className="d-flex justify-content-center w-100">
                <button
                  type="button"
                  className="btn border-0 btn-md d-none d-md-inline-block dynamic-fs w-100 m-1"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={signOutWithAccount}
                >
                  <i className="bi bi-box-arrow-left me-1 text-danger"></i>
                  <span className="text-danger">Sign out</span>
                </button>
                <button
                  type="button"
                  className="btn border-0 btn-sm d-md-none dynamic-fs w-100 m-1"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                  onClick={signOutWithAccount}
                >
                  <i className="bi bi-box-arrow-left me-1 text-danger"></i>
                  <span className="text-danger">Sign out</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header;