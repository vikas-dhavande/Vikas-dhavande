import { getPostBySegments } from "@/lib/blog-server";

const SEGMENT_PATTERN = /^[a-z0-9][a-z0-9-_]*$/i;
const MAX_SEGMENTS = 5;
const MAX_SEGMENT_LENGTH = 100;

function isValidSlug(slug: unknown): slug is string[] {
  if (!Array.isArray(slug) || slug.length === 0 || slug.length > MAX_SEGMENTS) {
    return false;
  }
  return slug.every(
    (segment) =>
      typeof segment === "string" &&
      segment.length > 0 &&
      segment.length <= MAX_SEGMENT_LENGTH &&
      !segment.includes("..") &&
      !segment.includes("/") &&
      !segment.includes("\\") &&
      SEGMENT_PATTERN.test(segment)
  );
}

function buildPostMarkdown(slug: string[]) {
  const post = getPostBySegments(slug);
  if (!post) return null;

  const authorName =
    typeof post.author === "string" ? post.author : post.author?.name || "Vikas N Dhavande";

  return [
    `# ${post.title}`,
    "",
    "AI-readable engineering specification of this article.",
    `Path: ${post.href}`,
    `Category: ${post.category}`,
    `Date: ${post.date}`,
    `Author: ${authorName}`,
    `Reading time: ${post.readingTime}`,
    post.description ? `Description: ${post.description}` : "",
    "",
    post.markdown.trim(),
    "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string[] }> },
) {
  const { slug } = await context.params;

  if (!isValidSlug(slug)) {
    return new Response("Bad Request: Invalid slug parameters", {
      status: 400,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

  const markdown = buildPostMarkdown(slug);

  if (!markdown) {
    return new Response("Post not found", {
      status: 404,
      headers: {
        "content-type": "text/plain; charset=utf-8",
        "x-robots-tag": "noindex, nofollow",
      },
    });
  }

  return new Response(markdown, {
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      "cache-control": "public, max-age=3600",
      "x-robots-tag": "noindex, nofollow",
    },
  });
}


