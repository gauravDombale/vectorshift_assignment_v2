import React, { useRef, useEffect } from 'react';
import { nodeStyles } from '../../styles/nodeStyles';

export const TextareaField = ({ label, value, onChange, placeholder = '', minHeight = 80 }) => {
  const ref = useRef(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.height = 'auto';
      ref.current.style.height = `${Math.max(minHeight, ref.current.scrollHeight)}px`;
    }
  }, [value, minHeight]);

  const handleFocus = (e) => e.target.classList.add('ns-field-focus');
  const handleBlur = (e) => e.target.classList.remove('ns-field-focus');

  return (
    <label style={nodeStyles.label}>
      {label}
      <textarea
        ref={ref}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        style={{ ...nodeStyles.input, minHeight: `${minHeight}px`, resize: 'none', overflow: 'hidden' }}
        className="ns-field"
        onFocus={handleFocus}
        onBlur={handleBlur}
        aria-label={label}
      />
    </label>
  );
};

export default TextareaField;
