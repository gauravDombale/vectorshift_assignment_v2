// conditionalNode.js

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { GitBranch } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { nodeStyles } from '../styles/nodeStyles';
import { useStore } from '../store';
import InputField from '../components/NodeFields/InputField';
import useNodeData from '../hooks/useNodeData';

export const ConditionalNode = ({ id, data }) => {
  const [condition, setCondition] = useNodeData(id, 'condition', data?.condition || '');

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <InputField label="Condition" value={condition} onChange={(e) => setCondition(e.target.value)} placeholder="e.g., value > 10" />
      <div style={{ 
        fontSize: '11px', 
        color: '#64748b',
        display: 'flex',
        gap: '12px'
      }}>
        <span style={{ color: '#10b981' }}>✓ True</span>
        <span style={{ color: '#ef4444' }}>✗ False</span>
      </div>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      title="Conditional"
      icon={GitBranch}
      handles={[
        {
          id: `${id}-condition`,
          position: Position.Left,
          name: 'input'
        },
        {
          id: `${id}-true`,
          position: Position.Right,
          name: 'true',
          // position handles symmetrically around center (true above, false below)
          style: { top: '40%' }
        },
        {
          id: `${id}-false`,
          position: Position.Right,
          name: 'false',
          style: { top: '60%' }
        }
      ]}
      content={content}
      width={200}
    />
  );
}

