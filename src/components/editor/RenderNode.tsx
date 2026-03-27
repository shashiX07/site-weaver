// Recursive JSON-driven node renderer for editor canvas
import React from "react";
import { EditorNode } from "@/lib/editor/types";

interface RenderNodeProps {
  node: EditorNode;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  depth?: number;
}

const typeIcons: Record<string, string> = {
  container: "□",
  text: "T",
  image: "🖼",
  link: "🔗",
  button: "▣",
};

const RenderNode: React.FC<RenderNodeProps> = ({ node, selectedNodeId, onSelectNode, depth = 0 }) => {
  const isSelected = selectedNodeId === node.id;
  const Tag = (node.tag || "div") as keyof JSX.IntrinsicElements;

  const nodeStyle: React.CSSProperties = { ...toReactStyle(node.style || {}) };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectNode(node.id);
  };

  // Image node
  if (node.type === "image") {
    return (
      <div
        className={`relative transition-all duration-150 ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : "hover:ring-1 hover:ring-blue-300"}`}
        onClick={handleClick}
        style={{ display: "inline-block" }}
      >
        <img
          src={node.src}
          alt={node.alt || ""}
          style={nodeStyle}
          draggable={false}
        />
        {isSelected && <NodeLabel type={node.type} />}
      </div>
    );
  }

  // Container node
  if (node.type === "container") {
    return (
      <Tag
        className={`relative transition-all duration-150 ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : "hover:outline hover:outline-1 hover:outline-blue-200"}`}
        style={nodeStyle}
        onClick={handleClick}
        {...getHtmlAttributes(node)}
      >
        {isSelected && <NodeLabel type={node.type} />}
        {node.children?.map((child) => (
          <RenderNode
            key={child.id}
            node={child}
            selectedNodeId={selectedNodeId}
            onSelectNode={onSelectNode}
            depth={depth + 1}
          />
        ))}
      </Tag>
    );
  }

  // Text, link, button nodes
  return (
    <Tag
      className={`relative transition-all duration-150 ${isSelected ? "ring-2 ring-blue-500 ring-offset-1" : "hover:outline hover:outline-1 hover:outline-blue-200"}`}
      style={nodeStyle}
      onClick={handleClick}
      {...getHtmlAttributes(node)}
    >
      {isSelected && <NodeLabel type={node.type} />}
      {node.content}
      {node.children?.map((child) => (
        <RenderNode
          key={child.id}
          node={child}
          selectedNodeId={selectedNodeId}
          onSelectNode={onSelectNode}
          depth={depth + 1}
        />
      ))}
    </Tag>
  );
};

function NodeLabel({ type }: { type: string }) {
  return (
    <span className="absolute -top-5 left-0 z-50 rounded bg-blue-500 px-1.5 py-0.5 text-[9px] font-semibold text-white shadow-sm pointer-events-none">
      {type}
    </span>
  );
}

function toReactStyle(style: Record<string, string>): React.CSSProperties {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(style)) {
    result[key] = value;
  }
  return result as React.CSSProperties;
}

function getHtmlAttributes(node: EditorNode): Record<string, string> {
  const attrs: Record<string, string> = {};
  if (node.href) attrs.href = "#"; // prevent navigation in editor
  return attrs;
}

export default RenderNode;
