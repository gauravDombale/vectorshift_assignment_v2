// llmNode.js

import { Position } from 'reactflow';
import { Bot } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const LLMNode = ({ id, data }) => {
  const content = (
    <div style={{ 
      fontSize: '12px', 
      color: '#64748b',
      padding: '4px 0'
    }}>
      <p style={{ margin: '0 0 8px 0' }}>Large Language Model</p>
      <div style={{ 
        fontSize: '11px',
        color: '#94a3b8',
        display: 'flex',
        flexDirection: 'column',
        gap: '4px'
      }}>
        <span>• System prompt</span>
        <span>• User prompt</span>
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      icon={Bot}
      handles={[
        {
          id: `${id}-system`,
          position: Position.Left,
          name: 'system',
          style: { top: '40%' }
        },
        {
          id: `${id}-prompt`,
          position: Position.Left,
          name: 'prompt',
          style: { top: '70%' }
        },
        {
          id: `${id}-response`,
          position: Position.Right,
          name: 'response'
        }
      ]}
      content={content}
      width={200}
    />
  );
}
