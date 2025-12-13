// submit.js

import { Send } from 'lucide-react';
import { theme } from './styles/theme';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';

export const SubmitButton = () => {
    const { nodes, edges } = useStore(
        useShallow((state) => ({
            nodes: state.nodes,
            edges: state.edges,
        }))
    );

    const handleSubmit = async () => {
        try {
            const response = await fetch('http://localhost:8000/pipelines/parse', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    nodes: nodes,
                    edges: edges,
                }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Display alert with results
            const message = `Pipeline Analysis Results:\n\n` +
                          `Number of Nodes: ${data.num_nodes}\n` +
                          `Number of Edges: ${data.num_edges}\n` +
                          `Is DAG: ${data.is_dag ? 'Yes' : 'No'}`;
            
            alert(message);
        } catch (error) {
            console.error('Error submitting pipeline:', error);
            alert(`Error submitting pipeline: ${error.message}\n\nMake sure the backend is running on http://localhost:8000`);
        }
    };

    return (
        <div style={{
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'flex-end',
            padding: `${theme.spacing.md} ${theme.spacing.lg}`,
            backgroundColor: theme.colors.surface,
        }}>
            <button 
                type="button"
                onClick={handleSubmit}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    fontFamily: theme.typography.fontFamily,
                    color: theme.colors.textLight,
                    backgroundColor: theme.colors.primary,
                    border: 'none',
                    borderRadius: theme.borderRadius.md,
                    cursor: 'pointer',
                    transition: `all ${theme.transitions.fast}`,
                    boxShadow: theme.shadows.sm,
                }}
                onMouseEnter={(e) => {
                    e.target.style.backgroundColor = theme.colors.primaryDark;
                    e.target.style.boxShadow = theme.shadows.md;
                    e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                    e.target.style.backgroundColor = theme.colors.primary;
                    e.target.style.boxShadow = theme.shadows.sm;
                    e.target.style.transform = 'translateY(0)';
                }}
            >
                <Send size={16} />
                Submit Pipeline
            </button>
        </div>
    );
}
