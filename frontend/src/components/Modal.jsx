import React from 'react';
import { FiX } from 'react-icons/fi';

export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
  if (!isOpen) return null;

  const maxWidths = {
    sm: '400px',
    md: '600px',
    lg: '850px',
    xl: '1100px'
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        backdropFilter: 'blur(12px)',
        zIndex: 1050,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={onClose}
    >
      <div
        className="glass-card-static position-relative w-100 overflow-hidden"
        style={{
          maxWidth: maxWidths[size] || '600px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
          border: '1px solid var(--border-glass-bright)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="d-flex align-items-center justify-content-between p-4 border-bottom border-secondary border-opacity-25">
          <h4 className="mb-0 text-white font-weight-bold">{title}</h4>
          <button
            onClick={onClose}
            className="btn btn-link text-muted p-0 hover-white"
            style={{ textDecoration: 'none' }}
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 overflow-auto flex-grow-1">
          {children}
        </div>
      </div>
    </div>
  );
};
