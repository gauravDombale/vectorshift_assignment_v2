// nodeStyles.js
// Shared node styling - clean, professional design matching VectorShift

import { theme } from './theme';

export const nodeStyles = {
  // Main container - the outer wrapper
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    boxShadow: theme.shadows.node,
    transition: `all ${theme.transitions.normal}`,
    cursor: 'default',
    overflow: 'visible',
    border: `1px solid ${theme.colors.border}`,
  },
  containerHover: {
    boxShadow: theme.shadows.nodeHover,
    borderColor: theme.colors.primary,
  },
  
  // Header section - full width colored header
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing.sm,
    backgroundColor: theme.colors.nodeHeader,
    color: theme.colors.textLight,
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    fontWeight: theme.typography.fontWeight.semibold,
    fontSize: theme.typography.fontSize.md,
    fontFamily: theme.typography.fontFamily,
    borderBottom: 'none',
    margin: 0,
    borderRadius: `${theme.borderRadius.lg} ${theme.borderRadius.lg} 0 0`,
  },
  
  // Header icon
  headerIcon: {
    width: '16px',
    height: '16px',
    opacity: 0.9,
  },
  
  // Content section
  content: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: `0 0 ${theme.borderRadius.lg} ${theme.borderRadius.lg}`,
  },
  
  // Form inputs
  input: {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    transition: `all ${theme.transitions.fast}`,
    outline: 'none',
    boxSizing: 'border-box',
  },
  inputFocus: {
    borderColor: theme.colors.primary,
    boxShadow: `0 0 0 3px ${theme.colors.primaryMuted}`,
  },
  
  // Select dropdowns
  select: {
    width: '100%',
    padding: `${theme.spacing.sm} ${theme.spacing.md}`,
    border: `1px solid ${theme.colors.border}`,
    borderRadius: theme.borderRadius.sm,
    fontSize: theme.typography.fontSize.sm,
    fontFamily: theme.typography.fontFamily,
    color: theme.colors.text,
    backgroundColor: theme.colors.surface,
    cursor: 'pointer',
    transition: `all ${theme.transitions.fast}`,
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 10px center',
    paddingRight: '32px',
  },
  
  // Labels
  label: {
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing.xs,
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
    color: theme.colors.textSecondary,
    fontFamily: theme.typography.fontFamily,
  },
  
  // Helper text
  helperText: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textMuted,
    marginTop: theme.spacing.xs,
  },
  
  // Handle labels (for variable names next to handles)
  handleLabel: {
    fontSize: theme.typography.fontSize.xs,
    color: theme.colors.textSecondary,
    fontWeight: theme.typography.fontWeight.medium,
  },
};

