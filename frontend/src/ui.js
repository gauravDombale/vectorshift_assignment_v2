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
      onNodesChange: storeOnNodesChange,
      onEdgesChange,
      onConnect
    } = useStore(useShallow(selector));
    const removeNode = useStore((s) => s.removeNode);

    const [edgeButtons, setEdgeButtons] = useState([]);
    const [alignGuides, setAlignGuides] = useState([]);

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
      // Function to compute midpoint positions for all existing edges
      const computeEdgeButtons = useCallback(() => {
        if (!reactFlowWrapper.current) return [];
        const wrapperRect = reactFlowWrapper.current.getBoundingClientRect();
        const edgeGroups = reactFlowWrapper.current.querySelectorAll('.react-flow__edge');
        const buttons = [];

        edgeGroups.forEach((g) => {
          try {
            const path = g.querySelector('.react-flow__edge-path');
            if (!path) return;
            let edgeId = g.getAttribute('data-id') || g.getAttribute('id') || g.dataset?.id;
            // Normalize/resolve against known edges
            if (edgeId) {
              const exact = edges.find((e) => e.id === edgeId || (edgeId && edgeId.includes(e.id)) || (e.id && e.id.includes(edgeId)));
              if (exact) edgeId = exact.id;
            } else {
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

        return buttons;
      }, [edges]);

      // Initial compute and update
      useEffect(() => {
        const buttons = computeEdgeButtons();
        setEdgeButtons(buttons);
        // also schedule a short-delayed recompute to handle async SVG render
        const id = setTimeout(() => setEdgeButtons(computeEdgeButtons()), 120);
        return () => clearTimeout(id);
      }, [computeEdgeButtons, nodes, reactFlowInstance]);

      // Keep edge button positions in sync with panning/zooming by polling periodically
      useEffect(() => {
        let raf = null;
        let last = 0;
        const tick = (t) => {
          // throttle to ~60ms
          if (t - last > 60) {
            const buttons = computeEdgeButtons();
            setEdgeButtons(buttons);
            last = t;
          }
          raf = requestAnimationFrame(tick);
        };

        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
      }, [computeEdgeButtons]);

    // Keyboard shortcuts: copy/cut/paste/delete/duplicate
    const copiedRef = useRef(null);
    useEffect(() => {
      const onKeyDown = (e) => {
        // Ignore shortcuts when user is typing in inputs, textareas, or contenteditable elements
        const active = document.activeElement;
        if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) return;

        const cmd = e.ctrlKey || e.metaKey;

        // Undo (Ctrl/Cmd+Z)
        if (cmd && !e.shiftKey && e.key.toLowerCase() === 'z') {
          try {
            const store = useStore.getState();
            if (store && typeof store.undo === 'function') store.undo();
          } catch (err) {
            // ignore
          }
          e.preventDefault();
          return;
        }
        // Redo (Ctrl/Cmd+Shift+Z)
        if (cmd && e.shiftKey && e.key.toLowerCase() === 'z') {
          try {
            const store = useStore.getState();
            if (store && typeof store.redo === 'function') store.redo();
          } catch (err) {
            // ignore
          }
          e.preventDefault();
          return;
        }

        // Copy (Ctrl/Cmd+C)
        if (cmd && e.key.toLowerCase() === 'c') {
          if (!reactFlowInstance) return;
          const selNodes = reactFlowInstance.getNodes().filter(n => n.selected);
          if (selNodes.length > 0) {
            // store deep clone of nodes and inter-edges
            const selIds = selNodes.map(n => n.id);
            const nodesClone = selNodes.map(n => ({ ...n, data: { ...n.data } }));
            const relatedEdges = edges.filter(ed => selIds.includes(ed.source) && selIds.includes(ed.target));
            copiedRef.current = { nodes: nodesClone, edges: relatedEdges };
            e.preventDefault();
          }
        }

        // Paste (Ctrl/Cmd+V)
        if (cmd && e.key.toLowerCase() === 'v') {
          if (!copiedRef.current) return;
          const { nodes: copiedNodes, edges: copiedEdges } = copiedRef.current;
          const map = {};
          const offset = 40;
          const createdIds = [];
          copiedNodes.forEach((n, idx) => {
            const newId = getNodeID(n.type || n.data?.nodeType || 'custom');
            map[n.id] = newId;
            createdIds.push(newId);
            const newNode = {
              id: newId,
              type: n.type || n.data?.nodeType || 'custom',
              position: { x: (n.position?.x || 0) + offset * (idx + 1), y: (n.position?.y || 0) + offset * (idx + 1) },
              data: { ...n.data },
            };
            addNode(newNode);
          });
          // recreate edges among copied nodes
          copiedEdges.forEach((ed) => {
            const conn = { source: map[ed.source], target: map[ed.target], sourceHandle: ed.sourceHandle, targetHandle: ed.targetHandle };
            onConnect(conn);
          });

          // Update selection: deselect originals, select new nodes only
          try {
            const store = useStore.getState();
            const updated = store.nodes.map((nd) => {
              if (copiedNodes.some(orig => orig.id === nd.id)) return { ...nd, selected: false };
              if (createdIds.includes(nd.id)) return { ...nd, selected: true };
              return nd;
            });
            useStore.setState({ nodes: updated });

            // Also update React Flow's internal nodes and clear any active drag
            setTimeout(() => {
              try {
                if (reactFlowInstance && typeof reactFlowInstance.setNodes === 'function') {
                  const rfNodes = reactFlowInstance.getNodes().map((nd) => {
                    if (copiedNodes.some(orig => orig.id === nd.id)) return { ...nd, selected: false };
                    if (createdIds.includes(nd.id)) return { ...nd, selected: true };
                    return { ...nd, selected: false };
                  });
                  reactFlowInstance.setNodes(rfNodes);
                }
                document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
              } catch (err) {
                // ignore
              }
            }, 10);
          } catch (err) {
            // ignore if selection update fails
          }

          e.preventDefault();
        }

        // Delete selected (Delete or Backspace)
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (!reactFlowInstance) return;
          const selNodes = reactFlowInstance.getNodes().filter(n => n.selected);
          const selEdges = reactFlowInstance.getEdges().filter(ed => ed.selected);
          selNodes.forEach(n => removeNode(n.id));
          selEdges.forEach(ed => {
            // use store removeEdge
            useStore.getState().removeEdge(ed.id);
          });
          e.preventDefault();
        }

        // Duplicate (Ctrl/Cmd+D)
        if (cmd && e.key.toLowerCase() === 'd') {
          if (!reactFlowInstance) return;
          const selNodes = reactFlowInstance.getNodes().filter(n => n.selected);
          if (selNodes.length === 0) return;
          const map = {};
          const createdIds = [];
          selNodes.forEach((n, idx) => {
            const newId = getNodeID(n.type || n.data?.nodeType || 'custom');
            map[n.id] = newId;
            createdIds.push(newId);
            const newNode = {
              id: newId,
              type: n.type || n.data?.nodeType || 'custom',
              position: { x: n.position.x + 20, y: n.position.y + 20 },
              data: { ...n.data },
            };
            addNode(newNode);
          });
          // duplicate internal edges
          const selIds = selNodes.map(n => n.id);
          const relatedEdges = edges.filter(ed => selIds.includes(ed.source) && selIds.includes(ed.target));
          relatedEdges.forEach(ed => onConnect({ source: map[ed.source], target: map[ed.target], sourceHandle: ed.sourceHandle, targetHandle: ed.targetHandle }));

          // Update selection: deselect originals, select new nodes only
          try {
            const store = useStore.getState();
            const updated = store.nodes.map((nd) => {
              if (selIds.includes(nd.id)) return { ...nd, selected: false };
              if (createdIds.includes(nd.id)) return { ...nd, selected: true };
              return nd;
            });
            useStore.setState({ nodes: updated });

            // Also update React Flow's internal nodes and clear any active drag
            setTimeout(() => {
              try {
                if (reactFlowInstance && typeof reactFlowInstance.setNodes === 'function') {
                  const rfNodes = reactFlowInstance.getNodes().map((nd) => {
                    if (selIds.includes(nd.id)) return { ...nd, selected: false };
                    if (createdIds.includes(nd.id)) return { ...nd, selected: true };
                    return { ...nd, selected: false };
                  });
                  reactFlowInstance.setNodes(rfNodes);
                }
                document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
              } catch (err) {
                // ignore
              }
            }, 10);
          } catch (err) {
            // ignore
          }

          e.preventDefault();
        }
      };

      window.addEventListener('keydown', onKeyDown);
      return () => window.removeEventListener('keydown', onKeyDown);
    }, [reactFlowInstance, edges, getNodeID, addNode, onConnect, removeNode]);

    return (
        <>
        <div ref={reactFlowWrapper} style={{position: 'relative', width: '100%', height: 'calc(100vh - 120px)', backgroundColor: '#f8fafc'}}>
            <ReactFlow
                nodes={nodes}
                edges={edges}
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
                onNodeDragStop={() => { setAlignGuides([]); }}
                onNodesChange={(changes) => {
                  // forward to store
                  try { storeOnNodesChange(changes); } catch (err) { }

                  // compute alignment guides if a node position changed
                  if (!reactFlowWrapper.current) return;
                  const posChange = (changes || []).find(c => c.type === 'position');
                  if (!posChange) return setAlignGuides([]);

                  const movingId = posChange.id;
                  const wrapperRect = reactFlowWrapper.current.getBoundingClientRect();

                  const movingEl = reactFlowWrapper.current.querySelector(`[data-id="${movingId}"]`);
                  if (!movingEl) return setAlignGuides([]);

                  const movedRect = movingEl.getBoundingClientRect();
                  const moved = {
                    left: movedRect.left - wrapperRect.left,
                    right: movedRect.right - wrapperRect.left,
                    top: movedRect.top - wrapperRect.top,
                    bottom: movedRect.bottom - wrapperRect.top,
                    centerX: movedRect.left - wrapperRect.left + movedRect.width / 2,
                    centerY: movedRect.top - wrapperRect.top + movedRect.height / 2,
                  };

                  const threshold = 8; // px tolerance
                  const guides = [];

                  // iterate other nodes
                  const nodeEls = reactFlowWrapper.current.querySelectorAll('.react-flow__node');
                  nodeEls.forEach((el) => {
                    const id = el.getAttribute('data-id') || el.getAttribute('id') || el.dataset?.id;
                    if (!id || id === movingId) return;
                    const r = el.getBoundingClientRect();
                    const other = {
                      left: r.left - wrapperRect.left,
                      right: r.right - wrapperRect.left,
                      top: r.top - wrapperRect.top,
                      bottom: r.bottom - wrapperRect.top,
                      centerX: r.left - wrapperRect.left + r.width / 2,
                      centerY: r.top - wrapperRect.top + r.height / 2,
                    };

                    // vertical align checks (left, center, right)
                    const vChecks = [
                      { a: moved.left, b: other.left },
                      { a: moved.centerX, b: other.centerX },
                      { a: moved.right, b: other.right },
                    ];
                    vChecks.forEach((c) => {
                      if (Math.abs(c.a - c.b) <= threshold) {
                        const x = Math.round((c.a + c.b) / 2);
                        const from = Math.min(moved.top, other.top) - 8;
                        const to = Math.max(moved.bottom, other.bottom) + 8;
                        guides.push({ orientation: 'vertical', x, from, to });
                      }
                    });

                    // horizontal align checks (top, center, bottom)
                    const hChecks = [
                      { a: moved.top, b: other.top },
                      { a: moved.centerY, b: other.centerY },
                      { a: moved.bottom, b: other.bottom },
                    ];
                    hChecks.forEach((c) => {
                      if (Math.abs(c.a - c.b) <= threshold) {
                        const y = Math.round((c.a + c.b) / 2);
                        const from = Math.min(moved.left, other.left) - 8;
                        const to = Math.max(moved.right, other.right) + 8;
                        guides.push({ orientation: 'horizontal', y, from, to });
                      }
                    });
                  });

                  setAlignGuides(guides);
                }}
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
                {/* alignment guide overlays */}
                {alignGuides.map((g, idx) => (
                  g.orientation === 'vertical' ? (
                    <div key={`guide-v-${idx}`} style={{ position: 'absolute', left: `${g.x}px`, top: `${g.from}px`, height: `${g.to - g.from}px`, width: 1, background: 'rgba(67,56,202,0.9)', zIndex: 70 }} />
                  ) : (
                    <div key={`guide-h-${idx}`} style={{ position: 'absolute', top: `${g.y}px`, left: `${g.from}px`, width: `${g.to - g.from}px`, height: 1, background: 'rgba(67,56,202,0.9)', zIndex: 70 }} />
                  )
                ))}
                
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
