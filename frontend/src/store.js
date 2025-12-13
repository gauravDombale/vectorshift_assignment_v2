// store.js

import { create } from "zustand";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = create((set, get) => ({
    nodes: [],
    edges: [],
  // simple undo/redo history (snapshots of nodes+edges)
  _history: [],
  _redo: [],
  _historyMax: 50,
    nodeIDs: {},
    getNodeID: (type) => {
        const newIDs = {...(get().nodeIDs || {})};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    addNode: (node) => {
      // push snapshot before change and clear redo
      const snap = { nodes: JSON.parse(JSON.stringify(get().nodes)), edges: JSON.parse(JSON.stringify(get().edges)) };
      const h = [...get()._history, snap].slice(-get()._historyMax);
      set({ _history: h, _redo: [] });
      set({ nodes: [...get().nodes, node] });
    },
    onNodesChange: (changes) => {
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      // push snapshot before connecting and clear redo
      const snap = { nodes: JSON.parse(JSON.stringify(get().nodes)), edges: JSON.parse(JSON.stringify(get().edges)) };
      const h = [...get()._history, snap].slice(-get()._historyMax);
      set({ _history: h, _redo: [] });
      set({ edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges), });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
    updateNodeDimensions: (nodeId, width, height) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.width = width;
            node.height = height;
            node.data = { ...node.data, width, height };
          }
          return node;
        }),
      });
    },
    removeEdge: (edgeId) => {
      // push snapshot before removal and clear redo
      const snap = { nodes: JSON.parse(JSON.stringify(get().nodes)), edges: JSON.parse(JSON.stringify(get().edges)) };
      const h = [...get()._history, snap].slice(-get()._historyMax);
      set({ _history: h, _redo: [] });
      set({ edges: get().edges.filter((e) => e.id !== edgeId), });
    },
    removeNode: (nodeId) => {
      // push snapshot before removal and clear redo
      const snap = { nodes: JSON.parse(JSON.stringify(get().nodes)), edges: JSON.parse(JSON.stringify(get().edges)) };
      const h = [...get()._history, snap].slice(-get()._historyMax);
      set({ _history: h, _redo: [] });
      set({ nodes: get().nodes.filter((n) => n.id !== nodeId), edges: get().edges.filter((e) => e.source !== nodeId && e.target !== nodeId), });
    },
    // undo: revert to last snapshot and push current state to redo
    undo: () => {
      const hist = get()._history || [];
      if (!hist.length) return;
      const last = hist[hist.length - 1];
      const remaining = hist.slice(0, hist.length - 1);
      // push current state to redo stack
      const current = { nodes: JSON.parse(JSON.stringify(get().nodes)), edges: JSON.parse(JSON.stringify(get().edges)) };
      const r = [...get()._redo, current].slice(-get()._historyMax);
      set({ nodes: last.nodes || [], edges: last.edges || [], _history: remaining, _redo: r });
    },
    // redo: restore last redo snapshot and push current to history
    redo: () => {
      const rstack = get()._redo || [];
      if (!rstack.length) return;
      const last = rstack[rstack.length - 1];
      const remainingRedo = rstack.slice(0, rstack.length - 1);
      // push current state to history
      const current = { nodes: JSON.parse(JSON.stringify(get().nodes)), edges: JSON.parse(JSON.stringify(get().edges)) };
      const h = [...get()._history, current].slice(-get()._historyMax);
      set({ nodes: last.nodes || [], edges: last.edges || [], _history: h, _redo: remainingRedo });
    },
  }));
