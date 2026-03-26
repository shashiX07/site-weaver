import { useState, useEffect, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowLeft, Save, Eye, Globe, Undo, Redo, Monitor, Smartphone, Tablet,
  Layers, Type, Palette, Square, ChevronRight, Sparkles, GripVertical,
  Plus, Trash2, Copy, EyeOff, AlignLeft, AlignCenter, AlignRight,
  ChevronUp, ChevronDown, X, Menu,
} from "lucide-react";
import {
  getWebsiteById, updateWebsiteContent, updateWebsite, publishWebsite,
  WebsiteContent, Section, SectionStyle, SectionType,
} from "@/lib/store";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

type Viewport = "desktop" | "tablet" | "mobile";

const viewportWidths: Record<Viewport, string> = {
  desktop: "100%",
  tablet: "768px",
  mobile: "375px",
};

const sectionTypeLabels: Record<SectionType, string> = {
  header: "Header",
  hero: "Hero Section",
  features: "Features",
  content: "Content",
  cta: "Call to Action",
  testimonials: "Testimonials",
  footer: "Footer",
};

const fontFamilies = ["Inter", "Poppins", "Georgia", "Arial", "Courier New", "Playfair Display", "Roboto Mono"];
const fontWeights = ["Normal", "Medium", "Semi Bold", "Bold", "Extra Bold"];

function genId() {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36);
}

const defaultSectionStyle: SectionStyle = {
  bgColor: "#ffffff", textColor: "#1a1a2e", accentColor: "#4F46E5", fontFamily: "Inter",
  fontSize: 16, fontWeight: "Normal", textAlign: "center", padding: 48, borderRadius: 0,
  letterSpacing: 0, lineHeight: 1.6, opacity: 100,
};

const newSectionTemplates: Record<string, Partial<Section>> = {
  hero: {
    type: "hero", label: "New Hero",
    content: { heading: "Your Headline Here", subheading: "Add a compelling subtitle.", buttonText: "Get Started" },
    style: { ...defaultSectionStyle, fontSize: 36, fontWeight: "Bold", padding: 64 },
  },
  features: {
    type: "features", label: "New Features",
    content: {
      heading: "Features",
      items: [
        { title: "Feature One", description: "Description here.", icon: "✨" },
        { title: "Feature Two", description: "Description here.", icon: "🚀" },
        { title: "Feature Three", description: "Description here.", icon: "💎" },
      ],
    },
    style: { ...defaultSectionStyle, padding: 48 },
  },
  content: {
    type: "content", label: "New Content",
    content: { heading: "Section Title", body: "Add your content here. Tell your story and engage your visitors." },
    style: { ...defaultSectionStyle, padding: 48 },
  },
  cta: {
    type: "cta", label: "New CTA",
    content: { heading: "Ready to Start?", subheading: "Take action today.", buttonText: "Sign Up" },
    style: { ...defaultSectionStyle, bgColor: "#4F46E5", textColor: "#ffffff", fontSize: 28, fontWeight: "Bold", padding: 64 },
  },
  testimonials: {
    type: "testimonials", label: "New Testimonials",
    content: {
      heading: "What People Say",
      testimonials: [
        { name: "Jane Doe", role: "Designer", quote: "Absolutely amazing experience!" },
        { name: "John Smith", role: "Developer", quote: "Couldn't be happier with the results." },
      ],
    },
    style: { ...defaultSectionStyle, bgColor: "#f8f9ff", padding: 48 },
  },
};

