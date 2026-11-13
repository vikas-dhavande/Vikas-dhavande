"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Expand, X } from "lucide-react";
import { useTheme } from "next-themes";
import type { ForceGraphMethods } from "react-force-graph-2d";
import { Button } from "@/components/ui/button";
import { useIsMounted } from "@/hooks/use-is-mounted";

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), {
  ssr: false,
});

type MindMapNode = {
  id: string;
  label: string;
  kind: "root" | "category" | "post";
  slug?: string;
  href?: string;
};

type MindMapLink = {
  source: string;
  target: string;
};

type GraphNode = MindMapNode & {
  fx?: number;
  fy?: number;
  x?: number;
  y?: number;
};

export function BlogMindmap({
  currentSlug,
  links,
}: {
  currentSlug: string;
  links: { title: string; href: string; category: string }[];
}) {
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);
  const mounted = useIsMounted();
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === "dark" || resolvedTheme === "cyberpunk";

  const data = useMemo(() => {
    const nodes: MindMapNode[] = [{ id: "root", label: "Knowledge Web", kind: "root" }];
    const edges: MindMapLink[] = [];
    const seenCategories = new Set<string>();

    for (const post of links) {
      const categoryId = `category:${post.category}`;
      if (!seenCategories.has(categoryId)) {
        seenCategories.add(categoryId);
        nodes.push({ id: categoryId, label: post.category, kind: "category" });
        edges.push({ source: "root", target: categoryId });
      }

      const postSlug = post.href.replace(/^\/blog\//, "").replace(/^\//, "");
      const postId = `post:${postSlug}`;
      nodes.push({
        id: postId,
        label: post.title,
        kind: "post",
        slug: postSlug,
        href: post.href,
      });
      edges.push({ source: categoryId, target: postId });
    }

    return { links: edges, nodes };
  }, [links]);

  const onNodeClick = useCallback(
    (node: object) => {
      const typed = node as MindMapNode;
      if (!typed.href && !typed.slug) return;
      setExpanded(false);
      router.push(typed.href || `/blog/${typed.slug}`);
    },
    [router],
  );

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setExpanded(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <div className="space-y-3 mt-4">
      <div className="flex items-center justify-between px-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Knowledge Graph
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
          aria-label="Expand knowledge graph"
          onClick={() => setExpanded(true)}
        >
          <Expand className="size-4" />
        </Button>
      </div>
      <MindMapCanvas
        className="h-64"
        currentSlug={currentSlug}
        data={data}
        isDark={isDark}
        onNodeClick={onNodeClick}
      />

      {mounted && expanded
        ? createPortal(
            <div
              className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/60 p-4 backdrop-blur-md"
              onClick={() => setExpanded(false)}
            >
              <div
                className="relative h-[80vh] w-[min(1200px,96vw)] rounded-2xl border border-border bg-background p-4 shadow-2xl"
                onClick={(event) => event.stopPropagation()}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-4 z-10 size-8 text-muted-foreground hover:text-foreground cursor-pointer"
                  aria-label="Close expanded blog web"
                  onClick={() => setExpanded(false)}
                >
                  <X className="size-4" />
                </Button>
                <MindMapCanvas
                  className="h-full"
                  currentSlug={currentSlug}
                  data={data}
                  isDark={isDark}
                  onNodeClick={onNodeClick}
                />
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

function MindMapCanvas({
  className,
  currentSlug,
  data,
  isDark,
  onNodeClick,
}: {
  className: string;
  currentSlug: string;
  data: { nodes: MindMapNode[]; links: MindMapLink[] };
  isDark: boolean;
  onNodeClick: (node: object) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const graphRef = useRef<ForceGraphMethods | undefined>(undefined);
  const [size, setSize] = useState({ height: 0, width: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [zoomK, setZoomK] = useState(1);
  const [inView, setInView] = useState(false);

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
      { rootMargin: "150px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const getNodeRadius = useCallback(
    (node: GraphNode) => {
      if (node.kind === "root") return 6;
      if (node.kind === "category") return 5;
      if (node.slug === currentSlug) return 4.5;
      return 3.5;
    },
    [currentSlug],
  );

  const getLabelFontSize = useCallback((node: GraphNode, scale: number) => {
    const baseSize =
      node.kind === "root" ? 14 : node.kind === "category" ? 12 : 11;
    return Math.max(3, baseSize / Math.pow(scale, 0.92));
  }, []);

  const setCursor = useCallback((cursor: string) => {
    if (!containerRef.current) return;
    containerRef.current.style.cursor = cursor;
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      setSize({
        width: Math.max(0, Math.floor(rect?.width ?? 0)),
        height: Math.max(0, Math.floor(rect?.height ?? 0)),
      });
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const graph = graphRef.current;
    const linkForce = graph?.d3Force?.("link");
    if (!linkForce) return;

    const zoomFactor = Math.min(1.9, Math.max(0.75, Math.pow(zoomK, 0.45)));
    linkForce.distance((link: { source: { id?: string } }) => {
      const sourceId = link.source?.id;
      if (sourceId === "root") return 95 * zoomFactor;
      return 72 * zoomFactor;
    });
    graph?.d3ReheatSimulation();
  }, [zoomK]);

  return (
    <div
      ref={containerRef}
      className={`${className} w-full overflow-hidden rounded-xl border border-border bg-muted/20 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
    >
      {size.width > 0 && size.height > 0 && inView ? (
        <ForceGraph2D
          ref={graphRef}
          width={size.width}
          height={size.height}
          graphData={data}
          cooldownTicks={90}
          d3AlphaDecay={0.03}
          autoPauseRedraw={false}
          enableNodeDrag
          enablePanInteraction
          showPointerCursor={(object) => Boolean(object)}
          nodeRelSize={5}
          onZoom={({ k }) => setZoomK(k)}
          nodeColor={(node) => {
            const typed = node as MindMapNode;
            if (typed.kind === "root") return isDark ? "#ffffff" : "#0f172a";
            if (typed.slug === currentSlug)
              return isDark ? "#38bdf8" : "#0284c7";
            if (typed.kind === "category")
              return isDark ? "#a1a1aa" : "#52525b";
            return isDark ? "#71717a" : "#27272a";
          }}
          linkColor={() =>
            isDark ? "rgba(161,161,170,0.3)" : "rgba(82,82,91,0.25)"
          }
          linkWidth={(link) =>
            (link as { source: { id?: string } }).source?.id === "root"
              ? 1.2
              : 0.95
          }
          onNodeHover={(node) => {
            if (isDragging) return;
            setCursor(node ? "grab" : "default");
          }}
          nodePointerAreaPaint={(node, color, ctx, scale) => {
            const typed = node as GraphNode;
            const x = typed.x ?? 0;
            const y = typed.y ?? 0;
            const radius = getNodeRadius(typed) + 6 / Math.max(1, scale);
            ctx.fillStyle = color;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fill();

            const fontSize = getLabelFontSize(typed, scale);
            ctx.font = `${fontSize}px sans-serif`;
            const textWidth = ctx.measureText(typed.label).width;
            const boxHeight = fontSize + 6;
            const boxX = x + radius + 1;
            const boxY = y - boxHeight / 2;

            ctx.fillRect(boxX, boxY, textWidth + 6, boxHeight);
          }}
          onNodeDrag={(node) => {
            setIsDragging(true);
            setCursor("grabbing");
            const typed = node as GraphNode;
            typed.fx = typed.x;
            typed.fy = typed.y;
          }}
          onNodeDragEnd={(node) => {
            setIsDragging(false);
            setCursor("grab");
            const typed = node as GraphNode;
            typed.fx = undefined;
            typed.fy = undefined;
          }}
          onNodeClick={onNodeClick}
          nodeCanvasObject={(node, ctx, scale) => {
            const typed = node as GraphNode;
            const x = typed.x ?? 0;
            const y = typed.y ?? 0;
            const radius = getNodeRadius(typed);
            const fontSize = getLabelFontSize(typed, scale);
            const isActive = typed.slug === currentSlug;

            ctx.beginPath();
            ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
            ctx.fillStyle =
              typed.kind === "root" || isActive
                ? isDark
                  ? "#38bdf8"
                  : "#0284c7"
                : isDark
                  ? "#a1a1aa"
                  : "#52525b";
            ctx.fill();

            if (typed.kind === "root") {
              ctx.beginPath();
              ctx.arc(x, y, radius + 3, 0, 2 * Math.PI, false);
              ctx.strokeStyle = isDark
                ? "rgba(255,255,255,0.4)"
                : "rgba(15,23,42,0.3)";
              ctx.lineWidth = 1.2;
              ctx.stroke();
            }

            ctx.font = `${fontSize}px sans-serif`;
            ctx.textAlign = "left";
            ctx.textBaseline = "middle";
            ctx.fillStyle = isActive
              ? isDark
                ? "#ffffff"
                : "#0f172a"
              : isDark
                ? "rgba(228,228,231,0.9)"
                : "rgba(39,39,42,0.95)";
            if (typed.kind === "category") {
              ctx.fillStyle = isDark
                ? "rgba(255,255,255,0.95)"
                : "rgba(15,23,42,0.95)";
            }

            ctx.fillText(typed.label, x + radius + 4, y);
          }}
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-2 p-4 text-center">
          <div className="size-2 rounded-full bg-primary/70 animate-ping" />
          <span className="text-xs font-medium text-muted-foreground">
            Knowledge Graph
          </span>
          <span className="text-[10px] text-muted-foreground/70">
            Scroll into view to activate
          </span>
        </div>
      )}
    </div>
  );
}

