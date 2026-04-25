import { useState } from 'react';
import type { TreeNode, TreeData } from '@mcp-interactive-ui/types';

export interface TreeBlockProps {
  data: TreeData;
  className?: string;
}

function TreeNodeComponent({ node, depth = 0, expandAll }: { node: TreeNode; depth?: number; expandAll?: boolean }): JSX.Element {
  const [expanded, setExpanded] = useState(node.expanded || expandAll || false);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="select-none">
      <div className="flex items-center gap-2 py-1 px-2 hover:bg-muted rounded cursor-pointer">
        {hasChildren ? (
          <button
            onClick={() => setExpanded(!expanded)}
            className="w-5 h-5 flex items-center justify-center text-muted-foreground hover:text-foreground"
          >
            {expanded ? '▼' : '▶'}
          </button>
        ) : (
          <div className="w-5" />
        )}

        {node.icon && <span className="text-lg">{node.icon}</span>}

        <span className={node.disabled ? 'opacity-50 cursor-not-allowed' : ''}>
          {node.label}
        </span>
      </div>

      {hasChildren && expanded && (
        <div className="ml-4 border-l border-muted">
          {node.children!.map((child: TreeNode) => (
            <TreeNodeComponent
              key={child.id}
              node={child}
              depth={depth + 1}
              expandAll={expandAll}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function TreeBlock({ data, className }: TreeBlockProps): JSX.Element {
  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'}>
      {data.title && (
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold">{data.title}</h3>
        </div>
      )}

      <div className={data.title ? 'px-6 pb-6' : 'p-6'}>
        {data.nodes.map((node) => (
          <TreeNodeComponent
            key={node.id}
            node={node}
            expandAll={data.expandAll}
          />
        ))}
      </div>
    </div>
  );
}
