import React from "react";
import { Sidebar } from "@/components/layout/sidebar";
import { getAllPosts, getBlogCategories, getBlogLinks } from "@/lib/blog-server";

export default function BlogLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const posts = getAllPosts();
  const categories = getBlogCategories(posts);
  const links = getBlogLinks(posts);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[#E11D48]/30">
      {/* 3-Column Blog Shell (Seamlessly under sticky site Navbar h-14) */}
      <div className="w-full flex-1 pt-2 px-4 md:grid md:grid-cols-[240px_16px_minmax(0,1fr)] md:gap-4 md:px-6 lg:grid-cols-[260px_20px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[260px_20px_minmax(0,1fr)_220px] 2xl:max-w-[1700px] mx-auto">
        {/* Column 1: Left Sticky Sidebar */}
        <aside className="fixed top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto py-4 pr-3 md:sticky md:block">
          <Sidebar categories={categories} links={links} />
        </aside>

        {/* Diagonal Hash Pattern Divider */}
        <div className="relative hidden h-[calc(100vh-3.5rem)] w-full opacity-60 md:sticky md:top-14 md:block">
          <div
            className="absolute inset-0 border-l border-r border-border/60"
            style={{
              backgroundImage:
                "repeating-linear-gradient(-45deg, rgba(120,120,120,0.12), rgba(120,120,120,0.12) 1px, transparent 1px, transparent 6px)",
              backgroundSize: "16px 16px",
            }}
          />
        </div>

        {/* Column 2 & 3: Content + Right Rail TOC */}
        {children}
      </div>
    </div>
  );
}

