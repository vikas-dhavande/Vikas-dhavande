import type { BlogPost } from "@/lib/blog-types";

export type BlogLinkIndexEntry = {
  blogSlug: string;
  href: string;
  title: string;
  fileStem: string;
};

const WIKILINK_PATTERN = /\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g;

export function postsToLinkIndex(posts: BlogPost[]): BlogLinkIndexEntry[] {
  return posts.map((post) => {
    const fileStem = post.segments.at(-1) ?? post.slug;
    return {
      blogSlug: post.slug,
      href: post.href,
      title: post.title,
      fileStem,
    };
  });
}

function resolveWikilinkTarget(
  target: string,
  index: BlogLinkIndexEntry[],
): BlogLinkIndexEntry | undefined {
  const normalized = target.toLowerCase().trim();
  return index.find(
    (entry) =>
      entry.fileStem.toLowerCase() === normalized ||
      entry.blogSlug.toLowerCase() === normalized ||
      entry.title.toLowerCase() === normalized,
  );
}

/** Normalize blog markdown for the website: wikilinks → clickable routes. */
export function normalizeBlogMarkdownForSite(
  markdown: string,
  index: BlogLinkIndexEntry[],
): string {
  // Protect inline code and code blocks from wikilink parsing
  const protectedSpans: string[] = [];
  let cursor = 0;

  const stash = (value: string) => {
    const token = `\x00PROTECTED_${cursor++}\x00`;
    protectedSpans.push(value);
    return token;
  };

  let working = markdown.replace(/```[\s\S]*?```/g, stash);
  working = working.replace(/`[^`\n]+`/g, stash);

  working = working.replace(WIKILINK_PATTERN, (_match, rawTarget, rawLabel) => {
    const target = String(rawTarget).trim();
    const label = rawLabel ? String(rawLabel).trim() : undefined;
    const resolved = resolveWikilinkTarget(target, index);

    if (resolved) {
      const text = (label ?? resolved.title).replace(/[[\]]/g, "");
      return `[${text}](${resolved.href})`;
    }

    const safeText = (label ?? target).replace(/[[\]]/g, "");
    const safeTarget = target
      .toLowerCase()
      .replace(/[^a-z0-9-_/]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "");

    if (!safeTarget) {
      return safeText;
    }

    return `[${safeText}](/blog/${safeTarget})`;
  });

  for (let i = protectedSpans.length - 1; i >= 0; i -= 1) {
    working = working.replace(`\x00PROTECTED_${i}\x00`, protectedSpans[i]!);
  }

  return working;
}

