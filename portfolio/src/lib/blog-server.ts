import "server-only";

import { cache } from "react";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import yaml from "js-yaml";
import type {
  BlogCategory,
  BlogLink,
  BlogPost,
  TOCHeading,
} from "@/lib/blog-types";

const BLOG_ROOT = path.join(process.cwd(), "content", "blog");
const NEW_DAYS = 21;

type Frontmatter = {
  title?: string;
  description?: string;
  excerpt?: string;
  author?: string;
  inspiredBy?: string;
  date?: string;
  publishedAt?: string;
  readingTime?: string;
  isNew?: boolean;
  ogImage?: string;
  thumbnail?: string;
  coverImage?: string;
  tags?: string[];
  featured?: boolean;
};

// In-memory module cache across server requests
let cachedPosts: BlogPost[] | null = null;
let cachedLinks: BlogLink[] | null = null;
let cachedMindmapLinks: { title: string; href: string; category: string }[] | null = null;
let cachedCategories: BlogCategory[] | null = null;
let cachedSlugMap: Map<string, BlogPost> | null = null;

export function clearBlogCache(): void {
  cachedPosts = null;
  cachedLinks = null;
  cachedMindmapLinks = null;
  cachedCategories = null;
  cachedSlugMap = null;
}

function titleCase(value: string) {
  return value
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeMarkdownSlug(slug: string, counts: Map<string, number>) {
  const nextCount = (counts.get(slug) ?? 0) + 1;
  counts.set(slug, nextCount);
  return nextCount > 1 ? `${slug}-${nextCount}` : slug;
}

export function getMarkdownHeadings(markdown: string): TOCHeading[] {
  const headingRegex = /^(#{2,3})\s+(.+)$/gm;
  const usedSlugs = new Map<string, number>();
  const headings: TOCHeading[] = [];
  let match = headingRegex.exec(markdown);

  while (match) {
    const hashes = match[1];
    const rawTitle = match[2].trim().replace(/\s+#+\s*$/, "");
    const depth: 2 | 3 = hashes.length === 3 ? 3 : 2;
    const baseSlug =
      slugifyHeading(rawTitle) || `section-${headings.length + 1}`;
    headings.push({
      id: normalizeMarkdownSlug(baseSlug, usedSlugs),
      title: rawTitle,
      depth,
    });
    match = headingRegex.exec(markdown);
  }

  return headings;
}

function getReadingTime(markdown: string) {
  const words = markdown
    .replace(/```[\s\S]*?```/g, "")
    .trim()
    .split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 220));
  return `${minutes} min`;
}

function stripMarkdown(markdown: string) {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]+\)/g, " ")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_~>-]/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .slice(0, 2500)
    .trim();
}

function collectMarkdownFiles(dir: string, acc: string[]) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name.startsWith(".")) continue;
    const abs = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      collectMarkdownFiles(abs, acc);
      continue;
    }
    if (entry.isFile() && entry.name.endsWith(".md")) {
      acc.push(abs);
    }
  }
}

function isRecentDate(date: string) {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return false;
  const diffMs = Date.now() - parsed.getTime();
  return diffMs <= NEW_DAYS * 24 * 60 * 60 * 1000;
}

