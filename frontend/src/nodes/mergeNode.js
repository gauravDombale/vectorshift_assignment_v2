// mergeNode.js

import { Position } from 'reactflow';
import { Merge } from 'lucide-react';
import { BaseNode } from './BaseNode';

export const MergeNode = ({ id, data }) => {
  const content = (
    <div style={{ 
      fontSize: '12px', 
      color: '#64748b', 
      textAlign: 'center',
      padding: '8px 0'
    }}>
      <p style={{ margin: 0, marginBottom: '8px' }}>Combines multiple inputs</p>
      <div style={{ 
        fontSize: '11px',
        color: '#94a3b8',
        display: 'flex',
        justifyContent: 'center',
        gap: '8px'
      }}>
        <span>← 3 inputs</span>
        <span>→ 1 output</span>
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      title="Merge"
      icon={Merge}
      handles={[
        {
          id: `${id}-input1`,
          position: Position.Left,
          name: 'input1',
          style: { top: '30%' }
        },
        {
          id: `${id}-input2`,
          position: Position.Left,
          name: 'input2',
          style: { top: '50%' }
        },
        {
          id: `${id}-input3`,
          position: Position.Left,
          name: 'input3',
          style: { top: '70%' }
        },
        {
          id: `${id}-output`,
          position: Position.Right,
          name: 'output'
        }
      ]}
      content={content}
      width={200}
    />
  );
}

