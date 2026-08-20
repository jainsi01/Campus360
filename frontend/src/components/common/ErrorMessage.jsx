import React, { useState } from 'react';
import { AlertCircle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';

const ErrorMessage = ({
  title = 'Something went wrong',
  message = 'An unexpected error occurred while loading this section.',
  details,
  onRetry
}) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div 
      style={{
        background: 'rgba(239, 68, 68, 0.08)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        padding: '1.25rem 1.5rem',
        margin: '1.5rem 0',
        color: '#f8fafc'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
          <div style={{ padding: '0.4rem', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', flexShrink: 0, marginTop: '0.1rem' }}>
            <AlertCircle size={20} />
          </div>
          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, margin: '0 0 0.25rem 0', color: '#fca5a5' }}>
              {title}
            </h4>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0, lineHeight: 1.5 }}>
              {message}
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {details && (
            <button
              onClick={() => setShowDetails(!showDetails)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(239,68,68,0.3)',
                color: '#fca5a5',
                padding: '0.4rem 0.75rem',
                borderRadius: '6px',
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              {showDetails ? 'Hide Log' : 'Technical Details'}
              {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="btn"
              style={{
                background: '#ef4444',
                color: '#fff',
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <RefreshCw size={14} />
              Retry
            </button>
          )}
        </div>
      </div>

      {showDetails && details && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(239,68,68,0.2)' }}>
          <pre 
            style={{
              background: '#0f172a',
              color: '#f87171',
              padding: '0.85rem 1rem',
              borderRadius: '8px',
              fontSize: '0.8rem',
              overflowX: 'auto',
              margin: 0,
              fontFamily: 'monospace'
            }}
          >
            {typeof details === 'object' ? JSON.stringify(details, null, 2) : details}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
