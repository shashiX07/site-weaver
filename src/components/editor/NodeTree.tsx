// Node tree panel showing the JSON hierarchy (new payload schema)
import React from "react";
import { EditorNode, isEditorText, isEditorElement } from "@/lib/editor/types";
import { ChevronRight, ChevronDown, Box, Type } from "lucide-react";

interface NodeTreeProps {
  node: EditorNode;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  depth?: number;
  expandedNodes: Set<string>;
  onToggleExpand: (id: string) => void;
}

const NodeTree: React.FC<NodeTreeProps> = ({
  node,
  selectedNodeId,
  onSelectNode,
  depth = 0,
  expandedNodes,
  onToggleExpand,
}) => {
  const isSelected = selectedNodeId === node._id;

  // Text node
  if (isEditorText(node)) {
    const preview = node.text.length > 25 ? node.text.slice(0, 25) + "…" : node.text;
    return (
      <div
        className={`flex items-center gap-1 cursor-pointer rounded-md px-1.5 py-1 text-[11px] transition-colors ${
          isSelected
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => onSelectNode(node._id)}
      >
        <span className="w-3" />
        <Type className="h-3 w-3 flex-shrink-0 opacity-60" />
        <span className="truncate italic opacity-70">"{preview}"</span>
      </div>
    );
  }

  // Element node
  const el = node;
  if (!isEditorElement(el)) return null;

  const hasChildren = el.children && el.children.length > 0;
  const isExpanded = expandedNodes.has(el._id);
  const classAttr = el.attributes.class;
  const classStr = Array.isArray(classAttr) ? classAttr.join(" ") : classAttr || "";

  return (
    <div>
      <div
        className={`flex items-center gap-1 cursor-pointer rounded-md px-1.5 py-1 text-[11px] transition-colors ${
          isSelected
            ? "bg-primary/10 text-primary font-medium"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        }`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => onSelectNode(el._id)}
      >
        {hasChildren ? (
          <button
            className="p-0 hover:text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(el._id);
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
        <Box className="h-3 w-3 flex-shrink-0 opacity-60" />
        <span className="truncate font-mono">{`<${el.tag}>`}</span>
        {classStr && (
          <span className="truncate text-muted-foreground/50 ml-1 text-[10px]">
            .{classStr.split(" ")[0]}
          </span>
        )}
      </div>
      {hasChildren && isExpanded && (
        <div>
          {el.children.map((child) => (
            <NodeTree
              key={child._id}
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
