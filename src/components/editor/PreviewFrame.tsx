// Preview iframe that renders HTML + CSS + JS in a sandboxed environment
import React, { useEffect, useRef } from "react";
import { EditorDocument } from "@/lib/editor/types";
import { layoutToHtml } from "@/lib/editor/store";

interface PreviewFrameProps {
  document: EditorDocument;
  className?: string;
}

const PreviewFrame: React.FC<PreviewFrameProps> = ({ document, className }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    if (!iframeRef.current) return;

    const html = layoutToHtml(document.layout);
    const scripts = document.scripts.map((s) => `<script>${s}<\/script>`).join("\n");

    const fullHtml = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
  <style>
    ${document.styles}
  </style>
</head>
<body>
  ${html}
  ${scripts}
</body>
</html>`;

    const blob = new Blob([fullHtml], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    iframeRef.current.src = url;

    return () => URL.revokeObjectURL(url);
  }, [document]);

  return (
    <iframe
      ref={iframeRef}
      className={className}
      sandbox="allow-scripts allow-same-origin"
      title="Preview"
      style={{ border: "none", width: "100%", height: "100%" }}
    />
  );
};

export default PreviewFrame;
