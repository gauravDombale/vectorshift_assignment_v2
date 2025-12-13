// outputNode.js

import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { Download } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { nodeStyles } from '../styles/nodeStyles';
import { useStore } from '../store';
import InputField from '../components/NodeFields/InputField';
import SelectField from '../components/NodeFields/SelectField';
import useNodeData from '../hooks/useNodeData';

export const OutputNode = ({ id, data }) => {
  const [currName, setCurrName] = useNodeData(id, 'outputName', data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useNodeData(id, 'outputType', data?.outputType || 'Text');

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      <InputField label="Name" value={currName} onChange={(e) => setCurrName(e.target.value)} />
      <SelectField
        label="Type"
        value={outputType}
        onChange={(e) => setOutputType(e.target.value)}
        options={[{ value: 'Text', label: 'Text' }, { value: 'Image', label: 'Image' }]}
      />
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
