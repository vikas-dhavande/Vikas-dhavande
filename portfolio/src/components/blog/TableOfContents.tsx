"use client";

import React, { useEffect, useState } from "react";
import { HeadingItem } from "@/lib/blog-types";
import { AlignLeft } from "lucide-react";

interface TableOfContentsProps {
  headings: HeadingItem[];
}

export function TableOfContents({ headings }: TableOfContentsProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (!headings || headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: "-80px 0% -60% 0%" }
    );

    headings.forEach((heading) => {
      const el = document.getElementById(heading.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (!headings || headings.length === 0) {
    return null;
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (target) {
      const yOffset = -90; // offset for sticky navbar
      const y = target.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      setActiveId(id);
    }
  };

  return (
    <nav className="space-y-3 p-4 rounded-xl border border-border bg-card/40 backdrop-blur-md">
      <div className="flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-wider">
        <AlignLeft className="w-3.5 h-3.5 text-primary" />
        <span>On this page</span>
      </div>

      <ul className="space-y-1.5 text-xs text-muted-foreground border-l border-border pl-3">
        {headings.map((item) => {
          const isActive = activeId === item.id;
          return (
            <li
              key={item.id}
              className={`transition-colors ${
                item.level === 3 ? "pl-3 text-[11px]" : ""
              }`}
            >
              <a
                href={`#${item.id}`}
                onClick={(e) => handleClick(e, item.id)}
                className={`block py-1 hover:text-foreground transition-colors ${
                  isActive
                    ? "font-semibold text-primary -ml-[13px] pl-[9px] border-l-2 border-primary"
                    : ""
                }`}
              >
                {item.text}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
