// textNode.js

import { useState, useEffect, useRef, useCallback } from 'react';
import { Position } from 'reactflow';
import { Type } from 'lucide-react';
import { BaseNode } from './BaseNode';
import { nodeStyles } from '../styles/nodeStyles';
import { useStore } from '../store';
import TextareaField from '../components/NodeFields/TextareaField';
import useNodeData from '../hooks/useNodeData';

// JavaScript variable name validation regex
const JS_VARIABLE_REGEX = /^[a-zA-Z_$][a-zA-Z0-9_$]*$/;

// Extract variables from text using {{variableName}} pattern (handles spaces like {{ input }})
const extractVariables = (text) => {
  const regex = /\{\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\}\}/g;
  const matches = [];
  let match;
  
  while ((match = regex.exec(text)) !== null) {
    const varName = match[1].trim();
    // Validate it's a valid JavaScript variable name
    if (JS_VARIABLE_REGEX.test(varName)) {
      matches.push(varName);
    }
  }
  
  // Return unique variables
  return [...new Set(matches)];
};

// Calculate dynamic width based on text content
const calculateWidth = (text) => {
  const minWidth = 200;
  const maxWidth = 400;
  const charWidth = 7; // approximate pixels per character
  
  const lines = text.split('\n');
  const maxLineLength = Math.max(...lines.map(line => line.length), 15);
  const calculatedWidth = Math.min(maxWidth, Math.max(minWidth, maxLineLength * charWidth + 40));
  
  return calculatedWidth;
};

export const TextNode = ({ id, data }) => {
  const [currText, setCurrText] = useNodeData(id, 'text', data?.text || '{{input}}');
  const [nodeWidth, setNodeWidth] = useState(calculateWidth(data?.text || '{{input}}'));
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Extract variables from text
  const variables = extractVariables(currText);
  const variablesKey = variables.join(',');

  // Update variables in store when they change
  useEffect(() => {
    updateNodeField(id, 'variables', variables);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [variablesKey, id]);

  const handleTextChange = (e) => {
    const newText = e.target.value;
    setCurrText(newText);
    setNodeWidth(calculateWidth(newText));
  };

  // Build handles array with dynamic variable handles
  const handles = [
    // Input handles for each variable
    ...variables.map((varName, index) => ({
      id: `${id}-${varName}`,
      position: Position.Left,
      name: varName,
      style: {
        top: variables.length === 1
          ? '50%'
          : `${((index + 1) * 100) / (variables.length + 1)}%`
      }
    })),
    // Output handle
    {
      id: `${id}-output`,
      position: Position.Right,
      name: 'output'
    }
  ];

  const content = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <TextareaField
        label="Text"
        value={currText}
        onChange={handleTextChange}
        placeholder="Enter text with {{variables}}"
        minHeight={80}
      />
      {variables.length > 0 && (
        <div style={{ 
          fontSize: '11px', 
          color: '#10b981', 
          padding: '6px 10px',
          backgroundColor: '#ecfdf5',
          borderRadius: '6px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <span style={{ color: '#059669' }}>Variables:</span> {variables.join(', ')}
        </div>
      )}
    </div>
  );

  return (
    <BaseNode
      id={id}
      data={data}
      title="Text"
      icon={Type}
      handles={handles}
      content={content}
      width={nodeWidth}
    />
  );
}
