"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/blog-types";
import { getBlogPosts } from "@/lib/blog-service";
import { BlogCard } from "@/components/blog/BlogCard";
import { Navbar } from "@/components/layout/Navbar";
import { Search, Sparkles, SlidersHorizontal, ArrowLeft, BookOpen, Layers } from "lucide-react";

const CATEGORIES = [
  "All",
  "HIL Simulation",
  "RTOS & Firmware",
  "Hardware Design",
  "Embedded Systems",
];

export default function BlogIndexPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getBlogPosts();
        setPosts(data);
      } catch (err) {
        console.error("Failed to load blog posts:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" ||
        post.category.toLowerCase() === selectedCategory.toLowerCase();

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        q === "" ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  // Featured post is the first marked as featured or the first post
  const featuredPost = useMemo(() => {
    return posts.find((p) => p.featured) || posts[0];
  }, [posts]);

  // Remaining posts for grid
  const gridPosts = useMemo(() => {
    if (searchQuery.trim() !== "" || selectedCategory !== "All") {
      return filteredPosts;
    }
    return filteredPosts.filter((p) => p.$id !== featuredPost?.$id);
  }, [filteredPosts, featuredPost, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      <Navbar />

      {/* ── Header / Breadcrumb Bar ── */}
      <div className="border-b border-border/80 bg-background/60 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Return to Portfolio</span>
          </Link>

          <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Appwrite Cloud Telemetry Active</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-12">
        {/* ── Hero Section ── */}
        <section className="space-y-4 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Vengeance UI Editorial Hub</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-foreground">
            Aerospace & Avionics Engineering Journal
          </h1>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Technical write-ups, automated HIL simulation architectures, RTOS scheduling protocols,
            and high-frequency signal integrity benchmarks by Vikas N Dhavande.
          </p>
        </section>

        {/* ── Search & Filter Controls ── */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles by title, keywords, or tags..."
                className="w-full rounded-xl border border-border bg-card/80 pl-10 pr-4 py-2.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all shadow-xs"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Total Articles Counter */}
            <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono self-end sm:self-center">
              <Layers className="w-3.5 h-3.5" />
              <span>Showing {filteredPosts.length} {filteredPosts.length === 1 ? "article" : "articles"}</span>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all cursor-pointer border ${
                    active
                      ? "bg-foreground text-background border-foreground font-semibold shadow-xs"
                      : "bg-card/70 text-muted-foreground border-border hover:border-foreground/20 hover:text-foreground"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </section>

        {/* ── Loading State ── */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-xs font-mono text-muted-foreground">Loading articles from Appwrite Cloud...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          /* ── Empty State ── */
          <div className="py-20 text-center rounded-2xl border border-dashed border-border bg-card/30 p-8 space-y-4">
            <SlidersHorizontal className="w-8 h-8 mx-auto text-muted-foreground" />
            <h3 className="text-lg font-bold text-foreground">No articles found</h3>
            <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto">
              No engineering articles matched your search query &ldquo;{searchQuery}&rdquo; in category &ldquo;{selectedCategory}&rdquo;.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
              }}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-secondary text-secondary-foreground hover:bg-muted transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* ── Articles List / Grid ── */
          <div className="space-y-10">
            {/* Spotlight / Featured Card (shown when not filtering by search query) */}
            {searchQuery === "" && selectedCategory === "All" && featuredPost && (
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <span>Featured Whitepaper</span>
                </div>
                <BlogCard post={featuredPost} featured={true} />
              </div>
            )}

            {/* Standard Post Cards Grid */}
            <div className="space-y-4">
              {searchQuery === "" && selectedCategory === "All" && (
                <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Recent Releases & Field Notes
                </h3>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {gridPosts.map((post) => (
                  <BlogCard key={post.$id || post.slug} post={post} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
