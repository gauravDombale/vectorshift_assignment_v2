// theme.js
// Design tokens matching VectorShift's clean, professional design

export const lightTheme = {
  colors: {
    // Primary colors - matching VectorShift's purple/indigo
    primary: '#5046e5',
    primaryDark: '#4338ca',
    primaryLight: '#6366f1',
    primaryMuted: '#eef2ff',
    
    // Secondary colors
    secondary: '#10b981',
    secondaryDark: '#059669',
    secondaryLight: '#34d399',
    
    // Accent colors for nodes
    accent: {
      blue: '#3b82f6',
      green: '#10b981',
      orange: '#f97316',
      purple: '#8b5cf6',
      pink: '#ec4899',
      cyan: '#06b6d4',
      yellow: '#eab308',
      red: '#ef4444',
    },
    
    // Background colors
    background: '#f8fafc',
    backgroundAlt: '#f1f5f9',
    surface: '#ffffff',
    
    // Border colors
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    borderDark: '#cbd5e1',
    
    // Text colors
    text: '#1e293b',
    textSecondary: '#64748b',
    textMuted: '#94a3b8',
    textLight: '#ffffff',
    
    // Status colors
    error: '#ef4444',
    warning: '#f59e0b',
    success: '#10b981',
    info: '#3b82f6',
    
    // Node specific
    nodeBackground: '#ffffff',
    nodeHeader: '#5046e5',
    nodeBorder: '#e2e8f0',
    handleInput: '#3b82f6',
    handleOutput: '#10b981',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
  },
  
  borderRadius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    node: '0 2px 8px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    nodeHover: '0 8px 16px rgba(0, 0, 0, 0.12), 0 2px 4px rgba(0, 0, 0, 0.06)',
  },
  
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },
  
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '11px',
      sm: '12px',
      md: '13px',
      lg: '14px',
      xl: '16px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
};

export const darkTheme = {
  colors: {
    primary: '#8b5cf6',
    primaryDark: '#7c3aed',
    primaryLight: '#a78bfa',
    primaryMuted: '#1f2937',
    secondary: '#34d399',
    secondaryDark: '#10b981',
    secondaryLight: '#6ee7b7',
    accent: {
      blue: '#60a5fa',
      green: '#34d399',
      orange: '#fb923c',
      purple: '#a78bfa',
      pink: '#f472b6',
      cyan: '#67e8f9',
      yellow: '#facc15',
      red: '#fb7185',
    },
    background: '#0f172a',
    backgroundAlt: '#0b1220',
    surface: '#0b1220',
    border: '#1f2937',
    borderLight: '#111827',
    borderDark: '#374151',
    text: '#e6eef8',
    textSecondary: '#cbd5e1',
    textMuted: '#94a3b8',
    textLight: '#ffffff',
    error: '#fb7185',
    warning: '#f59e0b',
    success: '#34d399',
    info: '#60a5fa',
    nodeBackground: '#0b1220',
    nodeHeader: '#7c3aed',
    nodeBorder: '#1f2937',
    handleInput: '#60a5fa',
    handleOutput: '#34d399',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
  },
  borderRadius: {
    xs: '4px',
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  shadows: {
    xs: '0 1px 2px rgba(0, 0, 0, 0.04)',
    sm: '0 1px 3px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -2px rgba(0, 0, 0, 0.04)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    node: '0 2px 8px rgba(0, 0, 0, 0.24), 0 1px 2px rgba(0, 0, 0, 0.08)',
    nodeHover: '0 8px 16px rgba(0, 0, 0, 0.32), 0 2px 4px rgba(0, 0, 0, 0.12)',
  },
  transitions: {
    fast: '150ms ease',
    normal: '200ms ease',
    slow: '300ms ease',
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: {
      xs: '11px',
      sm: '12px',
      md: '13px',
      lg: '14px',
      xl: '16px',
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
};

export const getTheme = (mode = 'light') => (mode === 'dark' ? darkTheme : lightTheme);

// Backwards-compatibility: default `theme` export used by many modules
export const theme = lightTheme;

