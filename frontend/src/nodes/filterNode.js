// filterNode.js

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Filter } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { nodeStyles } from '../styles/nodeStyles';
import { useStore } from '../store';
import InputField from '../components/NodeFields/InputField';
import useNodeData from '../hooks/useNodeData';

export const FilterNode = ({ id, data }) => {
  const [criteria, setCriteria] = useNodeData(id, 'criteria', data?.criteria || '');

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <InputField label="Filter Criteria" value={criteria} onChange={(e) => setCriteria(e.target.value)} placeholder="e.g., contains 'text'" />
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

