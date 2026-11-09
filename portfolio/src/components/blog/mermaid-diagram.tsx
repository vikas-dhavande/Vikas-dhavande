"use client";

import { useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";

type MermaidDiagramProps = {
  chart: string;
};

function sanitizeSvg(svg: string): string {
  // Strip dangerous elements completely
  let clean = svg
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/<foreignObject[\s\S]*?>[\s\S]*?<\/foreignObject>/gi, "")
    .replace(/<iframe[\s\S]*?>[\s\S]*?<\/iframe>/gi, "")
    .replace(/<object[\s\S]*?>[\s\S]*?<\/object>/gi, "")
    .replace(/<embed[\s\S]*?>[\s\S]*?<\/embed>/gi, "");

  // Remove all inline event handlers (e.g. onload, onerror, onclick)
  clean = clean.replace(/\son[a-z]+\s*=\s*(['"]).*?\1/gi, "");
  clean = clean.replace(/\son[a-z]+\s*=\s*[^>\s]+/gi, "");

  // Remove javascript: and vbscript: URIs from href / xlink:href
  clean = clean.replace(
    /\b(href|xlink:href)\s*=\s*(['"])\s*(?:javascript|vbscript):.*?\2/gi,
    '$1=""',
  );

  return clean;
}

export function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const [svg, setSvg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const chartId = useId().replace(/:/g, "");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === "cyberpunk";

  useEffect(() => {
    let cancelled = false;

    async function render() {
      try {
        const mermaid = (await import("mermaid")).default;

        mermaid.initialize({
          securityLevel: "strict",
          startOnLoad: false,
          theme: "base",
          darkMode: isDark,
          themeVariables: {
            background: isDark ? "#09090b" : "#ffffff",
            primaryColor: isDark ? "#1e293b" : "#f8fafc",
            primaryTextColor: isDark ? "#e2e8f0" : "#0f172a",
            primaryBorderColor: isDark ? "#475569" : "#cbd5e1",
            lineColor: isDark ? "#94a3b8" : "#475569",
            tertiaryColor: isDark ? "#0f172a" : "#f1f5f9",
          },
        });

        const result = await mermaid.render(`mermaid-${chartId}`, chart);

        if (!cancelled) {
          setSvg(sanitizeSvg(result.svg));
          setError(null);
        }
      } catch {
        if (!cancelled) {
          setSvg(null);
          setError("Could not render mermaid diagram.");
        }
      }
    }

    render();

    return () => {
      cancelled = true;
    };
  }, [chart, chartId, isDark]);

  if (error) {
    return (
      <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!svg) {
    return (
      <div className="rounded-xl border border-border px-4 py-3 text-sm text-muted-foreground animate-pulse">
        Rendering diagram...
      </div>
    );
  }

  return (
    <div
      className="my-6 overflow-x-auto rounded-xl border border-border bg-card p-4 shadow-md flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}

