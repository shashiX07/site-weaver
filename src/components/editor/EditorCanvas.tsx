// Iframe-based editor canvas — renders template HTML inside an isolated iframe
// with selection highlighting via postMessage. Template styles CANNOT leak out.
import React, { useEffect, useRef, useCallback } from "react";
import { EditorDocument } from "@/lib/editor/types";
import { editorNodeToHtml } from "@/lib/editor/store";

interface EditorCanvasProps {
  document: EditorDocument;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  className?: string;
}

const EDITOR_INJECTION_SCRIPT = `
<script>
(function() {
  // Selection highlighting
  let selectedId = null;

  function clearSelection() {
    document.querySelectorAll('[data-editor-id]').forEach(el => {
      el.style.outline = '';
      el.style.outlineOffset = '';
    });
    const label = document.getElementById('__editor-label');
    if (label) label.remove();
  }

  function highlight(id) {
    clearSelection();
    selectedId = id;
    if (!id) return;
    const el = document.querySelector('[data-editor-id="' + id + '"]');
    if (el) {
      el.style.outline = '2px solid #3b82f6';
      el.style.outlineOffset = '2px';
      // Add label
      const label = document.createElement('div');
      label.id = '__editor-label';
      label.textContent = el.tagName.toLowerCase();
      label.style.cssText = 'position:absolute;background:#3b82f6;color:#fff;font-size:10px;font-family:Inter,sans-serif;padding:1px 6px;border-radius:3px;pointer-events:none;z-index:99999;font-weight:600;';
      const rect = el.getBoundingClientRect();
      label.style.top = (window.scrollY + rect.top - 18) + 'px';
      label.style.left = (window.scrollX + rect.left) + 'px';
      document.body.appendChild(label);
    }
  }

  // Hover effect
  let hoveredEl = null;
  document.addEventListener('mouseover', function(e) {
    const target = e.target.closest('[data-editor-id]');
    if (hoveredEl && hoveredEl !== target) {
      if (!hoveredEl.dataset.editorId || hoveredEl.dataset.editorId !== selectedId) {
        hoveredEl.style.outline = '';
        hoveredEl.style.outlineOffset = '';
      }
    }
    if (target && target.dataset.editorId !== selectedId) {
      target.style.outline = '1px dashed #93c5fd';
      target.style.outlineOffset = '1px';
    }
    hoveredEl = target;
  });

  document.addEventListener('mouseout', function(e) {
    const target = e.target.closest('[data-editor-id]');
    if (target && target.dataset.editorId !== selectedId) {
      target.style.outline = '';
      target.style.outlineOffset = '';
    }
  });

  // Click to select
  document.addEventListener('click', function(e) {
    e.preventDefault();
    e.stopPropagation();
    const target = e.target.closest('[data-editor-id]');
    if (target) {
      const id = target.dataset.editorId;
      highlight(id);
      window.parent.postMessage({ type: 'editor-select', nodeId: id }, '*');
    } else {
      clearSelection();
      window.parent.postMessage({ type: 'editor-select', nodeId: null }, '*');
    }
  }, true);

  // Listen for highlight commands from parent
  window.addEventListener('message', function(e) {
    if (e.data && e.data.type === 'editor-highlight') {
      highlight(e.data.nodeId);
    }
  });
})();
<\/script>
`;

const EditorCanvas: React.FC<EditorCanvasProps> = ({
  document: doc,
  selectedNodeId,
  onSelectNode,
  className,
}) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const prevSelectedRef = useRef<string | null>(null);

  // Listen for postMessage from iframe
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === "editor-select") {
        onSelectNode(e.data.nodeId);
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [onSelectNode]);

  // Build iframe content
  useEffect(() => {
    if (!iframeRef.current) return;

    const html = editorNodeToHtml(doc.root);
    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    /* Prevent text selection in editor mode */
    * { user-select: none; -webkit-user-select: none; }
    [data-editor-id] { cursor: pointer; transition: outline 0.15s ease; }
    ${doc.styles}
  </style>
</head>
<body>
  ${html}
  ${EDITOR_INJECTION_SCRIPT}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [doc]);

  // Sync selection highlight to iframe
  useEffect(() => {
    if (prevSelectedRef.current !== selectedNodeId && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.postMessage(
        { type: "editor-highlight", nodeId: selectedNodeId },
        "*"
      );
      prevSelectedRef.current = selectedNodeId;
    }
  }, [selectedNodeId]);

  return (
    <iframe
      ref={iframeRef}
      className={className}
      sandbox="allow-scripts allow-same-origin"
      title="Editor Canvas"
      style={{ border: "none", width: "100%", height: "100%" }}
    />
  );
};

export default EditorCanvas;
