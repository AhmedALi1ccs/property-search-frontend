// src/components/Modal.js
import React from 'react';

function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  const modalStyles = {
    backdrop: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
    },
    content: {
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
      maxWidth: '600px',
      width: '90%',
      maxHeight: '80vh',
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 25px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
    },
    title: {
      margin: 0,
      fontSize: '1.5rem',
      color: '#1f2937',
      fontWeight: '600',
    },
    closeButton: {
      background: 'none',
      border: 'none',
      fontSize: '28px',
      cursor: 'pointer',
      color: '#6b7280',
      width: '36px',
      height: '36px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '6px',
    },
    body: {
      padding: '25px',
      overflowY: 'auto',
      maxHeight: 'calc(80vh - 80px)',
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={modalStyles.backdrop} onClick={handleBackdropClick}>
      <div style={modalStyles.content}>
        <div style={modalStyles.header}>
          <h2 style={modalStyles.title}>{title}</h2>
          <button style={modalStyles.closeButton} onClick={onClose}>
            <span>&times;</span>
          </button>
        </div>
        <div style={modalStyles.body}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;