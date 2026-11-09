import Link from "next/link";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import {
  BlogArticle,
  BlogCodeBlock,
  BlogCoverImage,
  BlogHeader,
} from "@/components/blog/article";
import { MermaidDiagram } from "@/components/blog/mermaid-diagram";
import { BlogInteractions } from "@/components/blog/BlogInteractions";
import type { BlogPost, TOCHeading } from "@/lib/blog-types";
import { getAdjacentPosts, getAllPosts } from "@/lib/blog-server";
import {
  normalizeBlogMarkdownForSite,
  postsToLinkIndex,
} from "@/lib/blog-links";
import { getPostCoverSrc } from "@/lib/thumbnail";

function flattenText(node: React.ReactNode): string {
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }

  if (Array.isArray(node)) {
    return node.map(flattenText).join("");
  }

  if (node && typeof node === "object" && "props" in node) {
    const withChildren = node as { props?: { children?: React.ReactNode } };
    return flattenText(withChildren.props?.children ?? "");
  }

  return "";
}

function sanitizeMarkdown(value: string): string {
  return value
    // Strip script tags and their contents
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<script[^>]*\/>/gi, "")
    // Strip dangerous active elements
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
    .replace(/<embed\b[^>]*>/gi, "")
    // Strip all inline event handlers (onerror, onload, onclick, etc.)
    .replace(/\s+on[a-z]+\s*=\s*(['"]).*?\1/gi, "")
    .replace(/\s+on[a-z]+\s*=\s*[^>\s]+/gi, "")
    // Neutralize dangerous javascript: and vbscript: URIs
    .replace(/(href|src)\s*=\s*(['"])\s*(?:javascript|vbscript):.*?\2/gi, '$1="#"');
}

function sanitizeHref(href: unknown): string {
  if (typeof href !== "string") return "#";
  const trimmed = href.trim();
  if (/^(https?:\/\/|\/|#|mailto:)/i.test(trimmed)) {
    return trimmed;
  }
  return "#";
}

function sanitizeImgSrc(src: unknown): string {
  if (typeof src !== "string") return "";
  const trimmed = src.trim();
  if (/^(https?:\/\/|\/|data:image\/(png|jpe?g|webp|gif|svg\+xml);base64,)/i.test(trimmed)) {
    return trimmed;
  }
  return "";
}

export function BlogPostView({
  post,
  markdown,
  headings,
}: {
  post: BlogPost;
  markdown: string;
  headings: TOCHeading[];
}) {
  const { prev, next } = getAdjacentPosts(post.slug);
  const linkIndex = postsToLinkIndex(getAllPosts());
  const safeMarkdown = sanitizeMarkdown(
    normalizeBlogMarkdownForSite(markdown, linkIndex),
  );
  const coverSrc = getPostCoverSrc(post);
  let headingIndex = 0;

  const authorName =
    typeof post.author === "string" ? post.author : post.author?.name || "Vikas N Dhavande";

  return (
    <BlogArticle>
      <BlogHeader
        title={post.title}
        description={post.description}
        meta={
          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm text-muted-foreground border-b border-border/60 pb-4">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="font-medium text-foreground">{authorName}</span>
              <span aria-hidden>·</span>
              <span>{post.readingTime}</span>
              {post.inspiredBy && (
                <>
                  <span aria-hidden>·</span>
                  <span>Inspired by {post.inspiredBy}</span>
                </>
              )}
            </div>
            <div className="shrink-0">
              <Link
                href={`${post.href}/for-ai`}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-secondary/60 px-2.5 py-1 text-xs font-mono text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <span>md for AI Agents</span>
              </Link>
            </div>
          </div>
        }
      />

      <BlogCoverImage src={coverSrc} alt={`Cover image for ${post.title}`} />

      <div className="space-y-6 blog-content text-foreground">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          disallowedElements={[
            "script",
            "iframe",
            "object",
            "embed",
            "form",
            "input",
            "button",
            "style",
          ]}
          unwrapDisallowed
          components={{
            h2: ({ children }) => {
              const heading = headings[headingIndex++];
              return (
                <h2
                  id={heading?.id}
                  className="scroll-mt-24 text-2xl font-bold tracking-tight text-foreground mt-10 mb-4 border-b border-border/50 pb-2"
                >
                  {children}
                </h2>
              );
            },
            h3: ({ children }) => {
              const heading = headings[headingIndex++];
              return (
                <h3
                  id={heading?.id}
                  className="scroll-mt-24 text-xl font-semibold tracking-tight text-foreground mt-8 mb-3"
                >
                  {children}
                </h3>
              );
            },
            p: ({ children }) =>
              React.Children.toArray(children).some((child) => {
                if (!React.isValidElement(child)) return false;
                return (
                  typeof child.type === "string" &&
                  [
                    "div",
                    "figure",
                    "img",
                    "video",
                    "pre",
                    "table",
                    "ul",
                    "ol",
                  ].includes(child.type)
                );
              }) ? (
                <div className="max-w-4xl">{children}</div>
              ) : (
                <p className="max-w-4xl text-base leading-7 text-muted-foreground my-4">
                  {children}
                </p>
              ),
            blockquote: ({ children }) => (
              <blockquote className="max-w-4xl border-l-2 border-primary/60 pl-4 py-1 text-base leading-7 text-muted-foreground italic bg-muted/20 rounded-r-lg my-5">
                {children}
              </blockquote>
            ),
            ul: ({ children }) => (
              <ul className="max-w-4xl list-disc space-y-2 pl-5 text-base leading-7 text-muted-foreground my-4">
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol className="max-w-4xl list-decimal space-y-2 pl-5 text-base leading-7 text-muted-foreground my-4">
                {children}
              </ol>
            ),
            code: ({ className, children }) => {
              const language = className?.startsWith("language-")
                ? className.replace("language-", "")
                : undefined;
              const rawCode = flattenText(children).replace(/\n$/, "");
              const isInline = !className?.includes("language-");

              if (isInline) {
                return (
                  <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.9em] text-primary font-medium border border-border/60">
                    {children}
                  </code>
                );
              }

              if (language === "mermaid") {
                return <MermaidDiagram chart={rawCode} />;
              }

              return <BlogCodeBlock code={rawCode} title={language} />;
            },
            img: ({ src, alt }) => {
              const isIcon = alt?.startsWith("icon:") === true;
              const label = isIcon ? alt.slice(5) : alt;
              const safeSrc = sanitizeImgSrc(src);
              if (!safeSrc) return null;

              if (isIcon) {
                return (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={safeSrc}
                    alt={label ?? ""}
                    loading="lazy"
                    className="inline-block h-6 w-6 object-contain align-middle"
                  />
                );
              }

              return (
                <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-md my-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={safeSrc}
                    alt={label ?? ""}
                    loading="lazy"
                    className="block h-auto w-full"
                  />
                </div>
              );
            },
            video: ({ src, children }) => {
              const safeSrc = sanitizeHref(src);
              if (safeSrc === "#") return null;

              return (
                <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-md my-6">
                  <video
                    controls
                    preload="metadata"
                    playsInline
                    src={safeSrc}
                    className="block h-auto w-full bg-black"
                  >
                    {children}
                  </video>
                </div>
              );
            },
            script: () => null,
            a: ({ href, children }) => {
              const safeHref = sanitizeHref(href);
              const isVideoLink =
                safeHref !== "#" &&
                /\.(mp4|webm|ogg)(\?.*)?$/i.test(safeHref);

              if (isVideoLink) {
                return (
                  <div className="w-full max-w-4xl overflow-hidden rounded-xl border border-border bg-card shadow-md my-6">
                    <video
                      controls
                      preload="metadata"
                      playsInline
                      src={safeHref}
                      className="block h-auto w-full bg-black"
                    />
                  </div>
                );
              }

              const isExternal = safeHref.startsWith("http");

              return (
                <a
                  href={safeHref}
                  target={isExternal ? "_blank" : undefined}
                  rel={isExternal ? "noopener noreferrer" : undefined}
                  className="text-primary underline underline-offset-4 hover:opacity-80 transition-opacity"
                >
                  {children}
                </a>
              );
            },
          }}
        >
          {safeMarkdown}
        </ReactMarkdown>
      </div>

      {/* ── Blog Interactions: Reactions & Comments at bottom of article ── */}
      <section className="mt-14 pt-8 border-t border-border">
        <BlogInteractions slug={post.slug} title={post.title} />
      </section>

      {/* ── Next / Previous Navigation Cards ── */}
      <nav className="flex max-w-4xl items-start justify-between gap-6 border-t border-border pt-8 mt-12">
        {prev ? (
          <Link
            href={prev.href}
            className="group max-w-[45%] space-y-1.5 text-left p-3 rounded-lg border border-border/60 hover:border-primary/60 hover:bg-muted/40 transition-all"
          >
            <span className="text-xs uppercase tracking-wide text-muted-foreground block">
              ← Previous Article
            </span>
            <span className="block text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {prev.title}
            </span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={next.href}
            className="group max-w-[45%] space-y-1.5 text-right p-3 rounded-lg border border-border/60 hover:border-primary/60 hover:bg-muted/40 transition-all ml-auto"
          >
            <span className="text-xs uppercase tracking-wide text-muted-foreground block">
              Next Article →
            </span>
            <span className="block text-sm font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {next.title}
            </span>
          </Link>
        ) : null}
      </nav>
    </BlogArticle>
  );
}

