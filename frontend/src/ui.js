// ui.js
// Displays the drag-and-drop UI
// --------------------------------------------------

import { useState, useRef, useCallback, useEffect } from 'react';
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

    const [edgeButtons, setEdgeButtons] = useState([]);

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

    // Track connection drag state to show a cancel button positioned at the midpoint
    const [isConnecting, setIsConnecting] = useState(false);
    const [connectPos, setConnectPos] = useState(null); // {x,y} client coordinates
    const mouseMoveRef = useRef(null);
    const startPointRef = useRef(null);
    const connectingGestureRef = useRef(false);
    // Hover state for existing edges (allows deleting an existing edge)
    const [hoveredEdgeId, setHoveredEdgeId] = useState(null);
    const [hoveredEdgePos, setHoveredEdgePos] = useState(null);
    const removeEdge = useStore((state) => state.removeEdge);

    const onConnectStart = useCallback((event) => {
      setIsConnecting(true);

      // Capture the source handle center if possible
      try {
        const target = event?.target;
        if (target && typeof target.getBoundingClientRect === 'function') {
          const r = target.getBoundingClientRect();
          startPointRef.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
        } else {
          startPointRef.current = null;
        }
      } catch (err) {
        startPointRef.current = null;
      }

      // Install mousemove to update connectPos. Only show cancel button after
      // the cursor has moved a small threshold (so we don't show it on simple click)
      const onMouseMove = (ev) => {
        const cursor = { x: ev.clientX, y: ev.clientY };
        if (startPointRef.current) {
          const dx = cursor.x - startPointRef.current.x;
          const dy = cursor.y - startPointRef.current.y;
          const distSq = dx * dx + dy * dy;
          const threshold = 12 * 12; // 12px movement threshold

          // Only mark as connecting (show button) after threshold is exceeded
          if (!connectingGestureRef.current && distSq > threshold) {
            connectingGestureRef.current = true;
            setIsConnecting(true);
          }

          const mid = { x: (startPointRef.current.x + cursor.x) / 2, y: (startPointRef.current.y + cursor.y) / 2 };
          setConnectPos(mid);
        } else {
          // No start point; show only after some movement
          if (!connectingGestureRef.current) {
            connectingGestureRef.current = true;
            setIsConnecting(true);
          }
          setConnectPos(cursor);
        }
      };

      mouseMoveRef.current = onMouseMove;
      document.addEventListener('mousemove', onMouseMove);
    }, []);

    const onConnectEnd = useCallback((event) => {
      setIsConnecting(false);
      setConnectPos(null);
      connectingGestureRef.current = false;
      // remove mousemove handler
      if (mouseMoveRef.current) {
        document.removeEventListener('mousemove', mouseMoveRef.current);
        mouseMoveRef.current = null;
      }
      startPointRef.current = null;
    }, []);

    const cancelConnection = useCallback(() => {
      // Synthesize mouseup to cancel the active connection gesture and cleanup
      try {
        document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
      } catch (err) {
        // ignore
      }
      setIsConnecting(false);
      setConnectPos(null);
      connectingGestureRef.current = false;
      if (mouseMoveRef.current) {
        document.removeEventListener('mousemove', mouseMoveRef.current);
        mouseMoveRef.current = null;
      }
      startPointRef.current = null;
    }, []);

    // Cleanup on unmount
    useEffect(() => {
      return () => {
        if (mouseMoveRef.current) {
          document.removeEventListener('mousemove', mouseMoveRef.current);
          mouseMoveRef.current = null;
        }
      };
    }, []);

    // Compute midpoint positions for all existing edges and render persistent delete buttons
    useEffect(() => {
      if (!reactFlowWrapper.current) return;

      // Delay to allow React Flow to render/update edge paths
      const id = setTimeout(() => {
        const wrapperRect = reactFlowWrapper.current.getBoundingClientRect();
        // find all edge group elements
        const edgeGroups = reactFlowWrapper.current.querySelectorAll('.react-flow__edge');
        const buttons = [];

        edgeGroups.forEach((g) => {
          try {
            const path = g.querySelector('.react-flow__edge-path');
            if (!path) return;
            // try to get edge id from group dataset or id attribute
            let edgeId = g.getAttribute('data-id') || g.getAttribute('id') || g.dataset?.id;
            // Normalize/resolve against known edges
            if (edgeId) {
              // try to find the exact matching edge id from the edges array
              const exact = edges.find((e) => e.id === edgeId || (edgeId && edgeId.includes(e.id)) || (e.id && e.id.includes(edgeId)));
              if (exact) edgeId = exact.id;
            } else {
              // fallback: try to find an edge which group contains its id in attributes
              const possible = edges.find((e) => {
                const matches = Array.from(g.attributes || []).some(attr => (attr.value || '').includes(e.id));
                return matches;
              });
              if (possible) edgeId = possible.id;
            }
            const rect = path.getBoundingClientRect();
            const left = rect.left + rect.width / 2 - wrapperRect.left;
            const top = rect.top + rect.height / 2 - wrapperRect.top;
            if (edgeId) buttons.push({ id: edgeId, left, top });
          } catch (err) {
            // ignore individual failures
          }
        });

        setEdgeButtons(buttons);
      }, 80);

      return () => clearTimeout(id);
    }, [edges, nodes, reactFlowInstance]);

    return (
        <>
        <div ref={reactFlowWrapper} style={{position: 'relative', width: '100%', height: 'calc(100vh - 120px)', backgroundColor: '#f8fafc'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
              onConnectStart={onConnectStart}
              onConnectEnd={onConnectEnd}
                onEdgeMouseEnter={(e, edge) => {
                  // show delete button near cursor when hovering an existing edge
                  setHoveredEdgeId(edge?.id || null);
                  if (e && e.clientX) setHoveredEdgePos({ x: e.clientX, y: e.clientY });
                }}
                onEdgeMouseMove={(e, edge) => {
                  if (hoveredEdgeId === edge?.id && e && e.clientX) setHoveredEdgePos({ x: e.clientX, y: e.clientY });
                }}
                onEdgeMouseLeave={() => {
                  setHoveredEdgeId(null);
                  setHoveredEdgePos(null);
                }}
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
                  style={{ 
                    backgroundColor: '#ffffff', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }} 
                />
                <MiniMap 
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
                
                {/* edge hover handlers are attached at ReactFlow level via props below */}
            </ReactFlow>
            {isConnecting && connectPos && reactFlowWrapper.current && (
              (() => {
                const wrapperRect = reactFlowWrapper.current.getBoundingClientRect();
                const left = connectPos.x - wrapperRect.left - 18; // center the 36px button
                const top = connectPos.y - wrapperRect.top - 18;
                return (
                  <button
                    aria-label="Cancel connection"
                    title="Cancel connection"
                    onClick={cancelConnection}
                    className="cancel-connection-button"
                    style={{ left: `${left}px`, top: `${top}px`, position: 'absolute' }}
                  >
                    ✕
                  </button>
                );
              })()
            )}
            {edgeButtons.map((b) => (
              <button
                key={`edge-btn-${b.id}`}
                aria-label="Delete edge"
                title="Delete edge"
                onClick={() => removeEdge(b.id)}
                className="cancel-connection-button"
                style={{ left: `${b.left - 14}px`, top: `${b.top - 14}px`, position: 'absolute', background: '#fff0f0', borderColor: '#fca5a5' }}
              >
                ✕
              </button>
            ))}
        </div>
        </>
    )
}
