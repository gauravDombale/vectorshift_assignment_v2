// outputNode.js

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Download } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { nodeStyles } from '../styles/nodeStyles';
import { useStore } from '../store';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Sync state changes to store
  useEffect(() => {
    updateNodeField(id, 'outputName', currName);
    updateNodeField(id, 'outputType', outputType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currName, outputType, id]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
  };

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <label style={nodeStyles.label}>
        Name
        <input 
          type="text" 
          value={currName} 
          onChange={handleNameChange}
          style={nodeStyles.input}
          onFocus={(e) => Object.assign(e.target.style, nodeStyles.inputFocus)}
          onBlur={(e) => {
            e.target.style.borderColor = '#e2e8f0';
            e.target.style.boxShadow = 'none';
          }}
        />
      </label>
      <label style={nodeStyles.label}>
        Type
        <select value={outputType} onChange={handleTypeChange} style={nodeStyles.select}>
          <option value="Text">Text</option>
          <option value="Image">Image</option>
        </select>
      </label>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      title="Output"
      icon={Download}
      handles={[
        {
          id: `${id}-value`,
          position: Position.Left,
          name: 'value'
        }
      ]}
      content={content}
      width={200}
    />
  );
}
