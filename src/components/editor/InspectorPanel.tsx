// Inspector panel for editing selected node properties
import React from "react";
import { EditorNode } from "@/lib/editor/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, ChevronUp, ChevronDown, Copy, Type, Image, Link, MousePointer2, Box } from "lucide-react";

interface InspectorPanelProps {
  node: EditorNode | null;
  onUpdateNode: (nodeId: string, updates: Partial<EditorNode>) => void;
  onDeleteNode: (nodeId: string) => void;
  onDuplicateNode: (nodeId: string) => void;
  onMoveNode: (nodeId: string, direction: "up" | "down") => void;
  onAddChild: (parentId: string, type: EditorNode["type"]) => void;
}

const styleProperties = [
  { key: "fontSize", label: "Font Size", type: "text" },
  { key: "fontWeight", label: "Font Weight", type: "select", options: ["400", "500", "600", "700", "800"] },
  { key: "color", label: "Text Color", type: "color" },
  { key: "backgroundColor", label: "Background", type: "color" },
  { key: "padding", label: "Padding", type: "text" },
  { key: "margin", label: "Margin", type: "text" },
  { key: "borderRadius", label: "Border Radius", type: "text" },
  { key: "opacity", label: "Opacity", type: "text" },
  { key: "textAlign", label: "Text Align", type: "select", options: ["left", "center", "right", "justify"] },
  { key: "display", label: "Display", type: "select", options: ["block", "flex", "grid", "inline", "inline-block", "none"] },
  { key: "gap", label: "Gap", type: "text" },
  { key: "maxWidth", label: "Max Width", type: "text" },
  { key: "width", label: "Width", type: "text" },
  { key: "height", label: "Height", type: "text" },
];

