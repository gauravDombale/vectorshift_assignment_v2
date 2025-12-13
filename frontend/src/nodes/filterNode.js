// filterNode.js

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Filter } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { nodeStyles } from '../styles/nodeStyles';
import { useStore } from '../store';

export const FilterNode = ({ id, data }) => {
  const [criteria, setCriteria] = useState(data?.criteria || '');
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Sync state changes to store
  useEffect(() => {
    updateNodeField(id, 'criteria', criteria);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [criteria, id]);

  const handleCriteriaChange = (e) => {
    setCriteria(e.target.value);
  };

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label style={nodeStyles.label}>
        Filter Criteria
        <input 
          type="text" 
          value={criteria} 
          onChange={handleCriteriaChange}
          placeholder="e.g., contains 'text'"
          style={nodeStyles.input}
          onFocus={(e) => Object.assign(e.target.style, nodeStyles.inputFocus)}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </label>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      title="Filter"
      icon={Filter}
      handles={[
        {
          id: `${id}-input`,
          position: Position.Left,
          name: 'input'
        },
        {
          id: `${id}-filtered`,
          position: Position.Right,
          name: 'filtered'
        }
      ]}
      content={content}
      width={200}
    />
  );
}

