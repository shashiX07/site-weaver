// New JSON payload schema types

// Raw payload format (from API response)
export interface PayloadTextNode {
  text: string;
}

export interface PayloadElementNode {
  tag: string;
  attributes: Record<string, string | string[]>;
  children: PayloadNode[];
}

export type PayloadNode = PayloadTextNode | PayloadElementNode;

// Type guards
export function isTextNode(node: PayloadNode): node is PayloadTextNode {
  return "text" in node;
}

export function isElementNode(node: PayloadNode): node is PayloadElementNode {
  return "tag" in node;
}

// Internal editor node with IDs for selection/editing
export interface EditorTextNode {
  _id: string;
  text: string;
}

export interface EditorElementNode {
  _id: string;
  tag: string;
  attributes: Record<string, string | string[]>;
  children: EditorNode[];
}

export type EditorNode = EditorTextNode | EditorElementNode;

export function isEditorText(node: EditorNode): node is EditorTextNode {
  return "text" in node;
}

export function isEditorElement(node: EditorNode): node is EditorElementNode {
  return "tag" in node;
}

// Editor document wrapping the hydrated tree
export interface EditorDocument {
  root: EditorNode;
  styles: string;
  scripts: string[];
}

export type EditorMode = "editor" | "preview";
