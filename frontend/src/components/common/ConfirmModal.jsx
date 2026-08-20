import React, { useEffect } from 'react';
import { AlertTriangle, Info, Trash2, X, RefreshCw } from 'lucide-react';

const ConfirmModal = ({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger', // danger | warning | primary
  onConfirm,
  onCancel,
  loading = false
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen && !loading) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, loading, onCancel]);

  if (!isOpen) return null;

  const getTypeIcon = () => {
    switch (type) {
      case 'danger': return <Trash2 size={24} color="#ef4444" />;
      case 'warning': return <AlertTriangle size={24} color="#f59e0b" />;
      default: return <Info size={24} color="#3b82f6" />;
    }
  };

  const getConfirmBtnStyle = () => {
    switch (type) {
      case 'danger': return { background: '#ef4444', borderColor: '#ef4444', color: '#fff' };
      case 'warning': return { background: '#f59e0b', borderColor: '#f59e0b', color: '#fff' };
      default: return { background: '#4f46e5', borderColor: '#4f46e5', color: '#fff' };
    }
  };

  return (
    <div 
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        display: 'flex',
        alignItems: 'center',
        justify: 'center',
        background: 'rgba(15, 23, 42, 0.75)',
        backdropFilter: 'blur(6px)',
        padding: '1rem'
      }}
    >
      <div 
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '460px',
          width: '100%',
          boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
          animation: 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
          position: 'relative'
        }}
      >
        <button
          onClick={onCancel}
          disabled={loading}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.3rem',
            borderRadius: '6px'
          }}
        >
          <X size={18} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div 
            style={{
              padding: '0.75rem',
              borderRadius: '12px',
              background: type === 'danger' ? 'rgba(239, 68, 68, 0.15)' : type === 'warning' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(59, 130, 246, 0.15)'
            }}
          >
            {getTypeIcon()}
          </div>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 700, margin: 0 }}>{title}</h3>
          </div>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', margin: '0 0 1.75rem 0', lineHeight: 1.6 }}>
          {message}
        </p>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
          <button
            onClick={onCancel}
            disabled={loading}
            className="btn btn-secondary"
            style={{ padding: '0.6rem 1.25rem', fontSize: '0.9rem' }}
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="btn"
            style={{ ...getConfirmBtnStyle(), padding: '0.6rem 1.25rem', fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
          >
            {loading && <RefreshCw size={16} className="spin-animation" />}
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
