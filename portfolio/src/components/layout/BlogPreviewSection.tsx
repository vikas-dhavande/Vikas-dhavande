"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/blog-types";
import { getBlogPosts } from "@/lib/blog-service";
import { BlogCard } from "@/components/blog/BlogCard";
import { BookOpen, ArrowRight } from "lucide-react";

export function BlogPreviewSection() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const allPosts = await getBlogPosts();
        setPosts(allPosts.slice(0, 3));
      } catch (err) {
        console.error("Error loading blog preview:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (!loading && posts.length === 0) return null;

  return (
    <section
      id="blog"
      aria-label="Latest engineering blog posts and research notes"
      className="relative w-full border-b border-border bg-background/50 py-20 px-4 sm:px-6 lg:px-8 transition-colors duration-200"
    >
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Avionics & Telemetry Field Notes</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Latest Engineering Articles
            </h2>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              In-depth research notes on Hardware-in-the-Loop simulation, deterministic RTOS
              scheduling, and high-frequency hardware verification.
            </p>
          </div>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline group self-start md:self-end"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-64 rounded-xl border border-border bg-card/40 animate-pulse p-6 space-y-4"
              >
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-6 w-3/4 bg-muted rounded" />
                <div className="h-16 w-full bg-muted rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <BlogCard key={post.$id || post.slug} post={post} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
