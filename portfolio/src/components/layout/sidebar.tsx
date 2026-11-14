"use client";

import React, { useState, useCallback, memo, startTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import {
  ChevronUp,
  Cpu,
  Layers,
  Wrench,
  BookOpen,
  Compass,
  FileCode,
  type LucideIcon,
  Sparkles,
} from "lucide-react";
import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import type { BlogCategory, BlogLink } from "@/lib/blog-types";

// Lazy-load BlogCommandSearch to decouple search index and modal dialog from initial sidebar render
const BlogCommandSearch = dynamic(
  () => import("@/components/layout/blog-command-search").then((mod) => mod.BlogCommandSearch),
  { ssr: false }
);

type SidebarLinkItem = {
  name: string;
  href: string;
  isNew?: boolean;
  external?: boolean;
};

const getCategoryIcon = (categorySlug: string): LucideIcon => {
  const cat = categorySlug.toLowerCase();
  if (cat.includes("avionics") || cat.includes("aero")) return Cpu;
  if (cat.includes("systems") || cat.includes("rtos")) return Layers;
  if (cat.includes("automotive") || cat.includes("ecu")) return Wrench;
  if (cat.includes("frontend") || cat.includes("ui")) return FileCode;
  if (cat.includes("classics")) return BookOpen;
  return Compass;
};

const SidebarItem = memo(function SidebarItem({
  item,
  isActive,
  isHovered,
  onHover,
}: {
  item: SidebarLinkItem;
  isActive: boolean;
  isHovered: boolean;
  onHover: (href: string) => void;
}) {
  const router = useRouter();

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (item.external) return;
      e.preventDefault();
      startTransition(() => {
        router.push(item.href);
      });
    },
    [item.external, router, item.href],
  );

  return (
    <div onMouseEnter={() => onHover(item.href)} className="relative">
      {isActive && (
        <div className="absolute inset-0 z-0 rounded-lg bg-secondary font-medium" />
      )}
      {isHovered && !isActive && (
        <motion.div
          layoutId="sidebar-hover-bg"
          className="absolute inset-0 z-0 rounded-lg bg-muted/60"
          transition={{ type: "spring", stiffness: 600, damping: 35 }}
        />
      )}
      <Link
        href={item.href}
        onClick={item.external ? undefined : handleClick}
        prefetch={item.external ? false : true}
        target={item.external ? "_blank" : undefined}
        rel={item.external ? "noopener noreferrer" : undefined}
        className={cn(
          "relative z-10 flex w-full items-center justify-between rounded-lg px-3 py-1.5 text-xs sm:text-sm transition-colors",
          isActive
            ? "font-semibold text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <span className="truncate">{item.name}</span>
        {item.isNew && (
          <span className="ml-2 rounded-md bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-medium leading-none text-emerald-500">
            New
          </span>
        )}
      </Link>
    </div>
  );
});

function SidebarSection({
  id,
  name,
  icon: Icon,
  items,
  hoveredPath,
  pathname,
  onHover,
  isCollapsed,
  onToggle,
}: {
  id: string;
  name: string;
  icon: LucideIcon;
  items: SidebarLinkItem[];
  hoveredPath: string | null;
  pathname: string;
  onHover: (href: string) => void;
  isCollapsed: boolean;
  onToggle: (sectionId: string) => void;
}) {
  const isSectionActive = items.some((item) => {
    if (item.external) return false;
    return pathname === item.href || pathname.endsWith(item.href);
  });
  const isExpanded = !isCollapsed;

  return (
    <div
      className={cn(
        "flex flex-col transition-[margin] duration-300 ease-out",
        isExpanded ? "mb-4" : "mb-1.5",
      )}
    >
      <button
        type="button"
        onClick={() => onToggle(id)}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-xs font-semibold uppercase tracking-wider transition-colors cursor-pointer",
          isSectionActive
            ? "bg-secondary/70 text-foreground"
            : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
        )}
      >
        <Icon className="h-4 w-4 shrink-0 text-primary" />
        <span className="min-w-0 flex-1 truncate">{name}</span>
        <ChevronUp
          className={cn(
            "h-3.5 w-3.5 text-muted-foreground transition-transform duration-300",
            isExpanded ? "rotate-0" : "rotate-180",
          )}
        />
      </button>

      <div
        className={cn(
          "mt-1 grid transition-[grid-template-rows,opacity] duration-300 ease-out",
          isExpanded
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="ml-3 overflow-hidden border-l border-border/80 pl-2">
          <div className="flex flex-col space-y-0.5 py-1">
            {items.map((item) => (
              <SidebarItem
                key={item.href}
                item={item}
                isActive={!item.external && (pathname === item.href || pathname.endsWith(item.href))}
                isHovered={hoveredPath === item.href}
                onHover={onHover}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Sidebar({
  categories,
  links = [],
}: {
  categories: BlogCategory[];
  links?: BlogLink[];
}) {
  const pathname = usePathname();
  const [hoveredPath, setHoveredPath] = useState<string | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    () => new Set(),
  );

  const handleHover = useCallback((href: string) => {
    setHoveredPath(href);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredPath(null);
  }, []);

  const handleToggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }, []);

  return (
    <div className="w-full pb-8 space-y-5" onMouseLeave={handleMouseLeave}>
      {links.length > 0 && (
        <div className="px-1">
          <BlogCommandSearch links={links} />
        </div>
      )}

      <div className="space-y-1">
        <Link
          href="/blog"
          className={cn(
            "flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-lg transition-colors",
            pathname === "/blog"
              ? "bg-primary text-primary-foreground font-bold shadow-xs"
              : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
          )}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>All Articles &amp; Topics</span>
        </Link>
      </div>

      <div className="pt-2">
        {categories.map((category) => (
          <SidebarSection
            id={category.slug}
            key={category.slug}
            name={category.name}
            icon={getCategoryIcon(category.slug)}
            items={category.items.map((post) => ({
              name: post.title,
              href: post.href,
              isNew: post.isNew,
            }))}
            hoveredPath={hoveredPath}
            pathname={pathname}
            onHover={handleHover}
            isCollapsed={collapsedSections.has(category.slug)}
            onToggle={handleToggleSection}
          />
        ))}
        {categories.length === 0 ? (
          <p className="px-2 text-xs text-muted-foreground">
            No articles found.
          </p>
        ) : null}
      </div>
    </div>
  );
}

