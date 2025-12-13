// conditionalNode.js

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { GitBranch } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { nodeStyles } from '../styles/nodeStyles';
import { useStore } from '../store';

export const ConditionalNode = ({ id, data }) => {
  const [condition, setCondition] = useState(data?.condition || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Sync state changes to store
  useEffect(() => {
    updateNodeField(id, 'condition', condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [condition, id]);

  const handleConditionChange = (e) => {
    setCondition(e.target.value);
  };

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label style={nodeStyles.label}>
        Condition
        <input 
          type="text" 
          value={condition} 
          onChange={handleConditionChange}
          placeholder="e.g., value > 10"
          style={nodeStyles.input}
          onFocus={(e) => Object.assign(e.target.style, nodeStyles.inputFocus)}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </label>
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
          style: { top: '40%' }
        },
        {
          id: `${id}-false`,
          position: Position.Right,
          name: 'false',
          style: { top: '70%' }
        }
      ]}
      content={content}
      width={200}
    />
  );
}

