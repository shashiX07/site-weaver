// Editor tree operations for new payload schema
import {
  PayloadNode, PayloadElementNode, PayloadTextNode,
  EditorNode, EditorElementNode, EditorTextNode,
  isEditorText, isEditorElement, isTextNode,
} from "./types";

// --- ID generation ---
let _counter = 0;
export function genEditorId(): string {
  return "n_" + (++_counter).toString(36) + "_" + Date.now().toString(36);
}

// --- Hydrate payload with internal IDs ---
export function hydratePayload(node: PayloadNode): EditorNode {
  if (isTextNode(node)) {
    return { _id: genEditorId(), text: node.text } as EditorTextNode;
  }
  const el = node as PayloadElementNode;
  return {
    _id: genEditorId(),
    tag: el.tag,
    attributes: { ...el.attributes },
    children: (el.children || []).map(hydratePayload),
  } as EditorElementNode;
}

// --- Strip IDs to get clean payload ---
export function dehydrateNode(node: EditorNode): PayloadNode {
  if (isEditorText(node)) {
    return { text: node.text } as PayloadTextNode;
  }
  const el = node as EditorElementNode;
  return {
    tag: el.tag,
    attributes: { ...el.attributes },
    children: el.children.map(dehydrateNode),
  } as PayloadElementNode;
}

// --- Find node by ID ---
export function findNode(root: EditorNode, id: string): EditorNode | null {
  if (root._id === id) return root;
  if (isEditorElement(root)) {
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
}

// --- Update node immutably ---
export function updateNodeInTree(
  root: EditorNode,
  nodeId: string,
  updates: Partial<EditorTextNode> | Partial<EditorElementNode>
): EditorNode {
  if (root._id === nodeId) {
    return { ...root, ...updates } as EditorNode;
  }
  if (isEditorElement(root)) {
    return {
      ...root,
      children: root.children.map((c) => updateNodeInTree(c, nodeId, updates)),
    };
  }
  return root;
}

// --- Delete node by ID ---
export function deleteNodeFromTree(root: EditorNode, nodeId: string): EditorNode {
  if (root._id === nodeId) return root; // can't delete root
  if (isEditorElement(root)) {
    return {
      ...root,
      children: root.children
        .filter((c) => c._id !== nodeId)
        .map((c) => deleteNodeFromTree(c, nodeId)),
    };
  }
  return root;
}

// --- Add child to element node ---
export function addChildToNode(
  root: EditorNode,
  parentId: string,
  newNode: EditorNode
): EditorNode {
  if (root._id === parentId && isEditorElement(root)) {
    return { ...root, children: [...root.children, newNode] };
  }
  if (isEditorElement(root)) {
    return {
      ...root,
      children: root.children.map((c) => addChildToNode(c, parentId, newNode)),
    };
  }
  return root;
}

// --- Move node among siblings ---
export function moveNodeInTree(
  root: EditorNode,
  nodeId: string,
  direction: "up" | "down"
): EditorNode {
  if (isEditorElement(root)) {
    const idx = root.children.findIndex((c) => c._id === nodeId);
    if (idx >= 0) {
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx >= 0 && newIdx < root.children.length) {
        const children = [...root.children];
        [children[idx], children[newIdx]] = [children[newIdx], children[idx]];
        return { ...root, children };
      }
      return root;
    }
    return {
      ...root,
      children: root.children.map((c) => moveNodeInTree(c, nodeId, direction)),
    };
  }
  return root;
}

// --- Duplicate node ---
export function duplicateNodeInTree(root: EditorNode, nodeId: string): EditorNode {
  if (isEditorElement(root)) {
    const idx = root.children.findIndex((c) => c._id === nodeId);
    if (idx >= 0) {
      const dup = reId(JSON.parse(JSON.stringify(root.children[idx])));
      const children = [...root.children];
      children.splice(idx + 1, 0, dup);
      return { ...root, children };
    }
    return {
      ...root,
      children: root.children.map((c) => duplicateNodeInTree(c, nodeId)),
    };
  }
  return root;
}

function reId(node: EditorNode): EditorNode {
  node._id = genEditorId();
  if (isEditorElement(node)) {
    node.children = node.children.map(reId);
  }
  return node;
}

// --- Convert editor node tree to HTML string ---
export function editorNodeToHtml(node: EditorNode): string {
  if (isEditorText(node)) {
    return escapeHtml(node.text);
  }
  const el = node as EditorElementNode;
  const attrs: string[] = [];
  if (el.attributes) {
    for (const [k, v] of Object.entries(el.attributes)) {
      const val = Array.isArray(v) ? v.join(" ") : v;
      attrs.push(`${k}="${escapeHtml(val)}"`);
    }
  }
  // Add data-id for selection
  attrs.push(`data-editor-id="${el._id}"`);
  const attrStr = attrs.length ? " " + attrs.join(" ") : "";
  const voidTags = new Set(["img", "br", "hr", "input", "meta", "link"]);
  if (voidTags.has(el.tag)) {
    return `<${el.tag}${attrStr} />`;
  }
  const childrenHtml = el.children.map(editorNodeToHtml).join("");
  return `<${el.tag}${attrStr}>${childrenHtml}</${el.tag}>`;
}

function escapeHtml(str: string): string {
  return str.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
