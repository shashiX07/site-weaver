import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Save, Eye, Globe, Undo, Redo, Monitor, Smartphone, Tablet, Layers, Type, Palette, Square, Image, ChevronRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const layers = [
  { name: "Header", type: "section", selected: false },
  { name: "Hero Section", type: "section", selected: true },
  { name: "Heading", type: "text", parent: true },
  { name: "Paragraph", type: "text", parent: true },
  { name: "CTA Button", type: "button", parent: true },
  { name: "Hero Image", type: "image", parent: true },
  { name: "Features", type: "section", selected: false },
  { name: "Footer", type: "section", selected: false },
];

const Editor = () => {
  const [fontSize, setFontSize] = useState([32]);
  const [padding, setPadding] = useState([24]);

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      {/* Top Toolbar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/dashboard"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Undo className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Redo className="h-3.5 w-3.5" /></Button>
          </div>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8"><Monitor className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Tablet className="h-3.5 w-3.5" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8"><Smartphone className="h-3.5 w-3.5" /></Button>
          </div>
        </div>

        <div className="flex items-center gap-1 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">My Portfolio</span>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Eye className="mr-2 h-3.5 w-3.5" /> Preview</Button>
          <Button variant="outline" size="sm"><Save className="mr-2 h-3.5 w-3.5" /> Save</Button>
          <Button size="sm" className="gradient-primary shadow-primary-glow"><Globe className="mr-2 h-3.5 w-3.5" /> Publish</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Layers */}
        <div className="hidden w-64 flex-col border-r border-border bg-background lg:flex">
          <div className="border-b border-border p-3">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Layers className="h-3.5 w-3.5" /> Layers
            </h3>
          </div>
          <div className="flex-1 overflow-auto p-2">
            {layers.map((layer, i) => (
              <div
                key={i}
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  layer.selected
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:bg-muted"
                } ${layer.parent ? "ml-4" : ""}`}
              >
                {layer.type === "text" && <Type className="h-3.5 w-3.5" />}
                {layer.type === "section" && <Square className="h-3.5 w-3.5" />}
                {layer.type === "image" && <Image className="h-3.5 w-3.5" />}
                {layer.type === "button" && <ChevronRight className="h-3.5 w-3.5" />}
                <span className="truncate">{layer.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Center - Canvas */}
        <div className="flex flex-1 items-center justify-center overflow-auto bg-muted/50 p-8">
          <div className="w-full max-w-4xl rounded-xl border border-border bg-background shadow-lg">
            {/* Mock website preview */}
            <div className="border-b border-border px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/50" />
                <div className="h-3 w-3 rounded-full bg-warning/50" />
                <div className="h-3 w-3 rounded-full bg-success/50" />
                <div className="ml-4 flex-1 rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
                  john.templatepro.com
                </div>
              </div>
            </div>
            <div className="p-12 text-center">
              <div className="mx-auto max-w-lg">
                <div className="rounded-lg border-2 border-dashed border-primary/30 bg-primary/5 p-8 transition-colors hover:border-primary/50">
                  <h1 className="text-4xl font-bold text-foreground">Welcome to My Portfolio</h1>
                  <p className="mt-4 text-muted-foreground">
                    I'm a creative designer passionate about building beautiful digital experiences.
                  </p>
                  <Button className="mt-6 gradient-primary">View My Work</Button>
                </div>
              </div>
              <div className="mt-12 grid grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="aspect-square rounded-lg bg-muted" />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Panel - Style Editor */}
        <div className="hidden w-72 flex-col border-l border-border bg-background lg:flex">
          <div className="border-b border-border p-3">
            <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <Palette className="h-3.5 w-3.5" /> Style
            </h3>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-6">
            {/* Typography */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Typography</h4>
              <div className="space-y-2">
                <Label className="text-xs">Font Family</Label>
                <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option>Inter</option>
                  <option>Poppins</option>
                  <option>Roboto</option>
                  <option>Playfair Display</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Font Size</Label>
                  <span className="text-xs text-muted-foreground">{fontSize[0]}px</span>
                </div>
                <Slider value={fontSize} onValueChange={setFontSize} max={72} min={12} step={1} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Font Weight</Label>
                <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm">
                  <option>Regular</option>
                  <option>Medium</option>
                  <option>Semi Bold</option>
                  <option>Bold</option>
                </select>
              </div>
            </div>

            {/* Colors */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Colors</h4>
              <div className="space-y-2">
                <Label className="text-xs">Text Color</Label>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg border border-input bg-foreground" />
                  <Input value="#1a1a2e" className="flex-1 text-xs" readOnly />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Background</Label>
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg border border-input bg-background" />
                  <Input value="#ffffff" className="flex-1 text-xs" readOnly />
                </div>
              </div>
            </div>

            {/* Spacing */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Spacing</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Padding</Label>
                  <span className="text-xs text-muted-foreground">{padding[0]}px</span>
                </div>
                <Slider value={padding} onValueChange={setPadding} max={80} min={0} step={4} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
