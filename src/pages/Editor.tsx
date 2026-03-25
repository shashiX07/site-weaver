import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ArrowLeft, Save, Eye, Globe, Undo, Redo, Monitor, Smartphone, Tablet, Layers, Type, Palette, Square, Image, ChevronRight, Sparkles } from "lucide-react";
import { getWebsiteById, updateWebsiteContent, updateWebsite, publishWebsite, WebsiteContent } from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const Editor = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [website, setWebsite] = useState(id ? getWebsiteById(id) : null);
  const [content, setContent] = useState<WebsiteContent>(
    website?.content || {
      heading: "Welcome to My Website",
      subheading: "Built with TemplatePro — customize everything visually.",
      buttonText: "Learn More",
      fontFamily: "Inter",
      fontSize: 32,
      fontWeight: "Bold",
      textColor: "#1a1a2e",
      bgColor: "#ffffff",
      padding: 24,
    }
  );
  const [selectedLayer, setSelectedLayer] = useState("Hero Section");
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (id) {
      const w = getWebsiteById(id);
      if (w) {
        setWebsite(w);
        setContent(w.content);
      }
    }
  }, [id]);

  const handleContentChange = (updates: Partial<WebsiteContent>) => {
    setContent((prev) => ({ ...prev, ...updates }));
    setHasChanges(true);
  };

  const handleSave = () => {
    if (id && website) {
      updateWebsiteContent(id, content);
      setHasChanges(false);
      toast({ title: "Saved!", description: "Your changes have been saved." });
    } else {
      toast({ title: "Info", description: "Create a website from a template first.", variant: "destructive" });
    }
  };

  const handlePublish = () => {
    if (id && website) {
      updateWebsiteContent(id, content);
      publishWebsite(id);
      setWebsite({ ...website, status: "Published" });
      setHasChanges(false);
      toast({ title: "Published! 🎉", description: `Your website is now live at ${website.url}` });
    }
  };

  const layers = [
    { name: "Header", type: "section" },
    { name: "Hero Section", type: "section" },
    { name: "Heading", type: "text", parent: true },
    { name: "Subheading", type: "text", parent: true },
    { name: "CTA Button", type: "button", parent: true },
    { name: "Content Grid", type: "section" },
    { name: "Footer", type: "section" },
  ];

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

        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">{website?.name || "New Website"}</span>
          {hasChanges && <span className="h-2 w-2 rounded-full bg-warning" />}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Eye className="mr-2 h-3.5 w-3.5" /> Preview</Button>
          <Button variant="outline" size="sm" onClick={handleSave}><Save className="mr-2 h-3.5 w-3.5" /> Save</Button>
          <Button size="sm" className="gradient-primary shadow-primary-glow" onClick={handlePublish}>
            <Globe className="mr-2 h-3.5 w-3.5" /> Publish
          </Button>
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
                onClick={() => setSelectedLayer(layer.name)}
                className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                  selectedLayer === layer.name
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
        <div className="flex flex-1 items-center justify-center overflow-auto bg-muted/50 p-4 lg:p-8">
          <div className="w-full max-w-4xl rounded-xl border border-border bg-background shadow-lg">
            <div className="border-b border-border px-6 py-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-destructive/50" />
                <div className="h-3 w-3 rounded-full bg-warning/50" />
                <div className="h-3 w-3 rounded-full bg-success/50" />
                <div className="ml-4 flex-1 rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
                  {website?.url || "yoursite.templatepro.com"}
                </div>
              </div>
            </div>
            <div style={{ padding: `${content.padding}px`, backgroundColor: content.bgColor }} className="text-center transition-all">
              <div className="mx-auto max-w-lg">
                <div
                  className={`rounded-lg border-2 p-8 transition-colors ${
                    selectedLayer === "Hero Section" || selectedLayer === "Heading" || selectedLayer === "Subheading" || selectedLayer === "CTA Button"
                      ? "border-primary/40 bg-primary/5"
                      : "border-transparent"
                  }`}
                >
                  <input
                    className="w-full bg-transparent text-center font-bold outline-none focus:ring-2 focus:ring-primary/20 rounded"
                    style={{ fontSize: `${content.fontSize}px`, color: content.textColor, fontFamily: content.fontFamily }}
                    value={content.heading}
                    onChange={(e) => handleContentChange({ heading: e.target.value })}
                  />
                  <textarea
                    className="mt-4 w-full resize-none bg-transparent text-center outline-none text-muted-foreground focus:ring-2 focus:ring-primary/20 rounded"
                    style={{ fontFamily: content.fontFamily }}
                    value={content.subheading}
                    onChange={(e) => handleContentChange({ subheading: e.target.value })}
                    rows={2}
                  />
                  <input
                    className="mt-6 inline-block rounded-lg gradient-primary px-6 py-2.5 text-sm font-medium text-primary-foreground outline-none text-center"
                    value={content.buttonText}
                    onChange={(e) => handleContentChange({ buttonText: e.target.value })}
                  />
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
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Typography</h4>
              <div className="space-y-2">
                <Label className="text-xs">Font Family</Label>
                <select
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={content.fontFamily}
                  onChange={(e) => handleContentChange({ fontFamily: e.target.value })}
                >
                  <option>Inter</option>
                  <option>Poppins</option>
                  <option>Georgia</option>
                  <option>Arial</option>
                  <option>Courier New</option>
                </select>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Font Size</Label>
                  <span className="text-xs text-muted-foreground">{content.fontSize}px</span>
                </div>
                <Slider value={[content.fontSize]} onValueChange={([v]) => handleContentChange({ fontSize: v })} max={72} min={12} step={1} />
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Font Weight</Label>
                <select
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                  value={content.fontWeight}
                  onChange={(e) => handleContentChange({ fontWeight: e.target.value })}
                >
                  <option>Normal</option>
                  <option>Medium</option>
                  <option>Semi Bold</option>
                  <option>Bold</option>
                </select>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Colors</h4>
              <div className="space-y-2">
                <Label className="text-xs">Text Color</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.textColor}
                    onChange={(e) => handleContentChange({ textColor: e.target.value })}
                    className="h-8 w-8 cursor-pointer rounded-lg border border-input"
                  />
                  <Input value={content.textColor} onChange={(e) => handleContentChange({ textColor: e.target.value })} className="flex-1 text-xs" />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-xs">Background</Label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={content.bgColor}
                    onChange={(e) => handleContentChange({ bgColor: e.target.value })}
                    className="h-8 w-8 cursor-pointer rounded-lg border border-input"
                  />
                  <Input value={content.bgColor} onChange={(e) => handleContentChange({ bgColor: e.target.value })} className="flex-1 text-xs" />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Spacing</h4>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-xs">Padding</Label>
                  <span className="text-xs text-muted-foreground">{content.padding}px</span>
                </div>
                <Slider value={[content.padding]} onValueChange={([v]) => handleContentChange({ padding: v })} max={80} min={0} step={4} />
              </div>
            </div>

            {website && (
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Website</h4>
                <div className="space-y-2">
                  <Label className="text-xs">Site Name</Label>
                  <Input
                    value={website.name}
                    onChange={(e) => {
                      const updated = updateWebsite(website.id, { name: e.target.value });
                      if (updated) setWebsite(updated);
                    }}
                    className="text-xs"
                  />
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <p className={`text-sm font-medium ${website.status === "Published" ? "text-success" : "text-muted-foreground"}`}>
                    {website.status}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
