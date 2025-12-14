import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { getTheme } from './styles/theme';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { useEffect } from 'react';

function App() {
  const { themeMode, toggleTheme } = useStore(useShallow((s) => ({ themeMode: s.themeMode, toggleTheme: s.toggleTheme })));
  const theme = getTheme(themeMode || 'light');

  useEffect(() => {
    try {
      if (themeMode === 'dark') document.body.classList.add('dark');
      else document.body.classList.remove('dark');
    } catch (err) {
      // ignore
    }
  }, [themeMode]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', background: theme.colors.background, color: theme.colors.text }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface,
        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
      }}>
        <PipelineToolbar />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button onClick={toggleTheme} style={{ background: 'transparent', border: '1px solid rgba(0,0,0,0.06)', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', color: theme.colors.textSecondary }} title="Toggle theme">
            {themeMode === 'dark' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <SubmitButton />
        </div>
      </div>
      <PipelineUI />
    </div>
  );
}

export default App;
