import React from 'react';
import './Input.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({ label, error, className = '', id, ...props }) => {
  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
  const errorClass = error ? 'input-error' : '';

  return (
    <div className={`input-group ${className}`}>
      {label && <label htmlFor={inputId} className="input-label">{label}</label>}
      <input id={inputId} className={`input-control ${errorClass}`} {...props} />
      {error && <span className="input-error-msg">{error}</span>}
    </div>
  );
};