export const getAllPosts = cache((): BlogPost[] => {
  if (cachedPosts) return cachedPosts;
  if (!fs.existsSync(BLOG_ROOT)) return [];
  const files: string[] = [];
  collectMarkdownFiles(BLOG_ROOT, files);

  const posts = files
    .map((absPath) => {
      const rel = path.relative(BLOG_ROOT, absPath);
      const noExt = rel.replace(/\.md$/, "");
      const segments = noExt.split(path.sep).filter(Boolean);
      const slug = segments.join("/");
      const href = `/blog/${slug}`;
      const category = titleCase(segments[0] ?? "General");

      const source = fs.readFileSync(absPath, "utf8");
      const parsed = matter(source, {
        engines: {
          yaml: (str: string) => yaml.load(str) as Record<string, unknown>,
        },
      });
      const data = parsed.data as Frontmatter;
      const markdown = parsed.content.trim();
      const headings = getMarkdownHeadings(markdown);
      const fallbackTitle = titleCase(
        segments[segments.length - 1] ?? "Untitled",
      );
      const date = data.date ?? data.publishedAt ?? "2026-01-01";
      const readingTime = data.readingTime ?? getReadingTime(markdown);
      const minutesNum = parseInt(readingTime) || 5;

      return {
        slug,
        segments,
        href,
        title: data.title ?? fallbackTitle,
        description: data.description ?? data.excerpt ?? "",
        excerpt: data.excerpt ?? data.description ?? "",
        author: {
          name: typeof data.author === "string" ? data.author : "Vikas N Dhavande",
          role: "Avionics & Systems Engineer",
        },
        inspiredBy: data.inspiredBy ?? "Technical Notes",
        date,
        publishedAt: date,
        readingTime,
        readTimeMinutes: minutesNum,
        isNew: data.isNew ?? isRecentDate(date),
        ogImage: data.ogImage,
        thumbnail: data.thumbnail ?? data.coverImage,
        coverImage: data.coverImage ?? data.thumbnail,
        tags: data.tags ?? [category],
        featured: data.featured ?? false,
        category,
        markdown,
        content: markdown,
        headings,
      } satisfies BlogPost;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  cachedPosts = posts;

  // Build slug lookup map for O(1) segment resolution
  const slugMap = new Map<string, BlogPost>();
  for (const post of posts) {
    slugMap.set(post.slug, post);
    const leaf = post.segments[post.segments.length - 1];
    if (leaf && !slugMap.has(leaf)) {
      slugMap.set(leaf, post);
    }
  }
  cachedSlugMap = slugMap;

  return posts;
});

export const getPostBySegments = cache((segments: string[]): BlogPost | undefined => {
  const allPosts = getAllPosts();
  const joined = segments.join("/");

  if (cachedSlugMap?.has(joined)) {
    return cachedSlugMap.get(joined);
  }

  const leafSlug = segments[segments.length - 1];
  if (leafSlug && cachedSlugMap?.has(leafSlug)) {
    return cachedSlugMap.get(leafSlug);
  }

  return allPosts.find((post) => {
    return (
      post.slug === joined ||
      post.segments[post.segments.length - 1] === leafSlug
    );
  });
});

export const getBlogCategories = cache((posts: BlogPost[]): BlogCategory[] => {
  if (cachedCategories) return cachedCategories;

  const byCategory = new Map<string, BlogCategory>();
  for (const post of posts) {
    const categorySlug = post.segments[0]?.toLowerCase() ?? "general";
    if (!byCategory.has(categorySlug)) {
      byCategory.set(categorySlug, {
        slug: categorySlug,
        name: titleCase(categorySlug),
        items: [],
      });
    }
    byCategory.get(categorySlug)?.items.push({
      title: post.title,
      href: post.href,
      isNew: post.isNew,
    });
  }

  const result = [...byCategory.values()]
    .map((category) => ({
      ...category,
      items: category.items.sort((a, b) => a.href.localeCompare(b.href)),
    }))
    .sort((a, b) => {
      const priorityOrder = ["avionics", "systems", "automotive"];
      const aIdx = priorityOrder.indexOf(a.slug);
      const bIdx = priorityOrder.indexOf(b.slug);
      if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx;
      if (aIdx !== -1) return -1;
      if (bIdx !== -1) return 1;
      return a.name.localeCompare(b.name);
    });

  cachedCategories = result;
  return result;
});

export const getBlogLinks = cache((posts: BlogPost[]): BlogLink[] => {
  if (cachedLinks) return cachedLinks;

  const links = posts.map((post) => ({
    title: post.title,
    href: post.href,
    category: post.category,
    description: post.description,
    searchText: stripMarkdown(post.markdown),
  }));

  cachedLinks = links;
  return links;
});

export type MindmapLink = {
  title: string;
  href: string;
  category: string;
};

export const getMindmapLinks = cache(
  (posts: BlogPost[]): MindmapLink[] => {
    if (cachedMindmapLinks) return cachedMindmapLinks;

    const links = posts.map((post) => ({
      title: post.title,
      href: post.href,
      category: post.category,
    }));

    cachedMindmapLinks = links;
    return links;
  }
);

export const getAdjacentPosts = cache((slug: string): {
  prev?: BlogPost;
  next?: BlogPost;
} => {
  const posts = getAllPosts();
  const leaf = slug.split("/").pop();
  const index = posts.findIndex(
    (post) =>
      post.slug === slug ||
      post.segments[post.segments.length - 1] === leaf,
  );
  if (index === -1) return {};
  return {
    prev: index > 0 ? posts[index - 1] : undefined,
    next: index < posts.length - 1 ? posts[index + 1] : undefined,
  };
});

export function getDefaultPostPath(): string {
  const posts = getAllPosts();
  return posts[0]?.href ?? "/blog";
}
