// inputNode.js

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Upload } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { nodeStyles } from '../styles/nodeStyles';
import { useStore } from '../store';
import InputField from '../components/NodeFields/InputField';
import SelectField from '../components/NodeFields/SelectField';
import useNodeData from '../hooks/useNodeData';

export const InputNode = ({ id, data }) => {
  const [currName, setCurrName] = useNodeData(id, 'inputName', data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useNodeData(id, 'inputType', data?.inputType || 'Text');

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <InputField label="Name" value={currName} onChange={(e) => setCurrName(e.target.value)} />
      <SelectField
        label="Type"
        value={inputType}
        onChange={(e) => setInputType(e.target.value)}
        options={[{ value: 'Text', label: 'Text' }, { value: 'File', label: 'File' }]}
      />
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
