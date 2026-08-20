import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingSpinner = ({ size = 24, text = 'Loading...', inline = false }) => {
  if (inline) {
    return (
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
        <Loader2 size={size} className="spin-animation" />
        {text && <span style={{ fontSize: '0.9rem' }}>{text}</span>}
      </div>
    );
  }

  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justify: 'center',
        padding: '3rem 1.5rem',
        width: '100%',
        color: 'var(--text-secondary)',
        gap: '0.75rem'
      }}
    >
      <Loader2 size={size} className="spin-animation" color="var(--primary)" />
      {text && <span style={{ fontSize: '0.92rem', fontWeight: 500 }}>{text}</span>}
    </div>
  );
};

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--border-color)' }}>
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} style={{ padding: '0.85rem 1rem' }}>
                <div className="skeleton-pulse" style={{ height: '16px', width: '80%', borderRadius: '4px' }} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, rIndex) => (
            <tr key={rIndex} style={{ borderBottom: '1px solid var(--border-color)' }}>
              {Array.from({ length: cols }).map((_, cIndex) => (
                <td key={cIndex} style={{ padding: '1rem' }}>
                  <div className="skeleton-pulse" style={{ height: '14px', width: cIndex === 0 ? '60%' : '90%', borderRadius: '4px' }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export const CardSkeleton = ({ count = 3 }) => {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="feature-card" style={{ padding: '1.5rem' }}>
          <div className="skeleton-pulse" style={{ width: '48px', height: '48px', borderRadius: '12px', marginBottom: '1rem' }} />
          <div className="skeleton-pulse" style={{ width: '70%', height: '20px', borderRadius: '4px', marginBottom: '0.75rem' }} />
          <div className="skeleton-pulse" style={{ width: '90%', height: '14px', borderRadius: '4px', marginBottom: '0.5rem' }} />
          <div className="skeleton-pulse" style={{ width: '50%', height: '14px', borderRadius: '4px' }} />
        </div>
      ))}
    </div>
  );
};

export default LoadingSpinner;
