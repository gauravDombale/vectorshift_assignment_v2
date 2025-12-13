import React from 'react';
import { nodeStyles } from '../../styles/nodeStyles';

export const SelectField = ({ label, value, onChange, options = [] }) => {
  const handleFocus = (e) => e.target.classList.add('ns-field-focus');
  const handleBlur = (e) => e.target.classList.remove('ns-field-focus');

  return (
    <label style={nodeStyles.label}>
      {label}
      <select
        value={value}
        onChange={onChange}
        style={nodeStyles.select}
        className="ns-field"
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={label}
      >
        {options.map((opt) => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </label>
  );
};

export default SelectField;
