// inputNode.js

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Upload } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { nodeStyles } from '../styles/nodeStyles';
import { useStore } from '../store';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Sync state changes to store
  useEffect(() => {
    updateNodeField(id, 'inputName', currName);
    updateNodeField(id, 'inputType', inputType);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currName, inputType, id]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
  };

  const handleTypeChange = (e) => {
    setInputType(e.target.value);
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
        <select value={inputType} onChange={handleTypeChange} style={nodeStyles.select}>
          <option value="Text">Text</option>
          <option value="File">File</option>
        </select>
      </label>
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      title="Input"
      icon={Upload}
      handles={[
        {
          id: `${id}-value`,
          position: Position.Right,
          name: 'value'
        }
      ]}
      content={content}
      width={200}
    />
  );
}
