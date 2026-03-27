// Centralized editor state store using React context pattern
import { EditorDocument, EditorNode } from "./types";

// Deep clone helper
function clone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// Find a node by ID in the tree
export function findNode(root: EditorNode, id: string): EditorNode | null {
  if (root.id === id) return root;
  if (root.children) {
    for (const child of root.children) {
      const found = findNode(child, id);
      if (found) return found;
    }
  }
  return null;
}

// Find parent of a node
export function findParent(root: EditorNode, id: string): EditorNode | null {
  if (root.children) {
    for (const child of root.children) {
      if (child.id === id) return root;
      const found = findParent(child, id);
      if (found) return found;
    }
  }
  return null;
}

// Immutably update a node by ID
export function updateNodeInTree(
  root: EditorNode,
  nodeId: string,
  updates: Partial<EditorNode>
): EditorNode {
  if (root.id === nodeId) {
    return { ...root, ...updates };
  }
  if (root.children) {
    return {
      ...root,
      children: root.children.map((child) =>
        updateNodeInTree(child, nodeId, updates)
      ),
    };
  }
  return root;
}

// Delete a node by ID
export function deleteNodeFromTree(root: EditorNode, nodeId: string): EditorNode {
  if (root.id === nodeId) return root; // can't delete root
  if (root.children) {
    return {
      ...root,
      children: root.children
        .filter((child) => child.id !== nodeId)
        .map((child) => deleteNodeFromTree(child, nodeId)),
    };
  }
  return root;
}

// Add a child node to a container
export function addChildToNode(
  root: EditorNode,
  parentId: string,
  newNode: EditorNode,
  index?: number
): EditorNode {
  if (root.id === parentId && root.type === "container") {
    const children = [...(root.children || [])];
    if (index !== undefined) {
      children.splice(index, 0, newNode);
    } else {
      children.push(newNode);
    }
    return { ...root, children };
  }
  if (root.children) {
    return {
      ...root,
      children: root.children.map((child) =>
        addChildToNode(child, parentId, newNode, index)
      ),
    };
  }
  return root;
}

// Move a node up or down among siblings
export function moveNodeInTree(
  root: EditorNode,
  nodeId: string,
  direction: "up" | "down"
): EditorNode {
  if (root.children) {
    const idx = root.children.findIndex((c) => c.id === nodeId);
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
      children: root.children.map((child) =>
        moveNodeInTree(child, nodeId, direction)
      ),
    };
  }
  return root;
}

// Duplicate a node (sibling copy)
export function duplicateNodeInTree(
  root: EditorNode,
  nodeId: string,
  genId: () => string
): EditorNode {
  if (root.children) {
    const idx = root.children.findIndex((c) => c.id === nodeId);
    if (idx >= 0) {
      const original = root.children[idx];
      const dup = reIdNode(clone(original), genId);
      const children = [...root.children];
      children.splice(idx + 1, 0, dup);
      return { ...root, children };
    }
    return {
      ...root,
      children: root.children.map((child) =>
        duplicateNodeInTree(child, nodeId, genId)
      ),
    };
  }
  return root;
}

function reIdNode(node: EditorNode, genId: () => string): EditorNode {
  node.id = genId();
  if (node.children) {
    node.children = node.children.map((c) => reIdNode(c, genId));
  }
  return node;
}

// Convert JSON layout to HTML string for preview
export function layoutToHtml(node: EditorNode): string {
  const tag = node.tag || (node.type === "container" ? "div" : node.type === "text" ? "span" : node.type === "image" ? "img" : node.type === "link" ? "a" : "button");

  const attrs: string[] = [];
  if (node.attributes) {
    Object.entries(node.attributes).forEach(([k, v]) => {
      attrs.push(`${k}="${escapeHtml(v)}"`);
    });
  }
  if (node.style) {
    const styleStr = Object.entries(node.style)
      .map(([k, v]) => `${camelToKebab(k)}: ${v}`)
      .join("; ");
    attrs.push(`style="${escapeHtml(styleStr)}"`);
  }
  if (node.src) attrs.push(`src="${escapeHtml(node.src)}"`);
  if (node.alt) attrs.push(`alt="${escapeHtml(node.alt)}"`);
  if (node.href) attrs.push(`href="${escapeHtml(node.href)}"`);
  if (node.action?.type === "custom_js" && node.action.function) {
    attrs.push(`onclick="${node.action.function}()"`);
  }

  const attrStr = attrs.length ? " " + attrs.join(" ") : "";

  if (tag === "img") {
    return `<${tag}${attrStr} />`;
  }

  const childrenHtml = node.children
    ? node.children.map(layoutToHtml).join("")
    : "";
  const content = node.content || "";

  return `<${tag}${attrStr}>${content}${childrenHtml}</${tag}>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function camelToKebab(str: string): string {
  return str.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
}

// Generate unique ID
export function genEditorId(): string {
  return "n_" + Math.random().toString(36).substring(2, 8) + Date.now().toString(36);
}
