// draggableNode.js

import { useState } from 'react';
import { 
  Upload, Download, Bot, Type, GitBranch, 
  Wand2, Filter, Merge, Split 
} from 'lucide-react';
import { getTheme } from './styles/theme';
import { useStore } from './store';
import { useShallow } from 'zustand/react/shallow';

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
  const { themeMode } = useStore(useShallow((s) => ({ themeMode: s.themeMode })));
  const theme = getTheme(themeMode || 'light');

    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };
  
    const baseStyle = {
      cursor: 'grab', 
      minWidth: '90px', 
      padding: '10px 16px',
      display: 'flex', 
      alignItems: 'center', 
      gap: '8px',
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surface,
      justifyContent: 'center', 
      transition: `all ${theme.transitions.fast}`,
      boxShadow: theme.shadows.sm,
      border: `1px solid ${theme.colors.border}`,
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
          {Icon && <Icon size={16} color={theme.colors.primary} />}
          <span style={{ 
            color: theme.colors.text,
            fontWeight: '500',
            fontSize: '13px'
          }}>
            {label}
          </span>
      </div>
    );
}
  