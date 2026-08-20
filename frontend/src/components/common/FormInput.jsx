import React from 'react';

const FormInput = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  helperText,
  icon: Icon,
  as = 'input', // input | select | textarea
  options = [],
  rows = 3,
  style
}) => {
  return (
    <div style={{ marginBottom: '1.25rem', width: '100%', ...style }}>
      {label && (
        <label 
          htmlFor={name}
          style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: error ? '#f87171' : 'var(--text-secondary)',
            marginBottom: '0.4rem'
          }}
        >
          {label} {required && <span style={{ color: '#ef4444' }}>*</span>}
        </label>
      )}

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        {Icon && (
          <Icon
            size={18}
            style={{
              position: 'absolute',
              left: '0.85rem',
              color: error ? '#ef4444' : 'var(--text-muted)',
              pointerEvents: 'none'
            }}
          />
        )}

        {as === 'select' ? (
          <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            disabled={disabled}
            style={{
              width: '100%',
              padding: Icon ? '0.65rem 1rem 0.65rem 2.6rem' : '0.65rem 1rem',
              borderRadius: '8px',
              background: '#0f172a',
              border: `1px solid ${error ? '#ef4444' : 'var(--border-color)'}`,
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              outline: 'none',
              cursor: disabled ? 'not-allowed' : 'pointer'
            }}
          >
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
        ) : as === 'textarea' ? (
          <textarea
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            style={{
              width: '100%',
              padding: '0.65rem 1rem',
              borderRadius: '8px',
              background: '#0f172a',
              border: `1px solid ${error ? '#ef4444' : 'var(--border-color)'}`,
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              fontFamily: 'inherit',
              outline: 'none',
              resize: 'vertical'
            }}
          />
        ) : (
          <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            disabled={disabled}
            style={{
              width: '100%',
              padding: Icon ? '0.65rem 1rem 0.65rem 2.6rem' : '0.65rem 1rem',
              borderRadius: '8px',
              background: '#0f172a',
              border: `1px solid ${error ? '#ef4444' : 'var(--border-color)'}`,
              color: 'var(--text-primary)',
              fontSize: '0.92rem',
              outline: 'none'
            }}
          />
        )}
      </div>

      {error ? (
        <span style={{ fontSize: '0.78rem', color: '#f87171', marginTop: '0.3rem', display: 'block', fontWeight: 500 }}>
          {error}
        </span>
      ) : helperText ? (
        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>
          {helperText}
        </span>
      ) : null}
    </div>
  );
};

export default FormInput;
