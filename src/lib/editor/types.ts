// JSON-driven editor schema types

export type NodeType = "container" | "text" | "image" | "link" | "button";

export interface EditorAction {
  type: "custom_js" | "link" | "none";
  function?: string;
  url?: string;
}

export interface EditorNode {
  id: string;
  type: NodeType;
  tag?: string;
  content?: string;
  src?: string;
  alt?: string;
  href?: string;
  editable?: boolean;
  attributes?: Record<string, string>;
  children?: EditorNode[];
  action?: EditorAction;
  style?: Record<string, string>;
}

export interface EditorDocument {
  layout: EditorNode;
  styles: string;
  scripts: string[];
}

export type EditorMode = "editor" | "preview";
