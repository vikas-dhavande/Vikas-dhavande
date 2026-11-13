"use client";

import { useEffect, useId, useRef, useState } from "react";
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
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const chartId = useId().replace(/:/g, "");
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === "cyberpunk";

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "250px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
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
  }, [inView, chart, chartId, isDark]);

  if (error) {
    return (
      <div
        ref={containerRef}
        className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive my-6"
      >
        {error}
      </div>
    );
  }

  if (!inView || !svg) {
    return (
      <div
        ref={containerRef}
        className="my-6 min-h-[160px] w-full rounded-xl border border-border bg-card/40 p-4 shadow-sm flex items-center justify-center text-xs text-muted-foreground animate-pulse"
      >
        <span>Rendering diagram...</span>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="my-6 overflow-x-auto rounded-xl border border-border bg-card p-4 shadow-md flex justify-center"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
