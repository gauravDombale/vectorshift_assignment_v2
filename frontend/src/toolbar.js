// toolbar.js

import { DraggableNode } from './draggableNode';
import { theme } from './styles/theme';
import { SubmitButton } from './submit';

export const PipelineToolbar = () => {

    return (
        <div style={{ 
            padding: `${theme.spacing.md} ${theme.spacing.lg}`, 
            backgroundColor: theme.colors.surface,
            width: '100%',
        }}>
            <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: theme.spacing.sm,
                flexWrap: 'wrap',
                gap: theme.spacing.xs,
            }}>
                <h2 style={{ 
                    margin: 0, 
                    fontSize: 'clamp(12px, 2vw, 15px)', 
                    fontWeight: '600',
                    color: theme.colors.text,
                    fontFamily: theme.typography.fontFamily,
                    whiteSpace: 'nowrap',
                }}>
                    Node Palette
                </h2>
                <span className="drag-hint" style={{
                    fontSize: 'clamp(10px, 1.5vw, 12px)',
                    color: theme.colors.textMuted,
                    display: 'none',
                }}>
                    Drag nodes to canvas
                </span>
            </div>
            <div style={{ 
                display: 'flex', 
                flexWrap: 'wrap', 
                gap: theme.spacing.sm,
                justifyContent: 'flex-start',
                alignItems: 'center',
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
                
                {/* Spacer to push submit button to the right */}
                <div style={{ flex: 1 }} />
                
                <SubmitButton />
            </div>
        </div>
    );
};
