// draggableNode.js

import { useState } from 'react';
import { 
  Upload, Download, Bot, Type, GitBranch, 
  Wand2, Filter, Merge, Split 
} from 'lucide-react';
import { theme } from './styles/theme';

const nodeIcons = {
  customInput: Upload,
  customOutput: Download,
  llm: Bot,
  text: Type,
  conditional: GitBranch,
  transform: Wand2,
  filter: Filter,
  merge: Merge,
  split: Split,
};

export const DraggableNode = ({ type, label }) => {
    const [isHovered, setIsHovered] = useState(false);
    const Icon = nodeIcons[type];

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    const baseStyle = {
      cursor: 'grab', 
      minWidth: 'clamp(70px, 10vw, 90px)', 
      padding: 'clamp(6px, 1.5vw, 10px) clamp(10px, 2vw, 16px)',
      display: 'flex', 
      alignItems: 'center', 
      gap: 'clamp(4px, 1vw, 8px)',
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center', 
      transition: `all ${theme.transitions.fast}`,
      boxShadow: theme.shadows.sm,
      border: `1px solid ${theme.colors.border}`,
      flexShrink: 0,
    };

    const hoverStyle = {
      borderColor: theme.colors.primary,
      boxShadow: theme.shadows.md,
      transform: 'translateY(-2px)',
    };
  
    return (
      <div
        className={type}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => {
          event.target.style.cursor = 'grab';
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ 
          ...baseStyle,
          ...(isHovered ? hoverStyle : {})
        }} 
        draggable
      >
          {Icon && <Icon size={14} color={theme.colors.primary} style={{ flexShrink: 0 }} />}
          <span style={{ 
            color: theme.colors.text,
            fontWeight: '500',
            fontSize: 'clamp(11px, 1.5vw, 13px)',
            whiteSpace: 'nowrap',
          }}>
            {label}
          </span>
      </div>
    );
}
  