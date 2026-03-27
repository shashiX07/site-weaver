// Convert existing section-based templates to the new EditorDocument format
import { EditorDocument, EditorNode } from "./types";
import { genEditorId } from "./store";
import { Section } from "@/lib/store";

export function sectionsToEditorDocument(sections: Section[], templateName?: string): EditorDocument {
  const children: EditorNode[] = sections
    .filter((s) => s.visible)
    .map((section) => sectionToNode(section));

  return {
    layout: {
      id: "root",
      type: "container",
      tag: "div",
      attributes: { class: "template-root" },
      children,
    },
    styles: generateStylesFromSections(sections),
    scripts: [],
  };
}

function sectionToNode(section: Section): EditorNode {
  const { style, content, type } = section;
  const sectionId = `sec_${section.id}`;

  const sectionStyle: Record<string, string> = {
    backgroundColor: style.bgColor,
    color: style.textColor,
    fontFamily: style.fontFamily,
    padding: `${style.padding}px`,
    textAlign: style.textAlign,
    letterSpacing: `${style.letterSpacing}px`,
    lineHeight: String(style.lineHeight),
    opacity: String(style.opacity / 100),
  };

  const children: EditorNode[] = [];

  switch (type) {
    case "header":
      children.push({
        id: genEditorId(),
        type: "container",
        tag: "nav",
        style: { display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1152px", margin: "0 auto" },
        children: [
          {
            id: genEditorId(),
            type: "text",
            tag: "span",
            content: content.logoText || "Logo",
            editable: true,
            style: { fontWeight: "700", fontSize: "18px", color: style.accentColor },
          },
          {
            id: genEditorId(),
            type: "container",
            tag: "div",
            style: { display: "flex", gap: "24px" },
            children: (content.navLinks || []).map((link) => ({
              id: genEditorId(),
              type: "link" as const,
              tag: "a",
              content: link,
              href: "#",
              editable: true,
              style: { fontSize: "14px", textDecoration: "none", color: "inherit" },
            })),
          },
        ],
      });
      break;

    case "hero": {
      const heroContainer: EditorNode = {
        id: genEditorId(),
        type: "container",
        tag: "div",
        style: { maxWidth: "768px", margin: "0 auto" },
        children: [],
      };
      if (content.heading) {
        heroContainer.children!.push({
          id: genEditorId(),
          type: "text",
          tag: "h1",
          content: content.heading,
          editable: true,
          style: { fontSize: `${style.fontSize}px`, fontWeight: String(getFontWeight(style.fontWeight)), lineHeight: "1.1", margin: "0" },
        });
      }
      if (content.subheading) {
        heroContainer.children!.push({
          id: genEditorId(),
          type: "text",
          tag: "p",
          content: content.subheading,
          editable: true,
          style: { fontSize: "18px", opacity: "0.7", marginTop: "16px" },
        });
      }
      if (content.buttonText) {
        heroContainer.children!.push({
          id: genEditorId(),
          type: "button",
          tag: "button",
          content: content.buttonText,
          editable: true,
          action: { type: "none" },
          style: {
            marginTop: "32px",
            padding: "12px 32px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            color: "#ffffff",
            backgroundColor: style.accentColor,
            border: "none",
            cursor: "pointer",
          },
        });
      }
      children.push(heroContainer);
      break;
    }

    case "features": {
      if (content.heading) {
        children.push({
          id: genEditorId(),
          type: "text",
          tag: "h2",
          content: content.heading,
          editable: true,
          style: { fontSize: `${Math.max(style.fontSize, 24)}px`, fontWeight: "700", marginBottom: "32px" },
        });
      }
      const grid: EditorNode = {
        id: genEditorId(),
        type: "container",
        tag: "div",
        style: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", maxWidth: "1024px", margin: "0 auto" },
        children: (content.items || []).map((item) => ({
          id: genEditorId(),
          type: "container" as const,
          tag: "div",
          style: { padding: "24px", borderRadius: "12px", backgroundColor: `${style.textColor}08` },
          children: [
            ...(item.icon
              ? [{
                  id: genEditorId(),
                  type: "text" as const,
                  tag: "span",
                  content: item.icon,
                  style: { fontSize: "30px", display: "block", marginBottom: "12px" },
                }]
              : []),
            {
              id: genEditorId(),
              type: "text" as const,
              tag: "h3",
              content: item.title,
              editable: true,
              style: { fontWeight: "600", fontSize: "16px", marginBottom: "8px" },
            },
            {
              id: genEditorId(),
              type: "text" as const,
              tag: "p",
              content: item.description,
              editable: true,
              style: { fontSize: "14px", opacity: "0.7" },
            },
          ],
        })),
      };
      children.push(grid);
      break;
    }

    case "content":
      if (content.heading) {
        children.push({
          id: genEditorId(),
          type: "text",
          tag: "h2",
          content: content.heading,
          editable: true,
          style: { fontSize: `${Math.max(style.fontSize, 22)}px`, fontWeight: "700", marginBottom: "16px" },
        });
      }
      if (content.body) {
        children.push({
          id: genEditorId(),
          type: "text",
          tag: "p",
          content: content.body,
          editable: true,
          style: { opacity: "0.8", lineHeight: "1.7", maxWidth: "768px", margin: "0 auto" },
        });
      }
      break;

    case "testimonials": {
      if (content.heading) {
        children.push({
          id: genEditorId(),
          type: "text",
          tag: "h2",
          content: content.heading,
          editable: true,
          style: { fontSize: "24px", fontWeight: "700", marginBottom: "32px" },
        });
      }
      const tGrid: EditorNode = {
        id: genEditorId(),
        type: "container",
        tag: "div",
        style: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "24px", maxWidth: "1024px", margin: "0 auto" },
        children: (content.testimonials || []).map((t) => ({
          id: genEditorId(),
          type: "container" as const,
          tag: "div",
          style: { padding: "24px", borderRadius: "12px", backgroundColor: `${style.textColor}08`, textAlign: "left" },
          children: [
            {
              id: genEditorId(),
              type: "text" as const,
              tag: "p",
              content: `"${t.quote}"`,
              editable: true,
              style: { fontStyle: "italic", opacity: "0.8", marginBottom: "16px" },
            },
            {
              id: genEditorId(),
              type: "text" as const,
              tag: "p",
              content: t.name,
              editable: true,
              style: { fontWeight: "600", fontSize: "14px" },
            },
            {
              id: genEditorId(),
              type: "text" as const,
              tag: "p",
              content: t.role,
              style: { fontSize: "12px", opacity: "0.6" },
            },
          ],
        })),
      };
      children.push(tGrid);
      break;
    }

    case "cta": {
      const ctaWrap: EditorNode = {
        id: genEditorId(),
        type: "container",
        tag: "div",
        style: { maxWidth: "640px", margin: "0 auto" },
        children: [],
      };
      if (content.heading) {
        ctaWrap.children!.push({
          id: genEditorId(),
          type: "text",
          tag: "h2",
          content: content.heading,
          editable: true,
          style: { fontSize: `${style.fontSize}px`, fontWeight: String(getFontWeight(style.fontWeight)) },
        });
      }
      if (content.subheading) {
        ctaWrap.children!.push({
          id: genEditorId(),
          type: "text",
          tag: "p",
          content: content.subheading,
          editable: true,
          style: { marginTop: "12px", opacity: "0.8" },
        });
      }
      if (content.buttonText) {
        ctaWrap.children!.push({
          id: genEditorId(),
          type: "button",
          tag: "button",
          content: content.buttonText,
          editable: true,
          action: { type: "none" },
          style: {
            marginTop: "24px",
            padding: "12px 32px",
            borderRadius: "8px",
            fontSize: "14px",
            fontWeight: "600",
            backgroundColor: style.textColor,
            color: style.bgColor,
            border: "none",
            cursor: "pointer",
          },
        });
      }
      children.push(ctaWrap);
      break;
    }

    case "footer":
      children.push({
        id: genEditorId(),
        type: "container",
        tag: "div",
        style: { display: "flex", alignItems: "center", justifyContent: "space-between", maxWidth: "1152px", margin: "0 auto", flexWrap: "wrap", gap: "16px" },
        children: [
          {
            id: genEditorId(),
            type: "text",
            tag: "span",
            content: content.logoText || "",
            editable: true,
            style: { fontWeight: "600", color: style.accentColor },
          },
          {
            id: genEditorId(),
            type: "container",
            tag: "div",
            style: { display: "flex", gap: "16px" },
            children: (content.navLinks || []).map((link) => ({
              id: genEditorId(),
              type: "link" as const,
              tag: "a",
              content: link,
              href: "#",
              editable: true,
              style: { fontSize: "12px", textDecoration: "none", color: "inherit" },
            })),
          },
          {
            id: genEditorId(),
            type: "text",
            tag: "span",
            content: content.copyright || "",
            style: { fontSize: "12px", opacity: "0.6" },
          },
        ],
      });
      break;
  }

  return {
    id: sectionId,
    type: "container",
    tag: "section",
    attributes: { class: `section-${type}` },
    style: sectionStyle,
    children,
  };
}

