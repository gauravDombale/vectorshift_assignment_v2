import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { getTheme } from './styles/theme';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, Suspense } from 'react';
import MaterialThemeSwitchCompact from './MaterialThemeSwitch';

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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', position: 'relative' }}>
          {/* compact absolute toggle positioned above the submit button so it doesn't increase header height */}
          <div style={{ position: 'absolute', top: '-12px', right: 0 }}>
            <div style={{ display: 'inline-block' }}>
              <Suspense fallback={null}>
                <MaterialThemeSwitchCompact />
              </Suspense>
            </div>
          </div>

          <SubmitButton />
        </div>
      </div>
      <PipelineUI />
    </div>
  );
}

export default App;
