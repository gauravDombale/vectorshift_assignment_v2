// transformNode.js

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Wand2 } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { nodeStyles } from '../styles/nodeStyles';
import { useStore } from '../store';

export const TransformNode = ({ id, data }) => {
  const [transformType, setTransformType] = useState(data?.transformType || 'uppercase');
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Sync state changes to store
  useEffect(() => {
    updateNodeField(id, 'transformType', transformType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transformType, id]);

  const handleTypeChange = (e) => {
    setTransformType(e.target.value);
  };

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label style={nodeStyles.label}>
        Transform Type
        <select value={transformType} onChange={handleTypeChange} style={nodeStyles.select}>
          <option value="uppercase">Uppercase</option>
          <option value="lowercase">Lowercase</option>
          <option value="reverse">Reverse</option>
          <option value="trim">Trim</option>
          <option value="capitalize">Capitalize</option>
        </select>
      </label>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      title="Transform"
      icon={Wand2}
      handles={[
        {
          id: `${id}-input`,
          position: Position.Left,
          name: 'input'
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

