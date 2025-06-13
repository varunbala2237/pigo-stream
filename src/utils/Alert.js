// Alert.js
const Alert = ({ message, onClose, type }) => {
  const alertType = type || 'danger';
  return (
    <div 
      className={`alert position-fixed bd-callout-${alertType} custom-theme-radius-low fade show fixed-bottom p-2 mx-3`} role="alert"
    >
      <div className="d-flex justify-content-between align-items-center text-white">
        <span className="ps-2"><i className="bi bi-exclamation-circle me-2"></i>{message}</span>
        <button type="button" className="btn btn-transparent border-0" onClick={onClose}><i className="bi bi-x-lg text-white"></i></button>
      </div>
    </div>
  );
};

export default Alert;