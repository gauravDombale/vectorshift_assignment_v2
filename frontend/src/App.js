import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';

function App() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', minHeight: '100dvh' }}>
      <div style={{ 
        borderBottom: '1px solid #e2e8f0',
      }}>
        <PipelineToolbar />
      </div>
      <PipelineUI />
    </div>
  );
}

export default App;
