import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlogPostBySlug, getRelatedPosts, getAllBlogSlugs } from "@/lib/blog-service";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
import { BlogInteractions } from "@/components/blog/BlogInteractions";
import { extractHeadings } from "@/lib/blog-utils";
import { BlogCard } from "@/components/blog/BlogCard";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Tag,
  Share2,
  ChevronRight,
  Bookmark,
} from "lucide-react";

interface PostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-_]*$/i;

function isValidSingleSlug(slug: unknown): slug is string {
  return (
    typeof slug === "string" &&
    slug.length > 0 &&
    slug.length <= 150 &&
    !slug.includes("..") &&
    SLUG_PATTERN.test(slug)
  );
}

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  if (!isValidSingleSlug(slug)) {
    return {
      title: "Article Not Found | AeroSys Engineering Hub",
      description: "The requested engineering article could not be located.",
    };
  }

  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | AeroSys Engineering Hub",
      description: "The requested engineering article could not be located.",
    };
  }

  return {
    title: `${post.title} | AeroSys Engineering Journal`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  if (!isValidSingleSlug(slug)) {
    notFound();
  }

  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.slug, post.category, 2);
  const headings = extractHeadings(post.content);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* ── Sticky Reading Progress Bar ── */}
      <ReadingProgressBar />

      {/* ── Breadcrumb Bar ── */}
      <div className="border-b border-border/70 bg-background/50 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs text-muted-foreground">
          <nav className="flex items-center gap-1.5 overflow-hidden whitespace-nowrap">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
            <Link href="/blog" className="hover:text-foreground transition-colors">
              Blog
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60 shrink-0" />
            <span className="text-foreground font-medium truncate max-w-[200px] sm:max-w-md">
              {post.title}
            </span>
          </nav>

          <Link
            href="/blog"
            className="hidden sm:inline-flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Articles</span>
          </Link>
        </div>
      </div>

      <article className="max-w-[96rem] mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* ── 3-Column Layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-10 items-start">
          {/* ── Column 1: Left Rail (Navigation, Table of Contents, Citation) ── */}
          <aside className="hidden lg:block lg:col-span-3 sticky top-24 space-y-6">
            <Link
              href="/blog"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors group"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-0.5" />
              <span>Back to all publications</span>
            </Link>

            {/* Table of Contents */}
            <TableOfContents headings={headings} />

            {/* Author Citation Card */}
            <div className="p-4 rounded-xl border border-border bg-card/40 backdrop-blur-md space-y-3 shadow-xs">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-wider">
                <Share2 className="w-3.5 h-3.5 text-primary" />
                <span>Reference & Citation</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Authored by <strong className="text-foreground">{post.author.name}</strong> ({post.author.role}) for the AeroSys Engineering Hub.
              </p>
              <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-muted-foreground">
                <Bookmark className="w-3.5 h-3.5 text-primary" />
                <span>Avionics Standard Reference</span>
              </div>
            </div>
          </aside>

          {/* ── Column 2: Center Main Content (Article Header, Cover, Body, Tags) ── */}
          <main className="lg:col-span-6 space-y-8">
            {/* Post Header */}
            <header className="space-y-4 pb-6 border-b border-border/80">
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="px-3 py-1 rounded-full font-semibold bg-primary/10 text-primary border border-primary/20">
                  {post.category}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {formattedDate}
                </span>
                <span className="inline-flex items-center gap-1 text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTimeMinutes} min read
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-foreground leading-[1.2]">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {/* Cover Image */}
              {post.coverImage && (
                <div className="mt-4 rounded-xl overflow-hidden border border-border shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={post.coverImage}
                    alt={post.title}
                    className="w-full max-h-[420px] object-cover"
                  />
                </div>
              )}
            </header>

            {/* Main Article Body */}
            <div className="space-y-6">
              <MarkdownRenderer content={post.content} />

              {/* Post Tags */}
              <div className="pt-6 mt-8 border-t border-border flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5 mr-2">
                  <Tag className="w-3.5 h-3.5" /> Tags:
                </span>
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md text-xs font-mono bg-secondary text-secondary-foreground border border-border"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          </main>

          {/* ── Column 3: Right Rail (Reactions, Likes & Discussion Comments) ── */}
          <aside className="lg:col-span-3 sticky top-24 space-y-6">
            <BlogInteractions slug={post.slug} title={post.title} />
          </aside>
        </div>

        {/* ── Related Articles Section ── */}
        {relatedPosts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-border space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Related Engineering Articles
              </h2>
              <Link
                href="/blog"
                className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
              >
                View all articles <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((related) => (
                <BlogCard key={related.$id || related.slug} post={related} />
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}
