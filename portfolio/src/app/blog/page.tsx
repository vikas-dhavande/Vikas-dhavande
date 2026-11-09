import React from "react";
import { getAllPosts, getBlogLinks } from "@/lib/blog-server";
import { BlogCard } from "@/components/blog/BlogCard";
import { TableOfContents } from "@/components/layout/toc";
import { Sparkles, BookOpen } from "lucide-react";

export const metadata = {
  title: "Engineering Journal | Vikas N Dhavande",
  description:
    "Aerospace avionics, Hardware-in-the-Loop test architectures, RTOS deterministic scheduling, and IPC electronics manufacturing notes.",
};

export default function BlogIndexPage() {
  const posts = getAllPosts();
  const links = getBlogLinks(posts);

  const featuredPost = posts.find((p) => p.featured) || posts[0];
  const gridPosts = posts.filter((p) => p.slug !== featuredPost?.slug);

  const headings = [
    { id: "featured-article", title: "Featured Article", depth: 2 as const },
    { id: "all-articles", title: "All Articles", depth: 2 as const },
  ];

  return (
    <>
      <main className="relative min-w-0 py-6 md:pl-4 lg:pl-8 xl:pl-10">
        <div className="w-full min-w-0 max-w-4xl space-y-10">
          {/* Header */}
          <header className="space-y-3 border-b border-border/60 pb-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
              <BookOpen className="h-3.5 w-3.5" />
              <span>Technical Knowledge Base</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Engineering Journal &amp; Whitepapers
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Field notes, architectural whitepapers, and hardware verification
              methodologies spanning aerospace avionics, RTOS firmware, and IPC
              electronics manufacturing.
            </p>
          </header>

          {/* Featured Post */}
          {featuredPost && (
            <section id="featured-article" className="space-y-4 scroll-mt-24">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                <span>Spotlight Research</span>
              </div>
              <BlogCard post={featuredPost} featured={true} />
            </section>
          )}

          {/* Grid of All Articles */}
          <section id="all-articles" className="space-y-6 scroll-mt-24 pt-4">
            <div className="flex items-center justify-between border-b border-border/50 pb-3">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                All Publications &amp; Guides
              </h2>
              <span className="text-xs font-mono text-muted-foreground">
                {posts.length} articles indexed
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {gridPosts.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </div>
          </section>
        </div>
      </main>

      <TableOfContents
        items={headings}
        links={links}
      />
    </>
  );
}
