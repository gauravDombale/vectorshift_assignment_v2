// BaseNode.js
// Base abstraction component for all nodes - clean, professional design

import { useState, useRef, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { nodeStyles } from '../styles/nodeStyles';
import { theme } from '../styles/theme';
import { useStore } from '../store';
import useHandlePositions from '../hooks/useHandlePositions';

// initial

export const BaseNode = ({ 
  id, 
  data,
  title,
  icon: Icon,
  handles = [],
  content,
  width: initialWidth = 200,
  height: initialHeight = 'auto',
  minWidth = 160,
  minHeight = 80,
  style = {},
  className = ''
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [editedTitle, setEditedTitle] = useState(data?.customName || title);
  const [dimensions, setDimensions] = useState({ 
    width: typeof initialWidth === 'number' ? initialWidth : 200, 
    height: initialHeight === 'auto' ? null : initialHeight 
  });
  const containerRef = useRef(null);
  const titleInputRef = useRef(null);
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const startSize = useRef({ width: 0, height: 0 });
  
  const updateNodeField = useStore((state) => state.updateNodeField);
  const updateNodeDimensions = useStore((state) => state.updateNodeDimensions);

  // Update editedTitle when data.customName changes
  useEffect(() => {
    setEditedTitle(data?.customName || title);
  }, [data?.customName, title]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Initialize dimensions from stored data when available
  useEffect(() => {
    if (data?.width || data?.height) {
      setDimensions({
        width: typeof data.width === 'number' ? data.width : dimensions.width,
        height: typeof data.height === 'number' ? data.height : dimensions.height,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Handle resize
  const onResizeStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    isResizing.current = true;
    startPos.current = { x: e.clientX, y: e.clientY };
    startSize.current = { 
      width: dimensions.width, 
      height: containerRef.current?.offsetHeight || dimensions.height || 100 
    };
    
    document.addEventListener('mousemove', onResizeMove);
    document.addEventListener('mouseup', onResizeEnd);
  };

  const onResizeMove = (e) => {
    if (!isResizing.current) return;
    
    const deltaX = e.clientX - startPos.current.x;
    const deltaY = e.clientY - startPos.current.y;
    
    const newWidth = Math.max(minWidth, startSize.current.width + deltaX);
    const newHeight = Math.max(minHeight, startSize.current.height + deltaY);
    
    setDimensions({ width: newWidth, height: newHeight });
  };

  const onResizeEnd = () => {
    isResizing.current = false;
    document.removeEventListener('mousemove', onResizeMove);
    document.removeEventListener('mouseup', onResizeEnd);
    // Persist dimensions to global store
    try {
      const finalHeight = containerRef.current?.offsetHeight || dimensions.height;
      updateNodeDimensions(id, dimensions.width, finalHeight);
    } catch (err) {
      // ignore
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', onResizeMove);
      document.removeEventListener('mouseup', onResizeEnd);
    };
  }, []);

  const containerStyle = {
    width: dimensions.width,
    minHeight: dimensions.height || minHeight,
    ...nodeStyles.container,
    ...(isHovered ? nodeStyles.containerHover : {}),
    position: 'relative',
    ...style
  };

  const leftHandles = handles.filter(h => h.position === Position.Left || h.position === 'left');
  const rightHandles = handles.filter(h => h.position === Position.Right || h.position === 'right');

  // Compute positions via helper
  const leftPositions = useHandlePositions(leftHandles.length);
  const rightPositions = useHandlePositions(rightHandles.length);

  // Handle title editing
  const handleTitleDoubleClick = (e) => {
    e.stopPropagation();
    setIsEditingTitle(true);
  };

  const handleTitleChange = (e) => {
    setEditedTitle(e.target.value);
  };

  const handleTitleBlur = () => {
    setIsEditingTitle(false);
    if (editedTitle.trim()) {
      updateNodeField(id, 'customName', editedTitle.trim());
    } else {
      setEditedTitle(title);
    }
  };

  const handleTitleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleTitleBlur();
    } else if (e.key === 'Escape') {
      setEditedTitle(data?.customName || title);
      setIsEditingTitle(false);
    }
  };

  const displayTitle = data?.customName || title;

  return (
    <div 
      ref={containerRef}
      style={containerStyle} 
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Input handles (left side) */}
      {leftHandles.map((handle, index) => {
        const topPos = handle.style?.top || leftPositions[index] || '50%';
        return (
          <Handle
            key={`input-${handle.id || index}`}
            type="target"
            position={Position.Left}
            id={handle.id || `${id}-${handle.name || `input-${index}`}`}
            style={{
              width: '12px',
              height: '12px',
              background: theme.colors.handleInput,
              border: `2px solid ${theme.colors.surface}`,
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
              top: topPos,
              left: '-6px',
              cursor: 'crosshair',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              zIndex: 10,
            }}
            className="react-flow__handle-left"
          />
        );
      })}
      
      {/* Header with icon - editable title */}
      {title && (
        <div 
          style={nodeStyles.header}
          onDoubleClick={handleTitleDoubleClick}
          title="Double-click to rename"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === 'F2') {
              e.preventDefault();
              setIsEditingTitle(true);
            }
          }}
        >
          {Icon && <Icon size={16} style={nodeStyles.headerIcon} />}
          {isEditingTitle ? (
            <input
              ref={titleInputRef}
              type="text"
              value={editedTitle}
              onChange={handleTitleChange}
              onBlur={handleTitleBlur}
              onKeyDown={handleTitleKeyDown}
              className="nodrag"
              aria-label="Node title"
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.4)',
                borderRadius: '4px',
                color: 'inherit',
                fontSize: 'inherit',
                fontWeight: 'inherit',
                padding: '2px 6px',
                outline: 'none',
                width: '100%',
                minWidth: '60px',
              }}
            />
          ) : (
            <span style={{ cursor: 'text' }} role="button" aria-label={`Node: ${displayTitle}`}>{displayTitle}</span>
          )}
        </div>
      )}
      
      {/* Content */}
      <div style={nodeStyles.content}>
        {content}
      </div>
      
      {/* Output handles (right side) */}
      {rightHandles.map((handle, index) => {
        const topPos = handle.style?.top || rightPositions[index] || '50%';
        return (
          <Handle
            key={`output-${handle.id || index}`}
            type="source"
            position={Position.Right}
            id={handle.id || `${id}-${handle.name || `output-${index}`}`}
            style={{
              width: '12px',
              height: '12px',
              background: theme.colors.handleOutput,
              border: `2px solid ${theme.colors.surface}`,
              boxShadow: '0 1px 4px rgba(0, 0, 0, 0.2)',
              top: topPos,
              right: '-6px',
              cursor: 'crosshair',
              transition: 'transform 0.15s ease, box-shadow 0.15s ease',
              zIndex: 10,
            }}
            className="react-flow__handle-right"
          />
        );
      })}

      {/* Resize handle */}
      <div
        className="nodrag nopan"
        onMouseDown={onResizeStart}
        style={{
          position: 'absolute',
          bottom: '4px',
          right: '4px',
          width: '12px',
          height: '12px',
          cursor: 'nwse-resize',
          background: 'transparent',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 5,
          borderRadius: '2px',
        }}
      >
        <svg 
          width="8" 
          height="8" 
          viewBox="0 0 8 8" 
          style={{ 
            opacity: isHovered ? 0.6 : 0.25,
            transition: 'opacity 0.2s',
          }}
        >
          <path 
            d="M7 1L1 7M7 4L4 7" 
            stroke="#94a3b8" 
            strokeWidth="1.5" 
            strokeLinecap="round"
          />
        </svg>
      </div>
    </div>
  );
};

