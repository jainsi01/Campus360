import React from 'react';
import { Inbox, Plus } from 'lucide-react';

const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No records found',
  description = 'There are no items matching your criteria or currently available in the database.',
  actionText,
  onAction,
  iconColor = '#818cf8'
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justify: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        background: 'var(--bg-card)',
        borderRadius: '16px',
        border: '1px dashed var(--border-color)',
        margin: '1.5rem 0'
      }}
    >
      <div 
        style={{
          padding: '1.25rem',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.03)',
          border: '1px solid var(--border-color)',
          color: iconColor,
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justify: 'center'
        }}
      >
        <Icon size={38} />
      </div>

      <h3 style={{ fontSize: '1.35rem', fontWeight: 700, margin: '0 0 0.5rem 0' }}>
        {title}
      </h3>

      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '420px', margin: '0 0 1.5rem 0', lineHeight: 1.5 }}>
        {description}
      </p>

      {actionText && onAction && (
        <button
          onClick={onAction}
          className="btn btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.65rem 1.25rem', fontSize: '0.9rem' }}
        >
          <Plus size={16} />
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
