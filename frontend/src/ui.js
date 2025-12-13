// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback } from 'react';
import ReactFlow, { Controls, Background, MiniMap } from 'reactflow';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';
import { InputNode } from './nodes/inputNode';
import { LLMNode } from './nodes/llmNode';
import { OutputNode } from './nodes/outputNode';
import { TextNode } from './nodes/textNode';
import { ConditionalNode } from './nodes/conditionalNode';
import { TransformNode } from './nodes/transformNode';
import { FilterNode } from './nodes/filterNode';
import { MergeNode } from './nodes/mergeNode';
import { SplitNode } from './nodes/splitNode';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  conditional: ConditionalNode,
  transform: TransformNode,
  filter: FilterNode,
  merge: MergeNode,
  split: SplitNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  addNode: state.addNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const {
      nodes,
      edges,
      getNodeID,
      addNode,
      onNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(useShallow(selector));

    const getInitNodeData = useCallback((nodeID, type) => {
      return { id: nodeID, nodeType: `${type}` };
    }, []);

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.project({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode, getInitNodeData]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    return (
        <>
        <div ref={reactFlowWrapper} style={{width: '100%', height: 'calc(100vh - 120px)', height: 'calc(100dvh - 120px)', minHeight: '400px', backgroundColor: '#f8fafc'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={setReactFlowInstance}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                defaultEdgeOptions={{
                  type: 'smoothstep',
                  style: { strokeWidth: 2.5, stroke: '#5046e5' },
                  animated: true,
                }}
                connectionRadius={25}
                snapToGrid={true}
                fitView
            >
                <Background color="#94a3b8" gap={gridSize} variant="dots" size={1.5} />
                <Controls 
                  className="react-flow-controls"
                  style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }} 
                />
                <MiniMap 
                  className="react-flow-minimap"
                  style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                  nodeColor="#5046e5"
                  nodeStrokeWidth={1}
                  nodeStrokeColor="#4338ca"
                  nodeBorderRadius={3}
                  maskColor="rgba(240, 240, 245, 0.7)"
                  zoomable
                  pannable
                />
            </ReactFlow>
        </div>
        </>
    )
}
