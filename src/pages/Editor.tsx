import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft, Save, Eye, Globe, Undo, Redo, Monitor, Smartphone, Tablet,
  Layers, Code, Sparkles, Menu, X,
} from "lucide-react";
import {
  getWebsiteById, updateWebsiteContent, updateWebsite, publishWebsite,
} from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

import { EditorDocument, EditorNode, EditorMode } from "@/lib/editor/types";
import {
  findNode, updateNodeInTree, deleteNodeFromTree,
  addChildToNode, moveNodeInTree, duplicateNodeInTree, genEditorId,
} from "@/lib/editor/store";
import { sectionsToEditorDocument, createBlankNode } from "@/lib/editor/templates";
import RenderNode from "@/components/editor/RenderNode";
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

  // History for undo/redo
  const [history, setHistory] = useState<EditorDocument[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Load document from website sections
  useEffect(() => {
    if (id) {
      const w = getWebsiteById(id);
      if (w) {
        setWebsite(w);
        const doc = sectionsToEditorDocument(w.content?.sections || [], w.name);
        setEditorDoc(doc);
        setHistory([doc]);
        setHistoryIdx(0);
        // Auto-expand root and first-level children
        const expanded = new Set<string>(["root"]);
        doc.layout.children?.forEach((c) => expanded.add(c.id));
        setExpandedNodes(expanded);
      }
    }
  }, [id]);

  const selectedNode = useMemo(() => {
    if (!editorDoc || !selectedNodeId) return null;
    return findNode(editorDoc.layout, selectedNodeId);
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
    const newLayout = updateNodeInTree(editorDoc.layout, nodeId, updates);
    updateDoc({ ...editorDoc, layout: newLayout });
  }, [editorDoc, updateDoc]);

  const handleDeleteNode = useCallback((nodeId: string) => {
    if (!editorDoc || nodeId === "root") return;
    const newLayout = deleteNodeFromTree(editorDoc.layout, nodeId);
    updateDoc({ ...editorDoc, layout: newLayout });
    if (selectedNodeId === nodeId) setSelectedNodeId(null);
  }, [editorDoc, updateDoc, selectedNodeId]);

  const handleDuplicateNode = useCallback((nodeId: string) => {
    if (!editorDoc || nodeId === "root") return;
    const newLayout = duplicateNodeInTree(editorDoc.layout, nodeId, genEditorId);
    updateDoc({ ...editorDoc, layout: newLayout });
  }, [editorDoc, updateDoc]);

  const handleMoveNode = useCallback((nodeId: string, direction: "up" | "down") => {
    if (!editorDoc) return;
    const newLayout = moveNodeInTree(editorDoc.layout, nodeId, direction);
    updateDoc({ ...editorDoc, layout: newLayout });
  }, [editorDoc, updateDoc]);

  const handleAddChild = useCallback((parentId: string, type: EditorNode["type"]) => {
    if (!editorDoc) return;
    const newNode = createBlankNode(type);
    const newLayout = addChildToNode(editorDoc.layout, parentId, newNode);
    updateDoc({ ...editorDoc, layout: newLayout });
    setSelectedNodeId(newNode.id);
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
    if (id && website && editorDoc) {
      // Save the editor doc as a JSON blob in localStorage alongside sections
      const key = `tp_editor_doc_${id}`;
      localStorage.setItem(key, JSON.stringify(editorDoc));
      updateWebsiteContent(id, website.content);
      setHasChanges(false);
      toast({ title: "Saved!", description: "Your changes have been saved." });
    }
  };

  const handlePublish = () => {
    if (id && website && editorDoc) {
      const key = `tp_editor_doc_${id}`;
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
      if (e.key === "Escape") setMode("editor");
      if (e.key === "Delete" && selectedNodeId && selectedNodeId !== "root") handleDeleteNode(selectedNodeId);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const handleUpdateStyles = (newStyles: string) => {
    if (!editorDoc) return;
    updateDoc({ ...editorDoc, styles: newStyles });
  };

  const handleUpdateScripts = (newScripts: string) => {
    if (!editorDoc) return;
    try {
      const arr = newScripts.split("\n---\n");
      updateDoc({ ...editorDoc, scripts: arr });
    } catch {
      // ignore parse errors
    }
  };

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
        </div>

        <div className="flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-sm font-semibold text-foreground">{website?.name || "Editor"}</span>
          {hasChanges && <span className="h-2 w-2 rounded-full bg-orange-400" />}
        </div>

        <div className="flex items-center gap-1.5">
          {/* Mode toggle */}
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
          <Button variant="outline" size="sm" className="h-7 text-xs" onClick={handleSave} disabled={!hasChanges}>
            <Save className="mr-1.5 h-3 w-3" /> Save
          </Button>
          <Button size="sm" className="h-7 text-xs" onClick={handlePublish}>
            <Globe className="mr-1.5 h-3 w-3" /> Publish
          </Button>
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
                node={editorDoc.layout}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
                expandedNodes={expandedNodes}
                onToggleExpand={handleToggleExpand}
              />
            </div>
          </div>
        )}

        {/* Center - Canvas or Preview */}
        <div
          className="flex flex-1 flex-col items-center overflow-auto bg-muted/50 p-4 lg:p-6"
          onClick={() => mode === "editor" && setSelectedNodeId(null)}
        >
          {mode === "preview" ? (
            <div
              className="w-full rounded-xl border border-border bg-white shadow-lg overflow-hidden transition-all duration-300 flex-1"
              style={{ maxWidth: viewportWidths[viewport] }}
            >
              <PreviewFrame document={editorDoc} className="w-full h-full min-h-[600px]" />
            </div>
          ) : (
            <div
              className="w-full rounded-xl border border-border bg-white shadow-lg overflow-hidden transition-all duration-300"
              style={{ maxWidth: viewportWidths[viewport] }}
            >
              {/* Browser chrome */}
              <div className="border-b border-border px-3 py-2 flex items-center gap-2 bg-muted/30">
                <div className="h-2 w-2 rounded-full bg-destructive/40" />
                <div className="h-2 w-2 rounded-full bg-orange-400/40" />
                <div className="h-2 w-2 rounded-full bg-green-400/40" />
                <div className="ml-2 flex-1 rounded bg-muted px-2 py-0.5 text-[10px] text-muted-foreground">
                  {website?.url || "yoursite.templatepro.com"}
                </div>
              </div>
              {/* Canvas */}
              <div className="min-h-[400px]">
                <RenderNode
                  node={editorDoc.layout}
                  selectedNodeId={selectedNodeId}
                  onSelectNode={setSelectedNodeId}
                />
              </div>
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
            {/* Website info */}
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
                onChange={(e) => handleUpdateStyles(e.target.value)}
              />
              <Label className="text-xs font-bold">Scripts (separated by ---)</Label>
              <textarea
                className="w-full rounded border border-input bg-muted/50 p-2 text-[11px] font-mono text-foreground min-h-[60px] resize-y"
                value={editorDoc.scripts.join("\n---\n")}
                onChange={(e) => handleUpdateScripts(e.target.value)}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Editor;
