import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Save, Eye, Globe, Undo, Redo, Monitor, Smartphone, Tablet,
  Layers, Code, Sparkles, X,
} from "lucide-react";
import {
  getWebsiteById, updateWebsiteContent, updateWebsite, publishWebsite,
} from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

import {
  EditorDocument, EditorNode, EditorMode,
  isEditorText, isEditorElement, EditorElementNode,
} from "@/lib/editor/types";
import {
  findNode, updateNodeInTree, deleteNodeFromTree,
  addChildToNode, moveNodeInTree, duplicateNodeInTree,
} from "@/lib/editor/store";
import { loadTemplate, dummyTemplates, createBlankElement } from "@/lib/editor/templates";
import EditorCanvas from "@/components/editor/EditorCanvas";
import InspectorPanel from "@/components/editor/InspectorPanel";
import PreviewFrame from "@/components/editor/PreviewFrame";
import NodeTree from "@/components/editor/NodeTree";

type Viewport = "desktop" | "tablet" | "mobile";

const viewportWidths: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const Editor = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [website, setWebsite] = useState(id ? getWebsiteById(id) : null);
  const [editorDoc, setEditorDoc] = useState<EditorDocument | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [mode, setMode] = useState<EditorMode>("editor");
  const [hasChanges, setHasChanges] = useState(false);
  const [showJsonPanel, setShowJsonPanel] = useState(false);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  // Template selector (when no website loaded)
  const [templateIndex, setTemplateIndex] = useState(0);

  // History for undo/redo
  const [history, setHistory] = useState<EditorDocument[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Load document
  useEffect(() => {
    let doc: EditorDocument;

    if (id) {
      // Try loading saved editor doc from localStorage
      const savedKey = `tp_editor_doc_v2_${id}`;
      const saved = localStorage.getItem(savedKey);
      if (saved) {
        try {
          doc = JSON.parse(saved);
        } catch {
          doc = loadTemplate(0);
        }
      } else {
        doc = loadTemplate(0);
      }
      const w = getWebsiteById(id);
      if (w) setWebsite(w);
    } else {
      doc = loadTemplate(templateIndex);
    }

    setEditorDoc(doc);
    setHistory([doc]);
    setHistoryIdx(0);

    // Auto-expand root
    const expanded = new Set<string>();
    if (isEditorElement(doc.root)) {
      expanded.add(doc.root._id);
      (doc.root as EditorElementNode).children.forEach((c) => expanded.add(c._id));
    }
    setExpandedNodes(expanded);
  }, [id, templateIndex]);

  const selectedNode = useMemo(() => {
    if (!editorDoc || !selectedNodeId) return null;
    return findNode(editorDoc.root, selectedNodeId);
  }, [editorDoc, selectedNodeId]);

  const pushHistory = useCallback((newDoc: EditorDocument) => {
    setHistory((prev) => {
      const trimmed = prev.slice(0, historyIdx + 1);
      const next = [...trimmed, newDoc];
      if (next.length > 50) next.shift();
      return next;
    });
    setHistoryIdx((prev) => Math.min(prev + 1, 49));
  }, [historyIdx]);

  const updateDoc = useCallback((newDoc: EditorDocument) => {
    setEditorDoc(newDoc);
    setHasChanges(true);
    pushHistory(newDoc);
  }, [pushHistory]);

  const undo = () => {
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1;
      setHistoryIdx(newIdx);
      setEditorDoc(history[newIdx]);
      setHasChanges(true);
    }
  };

  const redo = () => {
    if (historyIdx < history.length - 1) {
      const newIdx = historyIdx + 1;
      setHistoryIdx(newIdx);
      setEditorDoc(history[newIdx]);
      setHasChanges(true);
    }
  };

  // Core operations
  const handleUpdateNode = useCallback((nodeId: string, updates: Partial<EditorNode>) => {
    if (!editorDoc) return;
    const newRoot = updateNodeInTree(editorDoc.root, nodeId, updates);
    updateDoc({ ...editorDoc, root: newRoot });
  }, [editorDoc, updateDoc]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    if (!editorDoc || nodeId === editorDoc.root._id) return;
    const newRoot = deleteNodeFromTree(editorDoc.root, nodeId);
    updateDoc({ ...editorDoc, root: newRoot });
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }, [editorDoc, updateDoc, selectedNodeId]);

  const handleDuplicateNode = useCallback((nodeId: string) => {
    if (!editorDoc || nodeId === editorDoc.root._id) return;
    const newRoot = duplicateNodeInTree(editorDoc.root, nodeId);
    updateDoc({ ...editorDoc, root: newRoot });
  }, [editorDoc, updateDoc]);

  const handleMoveNode = useCallback((nodeId: string, direction: "up" | "down") => {
    if (!editorDoc) return;
    const newRoot = moveNodeInTree(editorDoc.root, nodeId, direction);
    updateDoc({ ...editorDoc, root: newRoot });
  }, [editorDoc, updateDoc]);

  const handleAddChild = useCallback((parentId: string, tag: string) => {
    if (!editorDoc) return;
    const newNode = createBlankElement(tag);
    const newRoot = addChildToNode(editorDoc.root, parentId, newNode);
    updateDoc({ ...editorDoc, root: newRoot });
    setSelectedNodeId(newNode._id);
    setExpandedNodes((prev) => new Set([...prev, parentId]));
  }, [editorDoc, updateDoc]);

  const handleToggleExpand = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  // Save & Publish
  const handleSave = () => {
    if (id && editorDoc) {
      const key = `tp_editor_doc_v2_${id}`;
      localStorage.setItem(key, JSON.stringify(editorDoc));
      if (website) updateWebsiteContent(id, website.content);
      setHasChanges(false);
      toast({ title: "Saved!", description: "Your changes have been saved." });
    }
  };

  const handlePublish = () => {
    if (id && website && editorDoc) {
      const key = `tp_editor_doc_v2_${id}`;
      localStorage.setItem(key, JSON.stringify(editorDoc));
      updateWebsiteContent(id, website.content);
      publishWebsite(id);
      setWebsite({ ...website, status: "Published" });
      setHasChanges(false);
      toast({ title: "Published! 🎉", description: `Your website is now live at ${website.url}` });
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "s") { e.preventDefault(); handleSave(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) { e.preventDefault(); undo(); }
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && e.shiftKey) { e.preventDefault(); redo(); }
      if (e.key === "Escape") { setMode("editor"); setSelectedNodeId(null); }
      if (e.key === "Delete" && selectedNodeId && editorDoc && selectedNodeId !== editorDoc.root._id) {
        handleDeleteNode(selectedNodeId);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  if (!editorDoc) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      {/* Top Toolbar */}
      <header className="flex h-12 items-center justify-between border-b border-border bg-background px-3">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link to="/my-websites"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="h-4 w-px bg-border" />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={undo} disabled={historyIdx <= 0}>
            <Undo className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={redo} disabled={historyIdx >= history.length - 1}>
            <Redo className="h-3.5 w-3.5" />
          </Button>
          <div className="h-4 w-px bg-border" />
          {(["desktop", "tablet", "mobile"] as Viewport[]).map((v) => (
            <Button key={v} variant={viewport === v ? "secondary" : "ghost"} size="icon" className="h-7 w-7" onClick={() => setViewport(v)}>
              {v === "desktop" && <Monitor className="h-3.5 w-3.5" />}
              {v === "tablet" && <Tablet className="h-3.5 w-3.5" />}
              {v === "mobile" && <Smartphone className="h-3.5 w-3.5" />}
            </Button>
          ))}
          {/* Template switcher (when no website ID) */}
          {!id && (
            <>
              <div className="h-4 w-px bg-border" />
              <select
                className="rounded border border-input bg-background px-2 py-1 text-xs"
                value={templateIndex}
                onChange={(e) => {
                  setTemplateIndex(Number(e.target.value));
                  setSelectedNodeId(null);
                }}
              >
                {dummyTemplates.map((t, i) => (
                  <option key={i} value={i}>{t.name}</option>
                ))}
              </select>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-semibold text-foreground">
            {website?.name || dummyTemplates[templateIndex]?.name || "Editor"}
          </span>
          {hasChanges && <span className="h-2 w-2 rounded-full bg-orange-400" />}
        </div>

        <div className="flex items-center gap-1.5">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${mode === "editor" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
              onClick={() => setMode("editor")}
            >
              Editor
            </button>
            <button
              className={`px-3 py-1.5 text-xs font-medium transition-colors ${mode === "preview" ? "bg-primary text-primary-foreground" : "bg-background text-muted-foreground hover:text-foreground"}`}
              onClick={() => setMode("preview")}
            >
              Preview
            </button>
          </div>
          <div className="h-4 w-px bg-border" />
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowJsonPanel(!showJsonPanel)} title="View JSON">
            <Code className="h-3.5 w-3.5" />
          </Button>
          {id && (
            <>
              <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleSave} disabled={!hasChanges}>
                <Save className="mr-1.5 h-3 w-3" /> Save
              </Button>
              <Button size="sm" className="h-7 text-xs" onClick={handlePublish}>
                <Globe className="mr-1.5 h-3 w-3" /> Publish
              </Button>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Node Tree */}
        {mode === "editor" && (
          <div className="hidden w-56 flex-col border-r border-border bg-background lg:flex">
            <div className="border-b border-border px-3 py-2">
              <h3 className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                <Layers className="h-3 w-3" /> Element Tree
              </h3>
            </div>
            <div className="flex-1 overflow-auto py-1 px-1">
              <NodeTree
                node={editorDoc.root}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                expandedNodes={expandedNodes}
                onToggleExpand={handleToggleExpand}
              />
            </div>
          </div>
        )}

        {/* Center - Canvas or Preview */}
        <div className="flex flex-1 flex-col items-center overflow-auto bg-muted/50 p-4 lg:p-6">
          {mode === "preview" ? (
            <div
              className="w-full rounded-xl border border-border bg-white shadow-lg overflow-hidden transition-all duration-300 flex-1"
              style={{ maxWidth: viewportWidths[viewport] }}
            >
              <PreviewFrame document={editorDoc} className="w-full h-full min-h-[600px]" />
            </div>
          ) : (
            <div
              className="w-full rounded-xl border border-border bg-white shadow-lg overflow-hidden transition-all duration-300 flex-1"
              style={{ maxWidth: viewportWidths[viewport] }}
            >
              {/* Browser chrome */}
              <div className="border-b border-border px-3 py-2 flex items-center gap-2 bg-muted/30">
                <div className="h-2 w-2 rounded-full bg-destructive/40" />
                <div className="h-2 w-2 rounded-full bg-orange-400/40" />
                <div className="h-2 w-2 rounded-full bg-green-400/40" />
                <div className="ml-2 flex-1 rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                  {website?.url || "template-preview.local"}
                </div>
              </div>
              {/* Iframe canvas — fully isolated */}
              <EditorCanvas
                document={editorDoc}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                className="w-full min-h-[500px]"
              />
            </div>
          )}
        </div>

        {/* Right Panel - Inspector */}
        {mode === "editor" && (
          <div className="hidden w-72 flex-col border-l border-border bg-background lg:flex">
            <InspectorPanel
              node={selectedNode}
              onUpdateNode={handleUpdateNode}
              onDeleteNode={handleDeleteNode}
              onDuplicateNode={handleDuplicateNode}
              onMoveNode={handleMoveNode}
              onAddChild={handleAddChild}
            />
            {website && (
              <div className="border-t border-border p-3 space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Site Name</Label>
                  <Input value={website.name} onChange={(e) => {
                    const updated = updateWebsite(website.id, { name: e.target.value });
                    if (updated) setWebsite(updated);
                  }} className="text-xs h-7" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Status</span>
                  <span className={`text-xs font-medium ${website.status === "Published" ? "text-green-600" : "text-muted-foreground"}`}>
                    {website.status}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* JSON Panel (overlay) */}
        {showJsonPanel && (
          <div className="absolute right-0 top-12 bottom-0 w-[480px] z-50 border-l border-border bg-background shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">JSON Document</h3>
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setShowJsonPanel(false)}>
                <X className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex-1 overflow-auto p-3">
              <pre className="text-[10px] leading-relaxed font-mono text-muted-foreground whitespace-pre-wrap break-all">
                {JSON.stringify(editorDoc, null, 2)}
              </pre>
            </div>
            <div className="border-t border-border p-3 space-y-2">
              <Label className="text-xs font-bold">Custom CSS</Label>
              <textarea
                className="w-full rounded border border-input bg-muted/50 p-2 text-[11px] font-mono text-foreground min-h-[80px] resize-y"
                value={editorDoc.styles}
                onChange={(e) => updateDoc({ ...editorDoc, styles: e.target.value })}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
