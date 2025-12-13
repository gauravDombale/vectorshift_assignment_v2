// toolbar.js

import { DraggableNode } from './draggableNode';
import { theme } from './styles/theme';

export const PipelineToolbar = () => {

    return (
        <div style={{ 
            padding: `${theme.spacing.lg} ${theme.spacing.xl}`, 
            backgroundColor: theme.colors.surface,
            flex: 1,
        }}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: theme.spacing.md
            }}>
                <h2 style={{ 
                    margin: 0, 
                    fontSize: '15px', 
                    fontWeight: '600',
                    color: theme.colors.text,
                    fontFamily: theme.typography.fontFamily
                }}>
                    Node Palette
                </h2>
                <span style={{
                    fontSize: '12px',
                    color: theme.colors.textMuted,
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                }}>
                    Drag nodes to canvas
                </span>
            </div>
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: theme.spacing.sm 
            }}>
                <DraggableNode type='customInput' label='Input' />
                <DraggableNode type='llm' label='LLM' />
                <DraggableNode type='customOutput' label='Output' />
                <DraggableNode type='text' label='Text' />
                <DraggableNode type='conditional' label='Conditional' />
                <DraggableNode type='transform' label='Transform' />
                <DraggableNode type='filter' label='Filter' />
                <DraggableNode type='merge' label='Merge' />
                <DraggableNode type='split' label='Split' />
            </div>
        </div>
    );
};
