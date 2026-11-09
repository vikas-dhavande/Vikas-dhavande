"use client";

import { useEffect, useId, useState } from "react";
import { useTheme } from "next-themes";

type MermaidDiagramProps = {
  chart: string;
};

function sanitizeSvg(svg: string) {
  return svg
    .replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+="[^"]*"/gi, "")
    .replace(/\son\w+='[^']*'/gi, "");
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
          securityLevel: "loose",
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

