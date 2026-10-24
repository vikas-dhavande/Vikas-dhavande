import { HeadingItem } from "@/lib/blog-types";

/**
 * Generates URL-safe IDs for headings to connect with the Table of Contents.
 */
export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

/**
 * Extracts H2 and H3 headings from markdown content.
 * Safe to run on both server and client.
 */
export function extractHeadings(markdown: string): HeadingItem[] {
  if (!markdown) return [];
  const lines = markdown.split("\n");
  const headings: HeadingItem[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.startsWith("### ")) {
      const text = trimmed.replace("### ", "").trim();
      headings.push({ id: slugifyHeading(text), text, level: 3 });
    } else if (trimmed.startsWith("## ")) {
      const text = trimmed.replace("## ", "").trim();
      headings.push({ id: slugifyHeading(text), text, level: 2 });
    }
  }

  return headings;
}