function getFontWeight(w: string): number {
  const map: Record<string, number> = { Normal: 400, Medium: 500, "Semi Bold": 600, Bold: 700, "Extra Bold": 800 };
  return map[w] || 400;
}

function generateStylesFromSections(sections: Section[]): string {
  return `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; }
    .template-root { width: 100%; }
    img { max-width: 100%; height: auto; }
    a { color: inherit; }
    @media (max-width: 768px) {
      [style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
      [style*="grid-template-columns: repeat(2"] { grid-template-columns: 1fr !important; }
      nav { flex-direction: column; gap: 12px; }
    }
  `;
}

// Create a blank new node
export function createBlankNode(type: EditorNode["type"]): EditorNode {
  const id = genEditorId();
  switch (type) {
    case "container":
      return { id, type: "container", tag: "div", children: [], style: { padding: "24px" } };
    case "text":
      return { id, type: "text", tag: "p", content: "New text element", editable: true, style: { fontSize: "16px" } };
    case "image":
      return { id, type: "image", tag: "img", src: "https://placehold.co/600x400/e2e8f0/94a3b8?text=Image", alt: "Placeholder", editable: true, style: { maxWidth: "100%", borderRadius: "8px" } };
    case "link":
      return { id, type: "link", tag: "a", content: "Link text", href: "#", editable: true, style: { color: "#4F46E5", textDecoration: "underline" } };
    case "button":
      return { id, type: "button", tag: "button", content: "Click me", editable: true, action: { type: "none" }, style: { padding: "10px 24px", borderRadius: "8px", backgroundColor: "#4F46E5", color: "#ffffff", border: "none", cursor: "pointer", fontWeight: "600" } };
  }
}
