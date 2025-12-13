import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { theme } from './styles/theme';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        borderBottom: `1px solid ${theme.colors.border}`,
        backgroundColor: theme.colors.surface,
        padding: `${theme.spacing.lg} ${theme.spacing.xl}`,
      }}>
        <PipelineToolbar />
        <SubmitButton />
      </div>
      <PipelineUI />
    </div>
  );
}

export default App;
