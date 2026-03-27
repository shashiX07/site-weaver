// Node tree panel showing the JSON hierarchy
import React from "react";
import { EditorNode } from "@/lib/editor/types";
import { ChevronRight, ChevronDown, Box, Type, Image, Link, MousePointer2 } from "lucide-react";

interface NodeTreeProps {
  node: EditorNode;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  depth?: number;
  expandedNodes: Set<string>;
  onToggleExpand: (id: string) => void;
}

const typeIcons: Record<string, React.ElementType> = {
  container: Box,
  text: Type,
  image: Image,
  link: Link,
  button: MousePointer2,
};

const NodeTree: React.FC<NodeTreeProps> = ({
  node,
  selectedNodeId,
  onSelectNode,
  depth = 0,
  expandedNodes,
  onToggleExpand,
}) => {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedNodeId === node.id;
  const Icon = typeIcons[node.type] || Box;

  const displayLabel = node.type === "text"
    ? (node.content || "").slice(0, 20) + ((node.content || "").length > 20 ? "…" : "")
    : node.attributes?.class || node.tag || node.type;

  return (
    <div>
      <div
        className={`flex items-center gap-1 cursor-pointer rounded-md px-1.5 py-1 text-[11px] transition-colors ${
          isSelected
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => onSelectNode(node.id)}
      >
        {hasChildren ? (
          <button
            className="p-0 hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.id);
            }}
          >
            {isExpanded ? (
              <ChevronDown className="h-3 w-3" />
            ) : (
              <ChevronRight className="h-3 w-3" />
            )}
          </button>
        ) : (
          <span className="w-3" />
        )}
        <Icon className="h-3 w-3 flex-shrink-0 opacity-60" />
        <span className="truncate">{`<${node.tag || node.type}>`}</span>
        {node.type === "text" && node.content && (
          <span className="truncate text-muted-foreground/50 ml-1 italic">
            {displayLabel}
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map((child) => (
            <NodeTree
              key={child.id}
              node={child}
              selectedNodeId={selectedNodeId}
              onSelectNode={onSelectNode}
              depth={depth + 1}
              expandedNodes={expandedNodes}
              onToggleExpand={onToggleExpand}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default NodeTree;
