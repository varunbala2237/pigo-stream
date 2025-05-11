import './ConnectionModal.css';

function ConnectionModal({ show }) {
  return (
    <>
      {/* Backdrop */}
      {show && <div className="modal-backdrop fade show"></div>}

      {/* Connection Error Modal */}
      {show && (
        <div className="modal fade zoom-in-out show d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered mx-auto border-0 modal-pad">
            <div className="modal-content dynamic-fs bd-callout-dark custom-theme-radius text-white border-0">
              <div className="modal-body justify-content-center text-center border-0">
                <i className="bi bi-ban text-danger connection-icon"></i>
                <p className="mt-3 dynamic-fs">Server is not responding</p>
                <button
                  className="btn btn-primary border-0 rounded-pill btn-md d-none d-md-inline-block mt-3"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
                <button
                  className="btn btn-primary border-0 rounded-pill btn-sm d-md-none mt-3"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default ConnectionModal;