const Editor = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [website, setWebsite] = useState(id ? getWebsiteById(id) : null);
  const [sections, setSections] = useState<Section[]>(website?.content?.sections || []);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [viewport, setViewport] = useState<Viewport>("desktop");
  const [previewMode, setPreviewMode] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [rightPanel, setRightPanel] = useState<"style" | "content">("content");

  // Undo / Redo
  const [history, setHistory] = useState<Section[][]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  useEffect(() => {
    if (id) {
      const w = getWebsiteById(id);
      if (w) {
        setWebsite(w);
        const s = w.content?.sections || [];
        setSections(s);
        setHistory([s]);
        setHistoryIdx(0);
        if (s.length > 0) setSelectedSectionId(s.find(sec => sec.type === "hero")?.id || s[0].id);
      }
    }
  }, [id]);

  const pushHistory = useCallback((newSections: Section[]) => {
    setHistory(prev => {
      const trimmed = prev.slice(0, historyIdx + 1);
      const next = [...trimmed, newSections];
      if (next.length > 50) next.shift();
      return next;
    });
    setHistoryIdx(prev => Math.min(prev + 1, 49));
  }, [historyIdx]);

  const updateSections = useCallback((newSections: Section[]) => {
    setSections(newSections);
    setHasChanges(true);
    pushHistory(newSections);
  }, [pushHistory]);

  const undo = () => {
    if (historyIdx > 0) {
      const newIdx = historyIdx - 1;
      setHistoryIdx(newIdx);
      setSections(history[newIdx]);
      setHasChanges(true);
    }
  };

  const redo = () => {
    if (historyIdx < history.length - 1) {
      const newIdx = historyIdx + 1;
      setHistoryIdx(newIdx);
      setSections(history[newIdx]);
      setHasChanges(true);
    }
  };

  const selectedSection = sections.find(s => s.id === selectedSectionId) || null;

  const updateSection = (sectionId: string, updates: Partial<Section>) => {
    const newSections = sections.map(s => s.id === sectionId ? { ...s, ...updates } : s);
    updateSections(newSections);
  };

  const updateSectionStyle = (sectionId: string, styleUpdates: Partial<SectionStyle>) => {
    const newSections = sections.map(s =>
      s.id === sectionId ? { ...s, style: { ...s.style, ...styleUpdates } } : s
    );
    updateSections(newSections);
  };

  const updateSectionContent = (sectionId: string, contentUpdates: Partial<Section["content"]>) => {
    const newSections = sections.map(s =>
      s.id === sectionId ? { ...s, content: { ...s.content, ...contentUpdates } } : s
    );
    updateSections(newSections);
  };

  const moveSection = (sectionId: string, direction: "up" | "down") => {
    const idx = sections.findIndex(s => s.id === sectionId);
    if (idx < 0) return;
    const newIdx = direction === "up" ? idx - 1 : idx + 1;
    if (newIdx < 0 || newIdx >= sections.length) return;
    const newSections = [...sections];
    [newSections[idx], newSections[newIdx]] = [newSections[newIdx], newSections[idx]];
    updateSections(newSections);
  };

  const duplicateSection = (sectionId: string) => {
    const section = sections.find(s => s.id === sectionId);
    if (!section) return;
    const newSection = { ...JSON.parse(JSON.stringify(section)), id: genId(), label: `${section.label} (copy)` };
    const idx = sections.findIndex(s => s.id === sectionId);
    const newSections = [...sections];
    newSections.splice(idx + 1, 0, newSection);
    updateSections(newSections);
    setSelectedSectionId(newSection.id);
  };

  const deleteSection = (sectionId: string) => {
    const newSections = sections.filter(s => s.id !== sectionId);
    updateSections(newSections);
    if (selectedSectionId === sectionId) setSelectedSectionId(newSections[0]?.id || null);
  };

  const addSection = (type: string) => {
    const template = newSectionTemplates[type];
    if (!template) return;
    const section: Section = {
      id: genId(),
      type: template.type as SectionType,
      label: template.label || "New Section",
      visible: true,
      content: template.content || {},
      style: (template.style as SectionStyle) || { ...defaultSectionStyle },
    };
    const footerIdx = sections.findIndex(s => s.type === "footer");
    const newSections = [...sections];
    if (footerIdx >= 0) newSections.splice(footerIdx, 0, section);
    else newSections.push(section);
    updateSections(newSections);
    setSelectedSectionId(section.id);
    setShowAddMenu(false);
  };

  const handleSave = () => {
    if (id && website) {
      updateWebsiteContent(id, { ...website.content, sections });
      setHasChanges(false);
      toast({ title: "Saved!", description: "Your changes have been saved." });
    }
  };

  const handlePublish = () => {
    if (id && website) {
      updateWebsiteContent(id, { ...website.content, sections });
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
      if (e.key === "Escape") { setPreviewMode(false); setShowAddMenu(false); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });

  const getFontWeight = (w: string) => {
    const map: Record<string, number> = { Normal: 400, Medium: 500, "Semi Bold": 600, Bold: 700, "Extra Bold": 800 };
    return map[w] || 400;
  };

  // --- Render section on canvas ---
  const renderSection = (section: Section) => {
    if (!section.visible) return null;
    const { style, content } = section;
    const base: React.CSSProperties = {
      backgroundColor: style.bgColor,
      color: style.textColor,
      fontFamily: style.fontFamily,
      padding: `${style.padding}px`,
      textAlign: style.textAlign,
      letterSpacing: `${style.letterSpacing}px`,
      lineHeight: style.lineHeight,
      opacity: style.opacity / 100,
      transition: "all 0.2s",
    };

    const isSelected = selectedSectionId === section.id && !previewMode;

    const wrapper = (children: React.ReactNode) => (
      <div
        key={section.id}
        style={base}
        className={`relative group cursor-pointer transition-all ${isSelected ? "ring-2 ring-primary ring-inset" : "hover:ring-1 hover:ring-primary/30 hover:ring-inset"}`}
        onClick={(e) => { e.stopPropagation(); if (!previewMode) setSelectedSectionId(section.id); }}
      >
        {isSelected && (
          <div className="absolute top-1 left-1 z-10 flex items-center gap-1 rounded bg-primary px-2 py-0.5 text-[10px] font-medium text-primary-foreground">
            {section.label}
          </div>
        )}
        {children}
      </div>
    );

    switch (section.type) {
      case "header":
        return wrapper(
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <span className="font-bold text-lg" style={{ color: style.accentColor }}>{content.logoText || "Logo"}</span>
            <div className="flex gap-4">
              {(content.navLinks || []).map((link, i) => (
                <span key={i} className="text-sm hover:opacity-70 cursor-pointer">{link}</span>
              ))}
            </div>
          </div>
        );
      case "hero":
        return wrapper(
          <div className="max-w-3xl mx-auto">
            <h1 style={{ fontSize: `${style.fontSize}px`, fontWeight: getFontWeight(style.fontWeight) }} className="leading-tight">
              {content.heading}
            </h1>
            {content.subheading && (
              <p className="mt-4 text-lg opacity-70" style={{ fontFamily: style.fontFamily }}>{content.subheading}</p>
            )}
            {content.buttonText && (
              <button className="mt-8 px-8 py-3 rounded-lg text-sm font-semibold text-white transition-transform hover:scale-105"
                style={{ backgroundColor: style.accentColor }}>
                {content.buttonText}
              </button>
            )}
          </div>
        );
      case "features":
        return wrapper(
          <div className="max-w-5xl mx-auto">
            {content.heading && (
              <h2 className="text-2xl font-bold mb-8" style={{ fontSize: `${Math.max(style.fontSize, 24)}px` }}>{content.heading}</h2>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {(content.items || []).map((item, i) => (
                <div key={i} className="rounded-xl p-6" style={{ backgroundColor: `${style.textColor}08` }}>
                  {item.icon && <span className="text-3xl mb-3 block">{item.icon}</span>}
                  <h3 className="font-semibold text-base mb-2">{item.title}</h3>
                  <p className="text-sm opacity-70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case "content":
        return wrapper(
          <div className="max-w-3xl mx-auto">
            {content.heading && <h2 className="text-2xl font-bold mb-4" style={{ fontSize: `${Math.max(style.fontSize, 22)}px` }}>{content.heading}</h2>}
            {content.body && <p className="opacity-80 leading-relaxed">{content.body}</p>}
          </div>
        );
      case "testimonials":
        return wrapper(
          <div className="max-w-5xl mx-auto">
            {content.heading && <h2 className="text-2xl font-bold mb-8">{content.heading}</h2>}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(content.testimonials || []).map((t, i) => (
                <div key={i} className="rounded-xl p-6 text-left" style={{ backgroundColor: `${style.textColor}08` }}>
                  <p className="italic opacity-80 mb-4">"{t.quote}"</p>
                  <div>
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs opacity-60">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case "cta":
        return wrapper(
          <div className="max-w-2xl mx-auto">
            <h2 style={{ fontSize: `${style.fontSize}px`, fontWeight: getFontWeight(style.fontWeight) }}>{content.heading}</h2>
            {content.subheading && <p className="mt-3 opacity-80">{content.subheading}</p>}
            {content.buttonText && (
              <button className="mt-6 px-8 py-3 rounded-lg text-sm font-semibold transition-transform hover:scale-105"
                style={{ backgroundColor: style.textColor, color: style.bgColor }}>
                {content.buttonText}
              </button>
            )}
          </div>
        );
      case "footer":
        return wrapper(
          <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="font-semibold" style={{ color: style.accentColor }}>{content.logoText}</span>
            <div className="flex gap-4">
              {(content.navLinks || []).map((link, i) => (
                <span key={i} className="text-xs hover:opacity-70 cursor-pointer">{link}</span>
              ))}
            </div>
            <span className="text-xs opacity-60">{content.copyright}</span>
          </div>
        );
      default:
        return wrapper(<div className="p-8 text-center opacity-50">Unknown section type</div>);
    }
  };

  // --- Right panel content editor ---
  const renderContentEditor = () => {
    if (!selectedSection) return <p className="text-sm text-muted-foreground p-4">Select a section to edit its content.</p>;
    const s = selectedSection;
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-xs">Section Label</Label>
          <Input value={s.label} onChange={(e) => updateSection(s.id, { label: e.target.value })} className="text-xs" />
        </div>

        {(s.type === "hero" || s.type === "cta" || s.type === "content" || s.type === "features" || s.type === "testimonials") && s.content.heading !== undefined && (
          <div className="space-y-2">
            <Label className="text-xs">Heading</Label>
            <Input value={s.content.heading || ""} onChange={(e) => updateSectionContent(s.id, { heading: e.target.value })} className="text-xs" />
          </div>
        )}

        {(s.type === "hero" || s.type === "cta") && (
          <div className="space-y-2">
            <Label className="text-xs">Subheading</Label>
            <Textarea value={s.content.subheading || ""} onChange={(e) => updateSectionContent(s.id, { subheading: e.target.value })} rows={2} className="text-xs" />
          </div>
        )}

        {(s.type === "hero" || s.type === "cta") && (
          <div className="space-y-2">
            <Label className="text-xs">Button Text</Label>
            <Input value={s.content.buttonText || ""} onChange={(e) => updateSectionContent(s.id, { buttonText: e.target.value })} className="text-xs" />
          </div>
        )}

        {s.type === "content" && (
          <div className="space-y-2">
            <Label className="text-xs">Body Text</Label>
            <Textarea value={s.content.body || ""} onChange={(e) => updateSectionContent(s.id, { body: e.target.value })} rows={4} className="text-xs" />
          </div>
        )}

        {(s.type === "header" || s.type === "footer") && (
          <>
            <div className="space-y-2">
              <Label className="text-xs">Logo Text</Label>
              <Input value={s.content.logoText || ""} onChange={(e) => updateSectionContent(s.id, { logoText: e.target.value })} className="text-xs" />
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Nav Links (comma separated)</Label>
              <Input
                value={(s.content.navLinks || []).join(", ")}
                onChange={(e) => updateSectionContent(s.id, { navLinks: e.target.value.split(",").map(l => l.trim()).filter(Boolean) })}
                className="text-xs"
              />
            </div>
          </>
        )}

        {s.type === "footer" && (
          <div className="space-y-2">
            <Label className="text-xs">Copyright</Label>
            <Input value={s.content.copyright || ""} onChange={(e) => updateSectionContent(s.id, { copyright: e.target.value })} className="text-xs" />
          </div>
        )}

        {s.type === "features" && s.content.items && (
          <div className="space-y-3">
            <Label className="text-xs font-semibold">Feature Items</Label>
            {s.content.items.map((item, i) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Input value={item.icon || ""} className="w-12 text-center text-xs" onChange={(e) => {
                    const items = [...(s.content.items || [])];
                    items[i] = { ...items[i], icon: e.target.value };
                    updateSectionContent(s.id, { items });
                  }} />
                  <Input value={item.title} className="flex-1 text-xs" onChange={(e) => {
                    const items = [...(s.content.items || [])];
                    items[i] = { ...items[i], title: e.target.value };
                    updateSectionContent(s.id, { items });
                  }} />
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => {
                    const items = (s.content.items || []).filter((_, idx) => idx !== i);
                    updateSectionContent(s.id, { items });
                  }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Textarea value={item.description} rows={2} className="text-xs" onChange={(e) => {
                  const items = [...(s.content.items || [])];
                  items[i] = { ...items[i], description: e.target.value };
                  updateSectionContent(s.id, { items });
                }} />
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={() => {
              const items = [...(s.content.items || []), { title: "New Feature", description: "Description", icon: "✨" }];
              updateSectionContent(s.id, { items });
            }}>
              <Plus className="mr-1 h-3 w-3" /> Add Item
            </Button>
          </div>
        )}

        {s.type === "testimonials" && s.content.testimonials && (
          <div className="space-y-3">
            <Label className="text-xs font-semibold">Testimonials</Label>
            {s.content.testimonials.map((t, i) => (
              <div key={i} className="rounded-lg border border-border p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <Input value={t.name} placeholder="Name" className="flex-1 text-xs" onChange={(e) => {
                    const testimonials = [...(s.content.testimonials || [])];
                    testimonials[i] = { ...testimonials[i], name: e.target.value };
                    updateSectionContent(s.id, { testimonials });
                  }} />
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => {
                    const testimonials = (s.content.testimonials || []).filter((_, idx) => idx !== i);
                    updateSectionContent(s.id, { testimonials });
                  }}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <Input value={t.role} placeholder="Role" className="text-xs" onChange={(e) => {
                  const testimonials = [...(s.content.testimonials || [])];
                  testimonials[i] = { ...testimonials[i], role: e.target.value };
                  updateSectionContent(s.id, { testimonials });
                }} />
                <Textarea value={t.quote} placeholder="Quote" rows={2} className="text-xs" onChange={(e) => {
                  const testimonials = [...(s.content.testimonials || [])];
                  testimonials[i] = { ...testimonials[i], quote: e.target.value };
                  updateSectionContent(s.id, { testimonials });
                }} />
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full" onClick={() => {
              const testimonials = [...(s.content.testimonials || []), { name: "New Person", role: "Role", quote: "Great experience!" }];
              updateSectionContent(s.id, { testimonials });
            }}>
              <Plus className="mr-1 h-3 w-3" /> Add Testimonial
            </Button>
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <Label className="text-xs">Visible</Label>
          <Switch checked={s.visible} onCheckedChange={(v) => updateSection(s.id, { visible: v })} />
        </div>
      </div>
    );
  };

  // --- Right panel style editor ---
  const renderStyleEditor = () => {
    if (!selectedSection) return <p className="text-sm text-muted-foreground p-4">Select a section to edit its styles.</p>;
    const s = selectedSection;
    const st = s.style;
    return (
      <div className="space-y-5">
        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Typography</h4>
          <div className="space-y-2">
            <Label className="text-xs">Font Family</Label>
            <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={st.fontFamily} onChange={(e) => updateSectionStyle(s.id, { fontFamily: e.target.value })}>
              {fontFamilies.map(f => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Font Size</Label>
              <span className="text-xs text-muted-foreground">{st.fontSize}px</span>
            </div>
            <Slider value={[st.fontSize]} onValueChange={([v]) => updateSectionStyle(s.id, { fontSize: v })} max={80} min={10} step={1} />
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Font Weight</Label>
            <select className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
              value={st.fontWeight} onChange={(e) => updateSectionStyle(s.id, { fontWeight: e.target.value })}>
              {fontWeights.map(w => <option key={w}>{w}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <Label className="text-xs">Text Align</Label>
            <div className="flex gap-1">
              {(["left", "center", "right"] as const).map(a => (
                <Button key={a} variant={st.textAlign === a ? "default" : "outline"} size="icon" className="h-8 w-8"
                  onClick={() => updateSectionStyle(s.id, { textAlign: a })}>
                  {a === "left" && <AlignLeft className="h-3.5 w-3.5" />}
                  {a === "center" && <AlignCenter className="h-3.5 w-3.5" />}
                  {a === "right" && <AlignRight className="h-3.5 w-3.5" />}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Letter Spacing</Label>
              <span className="text-xs text-muted-foreground">{st.letterSpacing}px</span>
            </div>
            <Slider value={[st.letterSpacing]} onValueChange={([v]) => updateSectionStyle(s.id, { letterSpacing: v })} max={10} min={-2} step={0.5} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Line Height</Label>
              <span className="text-xs text-muted-foreground">{st.lineHeight}</span>
            </div>
            <Slider value={[st.lineHeight]} onValueChange={([v]) => updateSectionStyle(s.id, { lineHeight: v })} max={3} min={1} step={0.1} />
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Colors</h4>
          {[
            { label: "Background", key: "bgColor" as const },
            { label: "Text Color", key: "textColor" as const },
            { label: "Accent Color", key: "accentColor" as const },
          ].map(({ label, key }) => (
            <div key={key} className="space-y-2">
              <Label className="text-xs">{label}</Label>
              <div className="flex items-center gap-2">
                <input type="color" value={st[key]} onChange={(e) => updateSectionStyle(s.id, { [key]: e.target.value })}
                  className="h-8 w-8 cursor-pointer rounded-lg border border-input" />
                <Input value={st[key]} onChange={(e) => updateSectionStyle(s.id, { [key]: e.target.value })} className="flex-1 text-xs" />
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-3">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Layout</h4>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Padding</Label>
              <span className="text-xs text-muted-foreground">{st.padding}px</span>
            </div>
            <Slider value={[st.padding]} onValueChange={([v]) => updateSectionStyle(s.id, { padding: v })} max={120} min={0} step={4} />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Opacity</Label>
              <span className="text-xs text-muted-foreground">{st.opacity}%</span>
            </div>
            <Slider value={[st.opacity]} onValueChange={([v]) => updateSectionStyle(s.id, { opacity: v })} max={100} min={10} step={5} />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen flex-col bg-muted/30">
      {/* Top Toolbar */}
      <header className="flex h-14 items-center justify-between border-b border-border bg-background px-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/my-websites"><ArrowLeft className="h-4 w-4" /></Link>
          </Button>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={historyIdx <= 0}>
              <Undo className="h-3.5 w-3.5" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={historyIdx >= history.length - 1}>
              <Redo className="h-3.5 w-3.5" />
            </Button>
          </div>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-1">
            {(["desktop", "tablet", "mobile"] as Viewport[]).map(v => (
              <Button key={v} variant={viewport === v ? "secondary" : "ghost"} size="icon" className="h-8 w-8" onClick={() => setViewport(v)}>
                {v === "desktop" && <Monitor className="h-3.5 w-3.5" />}
                {v === "tablet" && <Tablet className="h-3.5 w-3.5" />}
                {v === "mobile" && <Smartphone className="h-3.5 w-3.5" />}
              </Button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="font-semibold text-foreground">{website?.name || "New Website"}</span>
          {hasChanges && <span className="h-2 w-2 rounded-full bg-orange-400" />}
        </div>

        <div className="flex items-center gap-2">
          <Button variant={previewMode ? "secondary" : "outline"} size="sm" onClick={() => setPreviewMode(!previewMode)}>
            <Eye className="mr-2 h-3.5 w-3.5" /> {previewMode ? "Exit Preview" : "Preview"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave} disabled={!hasChanges}>
            <Save className="mr-2 h-3.5 w-3.5" /> Save
          </Button>
          <Button size="sm" className="gradient-primary shadow-primary-glow" onClick={handlePublish}>
            <Globe className="mr-2 h-3.5 w-3.5" /> Publish
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - Layers */}
        {!previewMode && (
          <div className="hidden w-60 flex-col border-r border-border bg-background lg:flex">
            <div className="border-b border-border p-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Layers className="h-3.5 w-3.5" /> Sections
              </h3>
              <div className="relative">
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setShowAddMenu(!showAddMenu)}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
                {showAddMenu && (
                  <div className="absolute right-0 top-8 z-50 w-48 rounded-lg border border-border bg-background p-1 shadow-lg">
                    {Object.entries(newSectionTemplates).map(([key, tmpl]) => (
                      <button key={key} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-foreground hover:bg-muted"
                        onClick={() => addSection(key)}>
                        <Plus className="h-3 w-3 text-muted-foreground" />
                        {tmpl.label}
                      </button>
                    ))}
                    <button className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-muted-foreground"
                      onClick={() => setShowAddMenu(false)}>
                      <X className="h-3 w-3" /> Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-auto p-2 space-y-0.5">
              {sections.map((section, i) => (
                <div
                  key={section.id}
                  onClick={() => setSelectedSectionId(section.id)}
                  className={`flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors ${
                    selectedSectionId === section.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:bg-muted"
                  } ${!section.visible ? "opacity-40" : ""}`}
                >
                  <GripVertical className="h-3 w-3 opacity-30" />
                  <Square className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate flex-1">{section.label}</span>
                  <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                    {i > 0 && (
                      <button className="p-0.5 hover:text-foreground" onClick={(e) => { e.stopPropagation(); moveSection(section.id, "up"); }}>
                        <ChevronUp className="h-3 w-3" />
                      </button>
                    )}
                    {i < sections.length - 1 && (
                      <button className="p-0.5 hover:text-foreground" onClick={(e) => { e.stopPropagation(); moveSection(section.id, "down"); }}>
                        <ChevronDown className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Section actions */}
            {selectedSection && (
              <div className="border-t border-border p-2 space-y-1">
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="flex-1 text-xs justify-start" onClick={() => moveSection(selectedSection.id, "up")}>
                    <ChevronUp className="mr-1 h-3 w-3" /> Up
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs justify-start" onClick={() => moveSection(selectedSection.id, "down")}>
                    <ChevronDown className="mr-1 h-3 w-3" /> Down
                  </Button>
                </div>
                <div className="flex gap-1">
                  <Button variant="ghost" size="sm" className="flex-1 text-xs justify-start" onClick={() => duplicateSection(selectedSection.id)}>
                    <Copy className="mr-1 h-3 w-3" /> Duplicate
                  </Button>
                  <Button variant="ghost" size="sm" className="flex-1 text-xs justify-start text-destructive hover:text-destructive" onClick={() => deleteSection(selectedSection.id)}>
                    <Trash2 className="mr-1 h-3 w-3" /> Delete
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Center - Canvas */}
        <div className="flex flex-1 flex-col items-center overflow-auto bg-muted/50 p-4 lg:p-8" onClick={() => { if (!previewMode) setSelectedSectionId(null); }}>
          <div
            className="w-full rounded-xl border border-border bg-background shadow-lg overflow-hidden transition-all duration-300"
            style={{ maxWidth: viewportWidths[viewport] }}
          >
            {/* Browser chrome */}
            <div className="border-b border-border px-4 py-2.5 flex items-center gap-2 bg-muted/30">
              <div className="h-2.5 w-2.5 rounded-full bg-destructive/40" />
              <div className="h-2.5 w-2.5 rounded-full bg-orange-400/40" />
              <div className="h-2.5 w-2.5 rounded-full bg-green-400/40" />
              <div className="ml-3 flex-1 rounded-md bg-muted px-3 py-1 text-[11px] text-muted-foreground">
                {website?.url || "yoursite.templatepro.com"}
              </div>
            </div>
            {/* Sections */}
            <div className="min-h-[400px]">
              {sections.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center text-muted-foreground">
                  <Layers className="h-10 w-10 mb-3 opacity-30" />
                  <p className="text-sm font-medium">No sections yet</p>
                  <p className="text-xs mt-1">Add a section from the left panel</p>
                </div>
              ) : (
                sections.map(s => renderSection(s))
              )}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        {!previewMode && (
          <div className="hidden w-72 flex-col border-l border-border bg-background lg:flex">
            <div className="border-b border-border p-1 flex">
              <button
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${rightPanel === "content" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setRightPanel("content")}
              >
                Content
              </button>
              <button
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-md transition-colors ${rightPanel === "style" ? "bg-muted text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                onClick={() => setRightPanel("style")}
              >
                Style
              </button>
            </div>
            <div className="flex-1 overflow-auto p-4">
              {rightPanel === "content" ? renderContentEditor() : renderStyleEditor()}
            </div>

            {/* Website info */}
            {website && (
              <div className="border-t border-border p-3 space-y-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">Site Name</Label>
                  <Input value={website.name} onChange={(e) => {
                    const updated = updateWebsite(website.id, { name: e.target.value });
                    if (updated) setWebsite(updated);
                  }} className="text-xs h-8" />
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
      </div>
    </div>
  );
};

export default Editor;
