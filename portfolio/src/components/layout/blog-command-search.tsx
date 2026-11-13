"use client";

import { startTransition, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import type { BlogLink } from "@/lib/blog-types";
import { cn } from "@/lib/utils";

type SearchItem = {
  href: string;
  category: string;
  description: string;
  title: string;
  searchText: string;
};

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function parseQueryTerms(query: string) {
  return query
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((token) => token.length > 1);
}

function highlightText(text: string, terms: string[]) {
  if (!text) return text;
  if (terms.length === 0) return text;
  const pattern = new RegExp(`(${terms.map(escapeRegExp).join("|")})`, "ig");
  const parts = text.split(pattern);

  return parts.map((part, index) => {
    const isMatch = terms.some(
      (term) => part.toLowerCase() === term.toLowerCase(),
    );
    if (!isMatch) return <span key={`${part}-${index}`}>{part}</span>;
    return (
      <mark
        key={`${part}-${index}`}
        className="rounded bg-primary/20 text-primary font-medium px-0.5"
      >
        {part}
      </mark>
    );
  });
}

function buildSnippet(text: string, terms: string[]) {
  if (!text) return "";
  if (terms.length === 0) return text.slice(0, 140);

  const lowered = text.toLowerCase();
  let firstMatch = -1;
  for (const term of terms) {
    const idx = lowered.indexOf(term);
    if (idx !== -1 && (firstMatch === -1 || idx < firstMatch)) {
      firstMatch = idx;
    }
  }

  if (firstMatch === -1) return text.slice(0, 140);
  const start = Math.max(0, firstMatch - 48);
  const end = Math.min(text.length, firstMatch + 120);
  const segment = text.slice(start, end).trim();

  const prefix = start > 0 ? "..." : "";
  const suffix = end < text.length ? "..." : "";
  return `${prefix}${segment}${suffix}`;
}

export function BlogCommandSearch({
  links,
  className,
}: {
  links: BlogLink[];
  className?: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const items = useMemo<SearchItem[]>(() => {
    if (!open) return [];
    return links.map((post) => ({
      href: post.href,
      category: post.category,
      description: post.description,
      title: post.title,
      searchText: post.searchText,
    }));
  }, [open, links]);

  const filtered = useMemo(() => {
    if (!open) return [];
    const terms = parseQueryTerms(query);
    if (terms.length === 0) {
      return items.slice(0, 40).map((item) => ({
        ...item,
        score: 0,
        snippet: item.description || buildSnippet(item.searchText, terms),
      }));
    }

    const scored = items
      .map((item) => {
        const title = item.title.toLowerCase();
        const description = item.description.toLowerCase();
        const category = item.category.toLowerCase();
        const searchBody = item.searchText.toLowerCase();

        let score = 0;
        for (const term of terms) {
          if (title === term) score += 20;
          if (title.startsWith(term)) score += 12;
          if (title.includes(term)) score += 8;
          if (description.includes(term)) score += 6;
          if (category.includes(term)) score += 4;
          if (searchBody.includes(term)) score += 3;
        }

        const allTermsPresent = terms.every(
          (term) =>
            title.includes(term) ||
            description.includes(term) ||
            category.includes(term) ||
            searchBody.includes(term),
        );
        if (allTermsPresent) score += 10;

        return {
          ...item,
          score,
          snippet: item.description || buildSnippet(item.searchText, terms),
        };
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);

    return scored;
  }, [open, items, query]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setOpen((current) => !current);
      }

      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const openPost = (href: string) => {
    setOpen(false);
    setQuery("");
    startTransition(() => {
      router.push(href);
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "group flex h-9 w-full items-center justify-between rounded-lg border border-border bg-muted/40 px-3 text-xs text-muted-foreground transition-colors hover:border-primary/50 hover:bg-muted/80 hover:text-foreground cursor-pointer shadow-sm",
          className,
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          <Search className="size-3.5 shrink-0 opacity-70 group-hover:opacity-100" />
          <span className="truncate">Search articles...</span>
        </span>
        <kbd className="ml-2 rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground shadow-xs">
          Ctrl K
        </kbd>
      </button>

      {open && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[260] flex items-start justify-center p-4 pt-[12vh] transition-opacity duration-200 opacity-100"
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div
            onClick={(event) => event.stopPropagation()}
            className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-border bg-background shadow-2xl backdrop-blur-xl transition-all duration-200 translate-y-0 scale-100"
          >
            <div className="flex items-center gap-3 border-b border-border px-4 py-3.5">
              <Search className="size-4 text-muted-foreground shrink-0" />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by topic, keyword, or standard..."
                className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            <div className="max-h-[min(65vh,480px)] overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <p className="px-4 py-10 text-center text-sm text-muted-foreground">
                  No matching articles found.
                </p>
              ) : (
                filtered.map((item) => {
                  const terms = parseQueryTerms(query);
                  const highlightedTitle = highlightText(item.title, terms);
                  const highlightedSnippet = highlightText(item.snippet, terms);

                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => openPost(item.href)}
                      className="flex w-full items-start gap-3 rounded-lg px-3 py-2.5 text-left transition-colors hover:bg-muted/60 cursor-pointer"
                    >
                      <span className="mt-0.5 shrink-0 rounded-md border border-border bg-secondary/80 px-2 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
                        {item.category}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-foreground">
                          {highlightedTitle}
                        </span>
                        <span className="block text-xs text-muted-foreground line-clamp-1 mt-0.5">
                          {highlightedSnippet}
                        </span>
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

