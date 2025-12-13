import React from 'react';
import { nodeStyles } from '../../styles/nodeStyles';

export const InputField = ({ label, value, onChange, placeholder = '', type = 'text' }) => {
  const handleFocus = (e) => e.target.classList.add('ns-field-focus');
  const handleBlur = (e) => e.target.classList.remove('ns-field-focus');

  return (
    <label style={nodeStyles.label}>
      {label}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={nodeStyles.input}
        className="ns-field"
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={label}
      />
    </label>
  );
};

export default InputField;
