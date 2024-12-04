// Alert.js
import React from 'react';

const Alert = ({ message, onClose, type }) => {
  const alertType = type || 'danger';
  return (
    <div className={`alert position-fixed bd-callout-${alertType} px-4 py-2 custom-theme-radius fade show fixed-bottom mx-auto`} role="alert">
      <div className="d-flex justify-content-between align-items-center text-white">
        <span>{message}</span>
        <button type="button" className="btn btn-transparent border-0" onClick={onClose}><i className="bi bi-x-lg text-white"></i></button>
      </div>
    </div>
  );
};

export default Alert;