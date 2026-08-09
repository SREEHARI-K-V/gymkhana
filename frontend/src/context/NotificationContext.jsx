import React, { createContext, useState, useContext } from 'react';
import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <NotificationContext.Provider value={{ addToast }}>
      {children}
      <div className="gymkhana-toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className="gymkhana-toast">
            <div className="d-flex align-items-center gap-2">
              {toast.type === 'success' && <FiCheckCircle color="#22C55E" size={20} />}
              {toast.type === 'danger' && <FiAlertCircle color="#EF4444" size={20} />}
              {toast.type === 'info' && <FiInfo color="#06B6D4" size={20} />}
              <span className="fw-medium" style={{ fontSize: '0.9rem' }}>{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              style={{ background: 'none', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <FiX size={16} />
            </button>
          </div>
        ))}
      </div>
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
