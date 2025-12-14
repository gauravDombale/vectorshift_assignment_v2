import React from 'react';
import { DarkModeSwitch } from 'react-toggle-dark-mode';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';

export default function MaterialThemeSwitchCompact() {
  const { themeMode, toggleTheme } = useStore(useShallow((s) => ({ themeMode: s.themeMode, toggleTheme: s.toggleTheme })));
  const isDark = themeMode === 'dark';

  const handleChange = (checked) => {
    // toggleTheme flips between 'light' and 'dark'
    if (toggleTheme) toggleTheme();
  };

  return (
    <DarkModeSwitch
      checked={isDark}
      onChange={handleChange}
      size={20}
      sunColor="#111827"
      moonColor="#ffffff"
      style={{ display: 'inline-block' }}
    />
  );
}
