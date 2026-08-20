import React from 'react';
import { Search, X, Filter } from 'lucide-react';

export const SearchBar = ({
  value = '',
  onChange,
  onClear,
  placeholder = 'Search records...',
  style
}) => {
  return (
    <div 
      style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        minWidth: '240px',
        flex: 1,
        ...style
      }}
    >
      <Search
        size={18}
        style={{
          position: 'absolute',
          left: '0.85rem',
          color: 'var(--text-muted)',
          pointerEvents: 'none'
        }}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '0.6rem 2.25rem 0.6rem 2.5rem',
          borderRadius: '8px',
          background: '#0f172a',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontSize: '0.9rem',
          outline: 'none',
          transition: 'all 0.2s ease'
        }}
      />
      {value && (
        <button
          onClick={() => {
            onChange('');
            if (onClear) onClear();
          }}
          style={{
            position: 'absolute',
            right: '0.75rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer',
            padding: '0.2rem',
            display: 'flex',
            alignItems: 'center',
            borderRadius: '4px'
          }}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};

export const FilterDropdown = ({
  label,
  value,
  onChange,
  options = [],
  allOptionText = 'All Options',
  icon: Icon = Filter,
  style
}) => {
  return (
    <div 
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.4rem',
        background: '#0f172a',
        border: '1px solid var(--border-color)',
        borderRadius: '8px',
        padding: '0.4rem 0.75rem',
        ...style
      }}
    >
      <Icon size={16} color="var(--text-secondary)" />
      {label && <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{label}:</span>}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'var(--text-primary)',
          fontSize: '0.88rem',
          outline: 'none',
          cursor: 'pointer',
          fontWeight: 600
        }}
      >
        {allOptionText && <option value="ALL">{allOptionText}</option>}
        {options.map((opt) => {
          const val = typeof opt === 'object' ? opt.value : opt;
          const text = typeof opt === 'object' ? opt.label : opt;
          return (
            <option key={val} value={val}>
              {text}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default SearchBar;
