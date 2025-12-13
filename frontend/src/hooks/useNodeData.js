import { useState, useEffect, useRef } from 'react';
import { useStore } from '../store';

// Debounced hook to sync node field value to global store
export const useNodeData = (id, fieldName, initialValue, delay = 300) => {
  const updateNodeField = useStore((s) => s.updateNodeField);
  const [value, setValue] = useState(initialValue);
  const timerRef = useRef(null);

  // Keep local state in sync when initial changes (e.g., on load)
  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  // Debounce writes to global store
  useEffect(() => {
    if (!id || !fieldName) return;

    // Clear previous timer
    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      updateNodeField(id, fieldName, value);
      timerRef.current = null;
    }, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        // flush immediately on unmount/cleanup
        updateNodeField(id, fieldName, value);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, fieldName, value]);

  return [value, setValue];
};

export default useNodeData;
