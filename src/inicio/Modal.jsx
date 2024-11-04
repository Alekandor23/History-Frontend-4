// Modal.js
import React from 'react';
import './ModalStyles.css';

const Modal = ({ show, onClose, message, actions = [] }) => {
  if (!show) return null;
 
  return (
    <div className="modal-overlay" >
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          {actions.map((action, index) => (
            <button key={index} onClick={action.onClick} className="modal-button">
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;