const addableTypes: { type: EditorNode["type"]; label: string; icon: React.ElementType }[] = [
  { type: "container", label: "Container", icon: Box },
  { type: "text", label: "Text", icon: Type },
  { type: "image", label: "Image", icon: Image },
  { type: "link", label: "Link", icon: Link },
  { type: "button", label: "Button", icon: MousePointer2 },
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

  const updateStyle = (key: string, value: string) => {
    onUpdateNode(node.id, {
      style: { ...(node.style || {}), [key]: value },
    });
  };

  const removeStyle = (key: string) => {
    const newStyle = { ...(node.style || {}) };
    delete newStyle[key];
    onUpdateNode(node.id, { style: newStyle });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Node header */}
      <div className="border-b border-border p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase text-primary tracking-wider">
              {node.type}
            </span>
            <span className="text-xs text-muted-foreground font-mono">{node.id.slice(0, 10)}</span>
          </div>
        </div>
        {/* Actions */}
        <div className="flex gap-1 mt-2">
          <Button variant="ghost" size="sm" className="h-7 text-xs flex-1" onClick={() => onMoveNode(node.id, "up")}>
            <ChevronUp className="h-3 w-3 mr-1" /> Up
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs flex-1" onClick={() => onMoveNode(node.id, "down")}>
            <ChevronDown className="h-3 w-3 mr-1" /> Down
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => onDuplicateNode(node.id)}>
            <Copy className="h-3 w-3" />
          </Button>
          <Button variant="ghost" size="sm" className="h-7 text-xs text-destructive hover:text-destructive" onClick={() => onDeleteNode(node.id)}>
            <Trash2 className="h-3 w-3" />
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-5">
        {/* Content editing */}
        {(node.type === "text" || node.type === "button" || node.type === "link") && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Content</h4>
            <div className="space-y-2">
              <Label className="text-xs">Text Content</Label>
              {(node.content?.length || 0) > 60 ? (
                <Textarea
                  value={node.content || ""}
                  onChange={(e) => onUpdateNode(node.id, { content: e.target.value })}
                  className="text-xs"
                  rows={3}
                />
              ) : (
                <Input
                  value={node.content || ""}
                  onChange={(e) => onUpdateNode(node.id, { content: e.target.value })}
                  className="text-xs h-8"
                />
              )}
            </div>
            {node.tag && (
              <div className="space-y-2">
                <Label className="text-xs">HTML Tag</Label>
                <select
                  className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
                  value={node.tag}
                  onChange={(e) => onUpdateNode(node.id, { tag: e.target.value })}
                >
                  {node.type === "text" && ["h1", "h2", "h3", "h4", "h5", "h6", "p", "span", "div", "blockquote"].map((t) => (
                    <option key={t} value={t}>{`<${t}>`}</option>
                  ))}
                  {node.type === "button" && ["button", "a"].map((t) => (
                    <option key={t} value={t}>{`<${t}>`}</option>
                  ))}
                  {node.type === "link" && ["a", "span"].map((t) => (
                    <option key={t} value={t}>{`<${t}>`}</option>
                  ))}
                </select>
              </div>
            )}
          </div>
        )}

        {/* Image properties */}
        {node.type === "image" && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Image</h4>
            <div className="space-y-2">
              <Label className="text-xs">Source URL</Label>
              <Input
                value={node.src || ""}
                onChange={(e) => onUpdateNode(node.id, { src: e.target.value })}
                className="text-xs h-8"
                placeholder="https://..."
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Alt Text</Label>
              <Input
                value={node.alt || ""}
                onChange={(e) => onUpdateNode(node.id, { alt: e.target.value })}
                className="text-xs h-8"
              />
            </div>
            {node.src && (
              <div className="rounded-lg border border-border overflow-hidden">
                <img src={node.src} alt={node.alt || ""} className="w-full h-auto" />
              </div>
            )}
          </div>
        )}

        {/* Link properties */}
        {(node.type === "link" || (node.type === "button" && node.tag === "a")) && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Link</h4>
            <div className="space-y-2">
              <Label className="text-xs">URL</Label>
              <Input
                value={node.href || ""}
                onChange={(e) => onUpdateNode(node.id, { href: e.target.value })}
                className="text-xs h-8"
                placeholder="https://..."
              />
            </div>
          </div>
        )}

        {/* Button action */}
        {node.type === "button" && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Action</h4>
            <div className="space-y-2">
              <Label className="text-xs">Action Type</Label>
              <select
                className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
                value={node.action?.type || "none"}
                onChange={(e) => onUpdateNode(node.id, { action: { ...node.action, type: e.target.value as any } })}
              >
                <option value="none">None</option>
                <option value="custom_js">Custom JS</option>
                <option value="link">Navigate</option>
              </select>
            </div>
            {node.action?.type === "custom_js" && (
              <div className="space-y-2">
                <Label className="text-xs">Function Name</Label>
                <Input
                  value={node.action?.function || ""}
                  onChange={(e) => onUpdateNode(node.id, { action: { ...node.action!, function: e.target.value } })}
                  className="text-xs h-8 font-mono"
                  placeholder="myFunction"
                />
              </div>
            )}
            {node.action?.type === "link" && (
              <div className="space-y-2">
                <Label className="text-xs">URL</Label>
                <Input
                  value={node.action?.url || ""}
                  onChange={(e) => onUpdateNode(node.id, { action: { ...node.action!, url: e.target.value } })}
                  className="text-xs h-8"
                  placeholder="https://..."
                />
              </div>
            )}
          </div>
        )}

        {/* Attributes */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Attributes</h4>
          <div className="space-y-2">
            <Label className="text-xs">CSS Class</Label>
            <Input
              value={node.attributes?.class || ""}
              onChange={(e) =>
                onUpdateNode(node.id, {
                  attributes: { ...(node.attributes || {}), class: e.target.value },
                })
              }
              className="text-xs h-8 font-mono"
              placeholder="my-class"
            />
          </div>
        </div>

        {/* Style properties */}
        <div className="space-y-3">
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Styles</h4>
          {styleProperties.map(({ key, label, type, options }) => {
            const value = node.style?.[key] || "";
            return (
              <div key={key} className="space-y-1">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">{label}</Label>
                  {value && (
                    <button
                      className="text-[10px] text-muted-foreground hover:text-destructive"
                      onClick={() => removeStyle(key)}
                    >
                      ✕
                    </button>
                  )}
                </div>
                {type === "color" ? (
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={value || "#000000"}
                      onChange={(e) => updateStyle(key, e.target.value)}
                      className="h-7 w-7 cursor-pointer rounded border border-input"
                    />
                    <Input
                      value={value}
                      onChange={(e) => updateStyle(key, e.target.value)}
                      className="flex-1 text-xs h-7 font-mono"
                      placeholder="transparent"
                    />
                  </div>
                ) : type === "select" ? (
                  <select
                    className="w-full rounded-lg border border-input bg-background px-2 py-1.5 text-xs"
                    value={value}
                    onChange={(e) => updateStyle(key, e.target.value)}
                  >
                    <option value="">—</option>
                    {options?.map((o) => (
                      <option key={o} value={o}>{o}</option>
                    ))}
                  </select>
                ) : (
                  <Input
                    value={value}
                    onChange={(e) => updateStyle(key, e.target.value)}
                    className="text-xs h-7 font-mono"
                    placeholder="e.g. 16px"
                  />
                )}
              </div>
            );
          })}

          {/* Custom style property */}
          <AddCustomStyle
            onAdd={(key, value) => updateStyle(key, value)}
          />
        </div>

        {/* Add child (for containers) */}
        {node.type === "container" && (
          <div className="space-y-3">
            <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Add Child Element</h4>
            <div className="grid grid-cols-2 gap-1.5">
              {addableTypes.map(({ type, label, icon: Icon }) => (
                <Button
                  key={type}
                  variant="outline"
                  size="sm"
                  className="h-8 text-xs justify-start"
                  onClick={() => onAddChild(node.id, type)}
                >
                  <Icon className="h-3 w-3 mr-1.5" />
                  {label}
                </Button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

function AddCustomStyle({ onAdd }: { onAdd: (key: string, value: string) => void }) {
  const [key, setKey] = React.useState("");
  const [value, setValue] = React.useState("");

  const handleAdd = () => {
    if (key && value) {
      onAdd(key, value);
      setKey("");
      setValue("");
    }
  };

  return (
    <div className="space-y-2 pt-2 border-t border-border">
      <Label className="text-xs text-muted-foreground">Add Custom Property</Label>
      <div className="flex gap-1">
        <Input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          className="flex-1 text-xs h-7 font-mono"
          placeholder="property"
        />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          className="flex-1 text-xs h-7 font-mono"
          placeholder="value"
        />
        <Button variant="outline" size="sm" className="h-7 w-7 p-0" onClick={handleAdd}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}

export default InspectorPanel;
