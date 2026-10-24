import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { getBlogPostBySlug, getRelatedPosts, getAllBlogSlugs } from "@/lib/blog-service";
import { ReadingProgressBar } from "@/components/blog/ReadingProgressBar";
import { TableOfContents } from "@/components/blog/TableOfContents";
import { MarkdownRenderer } from "@/components/blog/MarkdownRenderer";
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

export async function generateStaticParams() {
  const slugs = await getAllBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
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

      <article className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* ── Post Header ── */}
        <header className="max-w-3xl space-y-6 pb-10 border-b border-border/80">
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

          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground leading-[1.15]">
            {post.title}
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
            {post.excerpt}
          </p>

          {/* Author Byline */}
          <div className="pt-2 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-[#FF6D1B] via-[#E11D48] to-[#6B5FFF] p-0.5 shadow-xs">
                <div className="h-full w-full rounded-full bg-card flex items-center justify-center font-bold text-sm text-foreground">
                  {post.author.name.charAt(0)}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">{post.author.name}</p>
                <p className="text-xs text-muted-foreground">{post.author.role}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground bg-muted/30 px-3 py-1.5 rounded-lg border border-border/60">
              <Bookmark className="w-3.5 h-3.5 text-primary" />
              <span>Avionics Standard Reference</span>
            </div>
          </div>
        </header>

        {/* ── Main Layout: Content + TOC Rail ── */}
        <div className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Main Article Body (8 cols on desktop) */}
          <div className="lg:col-span-8 space-y-6">
            <MarkdownRenderer content={post.content} />

            {/* Post Tags */}
            <div className="pt-8 mt-12 border-t border-border flex flex-wrap items-center gap-2">
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

          {/* Right Rail: Table of Contents & Actions (4 cols on desktop) */}
          <aside className="hidden lg:block lg:col-span-4 sticky top-24 space-y-6">
            {/* Table of Contents */}
            <TableOfContents headings={headings} />

            {/* Share & Attribution Box */}
            <div className="p-4 rounded-xl border border-border bg-card/40 backdrop-blur-md space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-foreground uppercase tracking-wider">
                <Share2 className="w-3.5 h-3.5 text-primary" />
                <span>Reference & Citation</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Authored by {post.author.name} for the AeroSys Engineering Hub. Verified against
                aerospace HIL simulation protocols.
              </p>
              <div className="pt-2">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                >
                  <ArrowLeft className="w-3 h-3" />
                  Explore all technical whitepapers
                </Link>
              </div>
            </div>
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
