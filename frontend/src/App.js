import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { getTheme } from './styles/theme';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { useEffect, Suspense } from 'react';
import { Undo, Redo } from 'lucide-react';
import MaterialThemeSwitchCompact from './MaterialThemeSwitch';

function App() {
  const { themeMode, toggleTheme, undo, redo, _history, _redo } = useStore(useShallow((s) => ({ themeMode: s.themeMode, toggleTheme: s.toggleTheme, undo: s.undo, redo: s.redo, _history: s._history, _redo: s._redo })));
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
        position: 'relative'
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

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginRight: '97px', position: 'relative', top: '4px', marginTop: '21px' }}>
              <button
                onClick={() => undo && undo()}
                title="Undo"
                style={{
                  width: 34,
                  height: 34,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: (_history && _history.length) ? 'pointer' : 'default',
                  opacity: (_history && _history.length) ? 1 : 0.45
                }}
              >
                <Undo size={18} color={theme.colors.text} />
              </button>

              <button
                onClick={() => redo && redo()}
                title="Redo"
                style={{
                  width: 34,
                  height: 34,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  cursor: (_redo && _redo.length) ? 'pointer' : 'default',
                  opacity: (_redo && _redo.length) ? 1 : 0.45
                }}
              >
                <Redo size={18} color={theme.colors.text} />
              </button>
            </div>

            <SubmitButton />
          </div>
        </div>
      </div>
      <PipelineUI />
    </div>
  );
}

export default App;
