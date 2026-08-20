import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = {
    show: addToast,
    success: (msg, duration) => addToast(msg, 'success', duration),
    error: (msg, duration) => addToast(msg, 'error', duration),
    warning: (msg, duration) => addToast(msg, 'warning', duration),
    info: (msg, duration) => addToast(msg, 'info', duration)
  };

  const getIcon = (type) => {
    switch (type) {
      case 'success': return <CheckCircle2 size={18} color="#10b981" />;
      case 'error': return <XCircle size={18} color="#ef4444" />;
      case 'warning': return <AlertTriangle size={18} color="#f59e0b" />;
      default: return <Info size={18} color="#3b82f6" />;
    }
  };

  const getTypeStyle = (type) => {
    switch (type) {
      case 'success': return { borderColor: 'rgba(16,185,129,0.4)', background: '#064e3b' };
      case 'error': return { borderColor: 'rgba(239,68,68,0.4)', background: '#450a0a' };
      case 'warning': return { borderColor: 'rgba(245,158,11,0.4)', background: '#451a03' };
      default: return { borderColor: 'rgba(59,130,246,0.4)', background: '#1e3a8a' };
    }
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div 
        style={{
          position: 'fixed',
          top: '1.25rem',
          right: '1.25rem',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          maxWidth: '420px',
          width: 'calc(100vw - 2.5rem)',
          pointerEvents: 'none'
        }}
      >
        {toasts.map((t) => {
          const typeStyle = getTypeStyle(t.type);
          return (
            <div
              key={t.id}
              style={{
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                justify: 'space-between',
                gap: '0.75rem',
                padding: '0.85rem 1.1rem',
                borderRadius: '10px',
                border: `1px solid ${typeStyle.borderColor}`,
                background: typeStyle.background,
                color: '#f8fafc',
                boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                fontSize: '0.9rem',
                fontWeight: 500,
                animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                {getIcon(t.type)}
                <span>{t.message}</span>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: '0.2rem',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: '4px'
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
