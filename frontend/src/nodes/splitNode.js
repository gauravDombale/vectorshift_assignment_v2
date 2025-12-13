// splitNode.js

import { Position } from 'reactflow';
import { Split } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const SplitNode = ({ id, data }) => {
  const content = (
    <div style={{ 
      fontSize: '12px', 
      color: '#64748b', 
      textAlign: 'center',
      padding: '8px 0'
    }}>
      <p style={{ margin: 0, marginBottom: '8px' }}>Splits into multiple outputs</p>
      <div style={{ 
        fontSize: '11px',
        color: '#94a3b8',
        display: 'flex',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <span>← 1 input</span>
        <span>→ 3 outputs</span>
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      title="Split"
      icon={Split}
      handles={[
        {
          id: `${id}-input`,
          position: Position.Left,
          name: 'input'
        },
        {
          id: `${id}-output1`,
          position: Position.Right,
          name: 'output1',
          style: { top: '30%' }
        },
        {
          id: `${id}-output2`,
          position: Position.Right,
          name: 'output2',
          style: { top: '50%' }
        },
        {
          id: `${id}-output3`,
          position: Position.Right,
          name: 'output3',
          style: { top: '70%' }
        }
      ]}
      content={content}
      width={200}
    />
  );
}

