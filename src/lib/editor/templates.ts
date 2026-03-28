// Dummy templates in the new payload format + utility functions
import { PayloadNode, EditorNode, EditorDocument, isEditorElement } from "./types";
import { hydratePayload, genEditorId } from "./store";

// --- Dummy template payloads ---

export const dummyTemplates: { name: string; payload: PayloadNode; styles: string; scripts: string[] }[] = [
  {
    name: "Personal Portfolio",
    styles: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Inter', sans-serif; color: #1a1a2e; }
      .hero { padding: 80px 40px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; }
      .hero h1 { font-size: 48px; font-weight: 800; margin-bottom: 16px; }
      .hero p { font-size: 18px; opacity: 0.85; max-width: 600px; margin: 0 auto 32px; }
      .hero .cta-btn { display: inline-block; padding: 14px 36px; background: #fff; color: #764ba2; border-radius: 8px; font-weight: 700; text-decoration: none; font-size: 16px; }
      .projects { padding: 60px 40px; max-width: 960px; margin: 0 auto; }
      .projects h2 { font-size: 32px; font-weight: 700; margin-bottom: 32px; text-align: center; }
      .project-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
      .project-card { padding: 24px; border-radius: 12px; background: #f8f9fa; border: 1px solid #e9ecef; }
      .project-card h3 { font-size: 18px; font-weight: 600; margin-bottom: 8px; }
      .project-card p { font-size: 14px; color: #6c757d; }
      .footer { padding: 32px 40px; text-align: center; background: #1a1a2e; color: #adb5bd; font-size: 14px; }
    `,
    scripts: [],
    payload: {
      tag: "div",
      attributes: { id: "portfolio" },
      children: [
        {
          tag: "section",
          attributes: { class: ["hero"] },
          children: [
            { tag: "h1", attributes: {}, children: [{ text: "Jane Cooper" }] },
            { tag: "p", attributes: {}, children: [{ text: "Full-stack developer & designer crafting beautiful digital experiences." }] },
            { tag: "a", attributes: { class: ["cta-btn"], href: "#projects" }, children: [{ text: "View My Work" }] },
          ],
        },
        {
          tag: "section",
          attributes: { class: ["projects"] },
          children: [
            { tag: "h2", attributes: {}, children: [{ text: "Recent Projects" }] },
            {
              tag: "div",
              attributes: { class: ["project-grid"] },
              children: [
                {
                  tag: "div",
                  attributes: { class: ["project-card"] },
                  children: [
                    { tag: "h3", attributes: {}, children: [{ text: "E-Commerce Platform" }] },
                    { tag: "p", attributes: {}, children: [{ text: "A modern shopping experience built with React and Node.js." }] },
                  ],
                },
                {
                  tag: "div",
                  attributes: { class: ["project-card"] },
                  children: [
                    { tag: "h3", attributes: {}, children: [{ text: "Analytics Dashboard" }] },
                    { tag: "p", attributes: {}, children: [{ text: "Real-time data visualization with D3.js and WebSockets." }] },
                  ],
                },
              ],
            },
          ],
        },
        {
          tag: "footer",
          attributes: { class: ["footer"] },
          children: [{ text: "© 2026 Jane Cooper. All rights reserved." }],
        },
      ],
    },
  },
  {
    name: "SaaS Landing Page",
    styles: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Inter', sans-serif; color: #0f172a; }
      .nav { display: flex; align-items: center; justify-content: space-between; padding: 16px 40px; border-bottom: 1px solid #e2e8f0; }
      .nav .logo { font-size: 20px; font-weight: 800; color: #4f46e5; }
      .nav-links { display: flex; gap: 24px; }
      .nav-links a { text-decoration: none; color: #64748b; font-size: 14px; font-weight: 500; }
      .hero-saas { padding: 100px 40px 80px; text-align: center; background: #f8fafc; }
      .hero-saas h1 { font-size: 52px; font-weight: 800; line-height: 1.1; max-width: 720px; margin: 0 auto 20px; }
      .hero-saas .highlight { color: #4f46e5; }
      .hero-saas p { font-size: 18px; color: #64748b; max-width: 540px; margin: 0 auto 36px; }
      .btn-primary { display: inline-block; padding: 14px 32px; background: #4f46e5; color: #fff; border-radius: 8px; font-weight: 600; text-decoration: none; font-size: 15px; }
      .features-saas { padding: 80px 40px; max-width: 1024px; margin: 0 auto; }
      .features-saas h2 { text-align: center; font-size: 28px; font-weight: 700; margin-bottom: 48px; }
      .feat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 32px; }
      .feat-item { text-align: center; }
      .feat-item .icon { font-size: 36px; margin-bottom: 16px; }
      .feat-item h3 { font-size: 16px; font-weight: 600; margin-bottom: 8px; }
      .feat-item p { font-size: 14px; color: #64748b; line-height: 1.6; }
    `,
    scripts: [],
    payload: {
      tag: "div",
      attributes: { id: "saas-landing" },
      children: [
        {
          tag: "nav",
          attributes: { class: ["nav"] },
          children: [
            { tag: "span", attributes: { class: ["logo"] }, children: [{ text: "FlowSync" }] },
            {
              tag: "div",
              attributes: { class: ["nav-links"] },
              children: [
                { tag: "a", attributes: { href: "#features" }, children: [{ text: "Features" }] },
                { tag: "a", attributes: { href: "#pricing" }, children: [{ text: "Pricing" }] },
                { tag: "a", attributes: { href: "#docs" }, children: [{ text: "Docs" }] },
              ],
            },
          ],
        },
        {
          tag: "section",
          attributes: { class: ["hero-saas"] },
          children: [
            {
              tag: "h1",
              attributes: {},
              children: [
                { text: "Ship products " },
                { tag: "span", attributes: { class: ["highlight"] }, children: [{ text: "10x faster" }] },
                { text: " with FlowSync" },
              ],
            },
            { tag: "p", attributes: {}, children: [{ text: "The all-in-one platform for modern teams to collaborate, build, and deploy." }] },
            { tag: "a", attributes: { class: ["btn-primary"], href: "#signup" }, children: [{ text: "Start Free Trial" }] },
          ],
        },
        {
          tag: "section",
          attributes: { class: ["features-saas"] },
          children: [
            { tag: "h2", attributes: {}, children: [{ text: "Everything you need" }] },
            {
              tag: "div",
              attributes: { class: ["feat-grid"] },
              children: [
                {
                  tag: "div",
                  attributes: { class: ["feat-item"] },
                  children: [
                    { tag: "div", attributes: { class: ["icon"] }, children: [{ text: "⚡" }] },
                    { tag: "h3", attributes: {}, children: [{ text: "Lightning Fast" }] },
                    { tag: "p", attributes: {}, children: [{ text: "Optimized for speed with edge deployment and smart caching." }] },
                  ],
                },
                {
                  tag: "div",
                  attributes: { class: ["feat-item"] },
                  children: [
                    { tag: "div", attributes: { class: ["icon"] }, children: [{ text: "🔒" }] },
                    { tag: "h3", attributes: {}, children: [{ text: "Enterprise Security" }] },
                    { tag: "p", attributes: {}, children: [{ text: "SOC2 compliant with end-to-end encryption and SSO." }] },
                  ],
                },
                {
                  tag: "div",
                  attributes: { class: ["feat-item"] },
                  children: [
                    { tag: "div", attributes: { class: ["icon"] }, children: [{ text: "📊" }] },
                    { tag: "h3", attributes: {}, children: [{ text: "Rich Analytics" }] },
                    { tag: "p", attributes: {}, children: [{ text: "Deep insights into your workflow with real-time dashboards." }] },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    name: "Restaurant Menu",
    styles: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Georgia', serif; color: #2d2d2d; background: #faf7f2; }
      .restaurant-header { padding: 60px 40px; text-align: center; background: #1a1a1a; color: #e8d5b7; }
      .restaurant-header h1 { font-size: 42px; font-weight: 400; letter-spacing: 4px; text-transform: uppercase; margin-bottom: 8px; }
      .restaurant-header p { font-size: 16px; letter-spacing: 2px; opacity: 0.7; }
      .menu-section { padding: 60px 40px; max-width: 720px; margin: 0 auto; }
      .menu-section h2 { font-size: 28px; text-align: center; margin-bottom: 32px; position: relative; }
      .menu-section h2::after { content: ''; display: block; width: 40px; height: 2px; background: #c9a96e; margin: 12px auto 0; }
      .menu-item { display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px dashed #d4c5a9; }
      .menu-item-name { font-size: 16px; font-weight: 600; }
      .menu-item-desc { font-size: 13px; color: #888; margin-top: 4px; }
      .menu-item-price { font-size: 16px; font-weight: 600; color: #c9a96e; white-space: nowrap; }
      .restaurant-footer { padding: 40px; text-align: center; background: #1a1a1a; color: #777; font-size: 13px; }
    `,
    scripts: [],
    payload: {
      tag: "div",
      attributes: { id: "restaurant" },
      children: [
        {
          tag: "header",
          attributes: { class: ["restaurant-header"] },
          children: [
            { tag: "h1", attributes: {}, children: [{ text: "La Maison" }] },
            { tag: "p", attributes: {}, children: [{ text: "Fine French Cuisine" }] },
          ],
        },
        {
          tag: "section",
          attributes: { class: ["menu-section"] },
          children: [
            { tag: "h2", attributes: {}, children: [{ text: "Starters" }] },
            {
              tag: "div",
              attributes: { class: ["menu-item"] },
              children: [
                {
                  tag: "div",
                  attributes: {},
                  children: [
                    { tag: "div", attributes: { class: ["menu-item-name"] }, children: [{ text: "French Onion Soup" }] },
                    { tag: "div", attributes: { class: ["menu-item-desc"] }, children: [{ text: "Classic recipe with gruyère crouton" }] },
                  ],
                },
                { tag: "span", attributes: { class: ["menu-item-price"] }, children: [{ text: "$14" }] },
              ],
            },
            {
              tag: "div",
              attributes: { class: ["menu-item"] },
              children: [
                {
                  tag: "div",
                  attributes: {},
                  children: [
                    { tag: "div", attributes: { class: ["menu-item-name"] }, children: [{ text: "Escargot" }] },
                    { tag: "div", attributes: { class: ["menu-item-desc"] }, children: [{ text: "Burgundy snails with garlic herb butter" }] },
                  ],
                },
                { tag: "span", attributes: { class: ["menu-item-price"] }, children: [{ text: "$18" }] },
              ],
            },
          ],
        },
        {
          tag: "footer",
          attributes: { class: ["restaurant-footer"] },
          children: [{ text: "© 2026 La Maison. Open Tue–Sun, 5:30pm–11pm." }],
        },
      ],
    },
  },
  {
    name: "Blog Article",
    styles: `
      * { margin: 0; padding: 0; box-sizing: border-box; }
      body { font-family: 'Inter', sans-serif; color: #1e293b; line-height: 1.7; }
      .article { max-width: 680px; margin: 0 auto; padding: 60px 24px; }
      .article-meta { font-size: 13px; color: #94a3b8; margin-bottom: 16px; }
      .article h1 { font-size: 36px; font-weight: 800; line-height: 1.2; margin-bottom: 24px; }
      .article .lead { font-size: 18px; color: #475569; margin-bottom: 32px; }
      .article h2 { font-size: 22px; font-weight: 700; margin: 32px 0 12px; }
      .article p { font-size: 16px; margin-bottom: 16px; color: #334155; }
      .article blockquote { border-left: 3px solid #4f46e5; padding-left: 20px; margin: 24px 0; font-style: italic; color: #64748b; }
      .article-footer { border-top: 1px solid #e2e8f0; padding-top: 24px; margin-top: 48px; font-size: 14px; color: #94a3b8; }
    `,
    scripts: [],
    payload: {
      tag: "article",
      attributes: { class: ["article"] },
      children: [
        { tag: "div", attributes: { class: ["article-meta"] }, children: [{ text: "March 28, 2026 · 5 min read" }] },
        { tag: "h1", attributes: {}, children: [{ text: "The Future of Web Development in 2026" }] },
        { tag: "p", attributes: { class: ["lead"] }, children: [{ text: "How AI-powered tools are reshaping the way we build for the web." }] },
        { tag: "h2", attributes: {}, children: [{ text: "The Rise of Visual Editors" }] },
        { tag: "p", attributes: {}, children: [{ text: "Visual editors have come a long way from simple WYSIWYG tools. Today's editors understand component hierarchies, design tokens, and responsive layouts natively." }] },
        {
          tag: "blockquote",
          attributes: {},
          children: [{ text: "The best code is the code you never have to write. Visual editors are making that possible for millions of creators." }],
        },
        { tag: "h2", attributes: {}, children: [{ text: "What Comes Next" }] },
        { tag: "p", attributes: {}, children: [{ text: "As AI models improve, we'll see editors that can understand design intent, suggest layout improvements, and automatically handle accessibility concerns." }] },
        { tag: "div", attributes: { class: ["article-footer"] }, children: [{ text: "Written by Alex Chen · Follow on Twitter @alexchen" }] },
      ],
    },
  },
];

// --- Create a hydrated EditorDocument from a template index ---
export function loadTemplate(index: number): EditorDocument {
  const tpl = dummyTemplates[index] || dummyTemplates[0];
  return {
    root: hydratePayload(tpl.payload),
    styles: tpl.styles,
    scripts: tpl.scripts,
  };
}

// --- Create blank nodes for adding elements ---
export function createBlankElement(tag: string): EditorNode {
  if (tag === "_text") {
    return { _id: genEditorId(), text: "New text" } as EditorNode;
  }
  return {
    _id: genEditorId(),
    tag,
    attributes: {},
    children: tag === "img"
      ? []
      : [{ _id: genEditorId(), text: tag === "a" ? "Link" : tag === "button" ? "Click me" : "New element" }],
  } as EditorNode;
}
