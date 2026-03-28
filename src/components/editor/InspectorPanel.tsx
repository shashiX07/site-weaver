// Inspector panel for the new payload schema
import React, { useState } from "react";
import { EditorNode, isEditorText, isEditorElement, EditorTextNode, EditorElementNode } from "@/lib/editor/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ChevronUp, ChevronDown, Copy, MousePointer2 } from "lucide-react";

interface InspectorPanelProps {
  node: EditorNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<EditorNode>) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onMoveNode: (nodeId: string, direction: "up" | "down") => void;
  onAddChild: (parentId: string, tag: string) => void;
}

const addableTags = [
  { tag: "div", label: "Div" },
  { tag: "p", label: "Paragraph" },
  { tag: "h2", label: "Heading" },
  { tag: "span", label: "Span" },
  { tag: "a", label: "Link" },
  { tag: "button", label: "Button" },
  { tag: "img", label: "Image" },
  { tag: "_text", label: "Text Node" },
];

const InspectorPanel: React.FC<InspectorPanelProps> = ({
  node,
  onUpdateNode,
  onDeleteNode,
  onDuplicateNode,
  onMoveNode,
  onAddChild,
}) => {
  if (!node) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-6">
        <MousePointer2 className="h-8 w-8 text-muted-foreground/30 mb-3" />
        <p className="text-sm font-medium text-muted-foreground">No element selected</p>
        <p className="text-xs text-muted-foreground/60 mt-1">Click any element on the canvas to inspect and edit it</p>
      </div>
    );
  }

  const isText = isEditorText(node);
  const isElement = isEditorElement(node);

  return (
    <div className="flex flex-col h-full">
      {/* Node header */}
      <div className="border-b border-border p-3">
        <div className="flex items-center justify-between">
          <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary tracking-wider">
            {isText ? "text" : (node as EditorElementNode).tag}
          </span>
          <span className="text-xs text-muted-foreground font-mono">{node._id.slice(0, 10)}</span>
        </div>
        <div className="flex gap-1 mt-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs flex-1" onClick={() => onMoveNode(node._id, "up")}>
            <ChevronUp className="h-3 w-3 mr-1" /> Up
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs flex-1" onClick={() => onMoveNode(node._id, "down")}>
            <ChevronDown className="h-3 w-3 mr-1" /> Down
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onDuplicateNode(node._id)}>
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => onDeleteNode(node._id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-5">
        {/* Text node editing */}
        {isText && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Text Content</h4>
            <Textarea
              value={(node as EditorTextNode).text}
              onChange={(e) => onUpdateNode(node._id, { text: e.target.value } as any)}
              className="text-xs font-mono"
              rows={4}
            />
          </div>
        )}

        {/* Element node editing */}
        {isElement && (
          <>
            {/* Tag */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Element</h4>
              <div className="space-y-2">
                <Label className="text-xs">HTML Tag</Label>
                <select
                  className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
                  value={(node as EditorElementNode).tag}
                  onChange={(e) => onUpdateNode(node._id, { tag: e.target.value } as any)}
                >
                  {["div", "section", "article", "header", "footer", "nav", "main", "aside",
                    "h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "a", "button",
                    "ul", "ol", "li", "blockquote", "img", "figure", "figcaption",
                  ].map((t) => (
                    <option key={t} value={t}>{`<${t}>`}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Attributes */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Attributes</h4>
              <AttributesEditor
                attributes={(node as EditorElementNode).attributes}
                onChange={(attrs) => onUpdateNode(node._id, { attributes: attrs } as any)}
              />
            </div>

            {/* Add children */}
            <div className="space-y-3">
              <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Add Child</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {addableTags.map(({ tag, label }) => (
                  <Button
                    key={tag}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs justify-start"
                    onClick={() => onAddChild(node._id, tag)}
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {label}
                  </Button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// --- Attributes sub-editor ---
function AttributesEditor({
  attributes,
  onChange,
}: {
  attributes: Record<string, string | string[]>;
  onChange: (attrs: Record<string, string | string[]>) => void;
}) {
  const [newKey, setNewKey] = useState("");
  const [newVal, setNewVal] = useState("");

  const entries = Object.entries(attributes);

  const updateAttr = (key: string, value: string) => {
    // class is stored as array
    if (key === "class") {
      onChange({ ...attributes, [key]: value.split(" ").filter(Boolean) });
    } else {
      onChange({ ...attributes, [key]: value });
    }
  };

  const removeAttr = (key: string) => {
    const next = { ...attributes };
    delete next[key];
    onChange(next);
  };

  const addAttr = () => {
    if (newKey) {
      updateAttr(newKey, newVal);
      setNewKey("");
      setNewVal("");
    }
  };

  return (
    <div className="space-y-2">
      {entries.map(([key, val]) => {
        const displayVal = Array.isArray(val) ? val.join(" ") : val;
        return (
          <div key={key} className="flex items-center gap-1">
            <span className="text-xs font-mono text-muted-foreground w-16 shrink-0 truncate">{key}</span>
            <Input
              value={displayVal}
              onChange={(e) => updateAttr(key, e.target.value)}
              className="flex-1 text-xs h-7 font-mono"
            />
            <button
              className="text-[10px] text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => removeAttr(key)}
            >
              ✕
            </button>
          </div>
        );
      })}
      <div className="flex gap-1 pt-1 border-t border-border">
        <Input
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          className="flex-1 text-xs h-7 font-mono"
          placeholder="attr"
        />
        <Input
          value={newVal}
          onChange={(e) => setNewVal(e.target.value)}
          className="flex-1 text-xs h-7 font-mono"
          placeholder="value"
        />
        <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={addAttr}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default InspectorPanel;
