// ErrorModal.js
import { useRef } from 'react';
import './ErrorModal.css';

const ErrorModal = ({ error }) => {
  // Ref to track outside clicks
  const modalRef = useRef();

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Error Modal */}
      <div className="modal fade zoom-in-out show d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered mx-auto border-0 modal-pad">
          <div ref={modalRef} className="modal-content dynamic-fs bd-callout-dark custom-theme-radius-low text-white border-0">
            <div className="modal-body justify-content-center text-center border-0">
              <i className="bi bi-x-circle text-danger dynamic-hs"></i>
              <p className="mt-2 dynamic-fs">{error || 'Oops! something went wrong.'}</p>
              <button
                className="btn btn-primary border-0 rounded-pill btn-md d-none d-md-inline-block mt-3"
                onClick={() => window.location.reload()}
              >
                <i className="bi bi-arrow-clockwise me-2" />
                Retry
              </button>
              <button
                className="btn btn-primary border-0 rounded-pill btn-sm d-md-none mt-3 px-3"
                onClick={() => window.location.reload()}
              >
                <i className="bi bi-arrow-clockwise me-2" />
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorModal;