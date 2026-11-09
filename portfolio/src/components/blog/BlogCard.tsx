"use client";

import React from "react";
import Link from "next/link";
import { BlogPost } from "@/lib/blog-types";
import { Clock, Calendar, ArrowUpRight, Tag } from "lucide-react";

interface BlogCardProps {
  post: BlogPost;
  featured?: boolean;
}

export function BlogCard({ post, featured = false }: BlogCardProps) {
  const rawDate = post.publishedAt || post.date || new Date().toISOString();
  const formattedDate = new Date(rawDate).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  const authorName =
    typeof post.author === "string" ? post.author : post.author?.name || "Vikas N Dhavande";
  const authorRole =
    typeof post.author === "object" ? post.author?.role || "Lead Avionics Engineer" : "Lead Avionics Engineer";

  const targetHref = post.href || `/blog/${post.slug}`;
  const readTime = post.readingTime || `${post.readTimeMinutes || 5} min`;

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-2xl border border-border bg-card/60 backdrop-blur-xl p-6 sm:p-8 transition-all duration-300 hover:border-foreground/30 hover:shadow-xl hover:shadow-primary/5">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8 items-start justify-between">
          <div className="flex-1 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                <Tag className="w-3 h-3" />
                {post.category}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                {formattedDate}
              </span>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Clock className="w-3.5 h-3.5" />
                {readTime}
              </span>
            </div>

            <Link href={targetHref} className="block group-hover:text-primary transition-colors">
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground group-hover:text-primary transition-colors line-clamp-2">
                {post.title}
              </h2>
            </Link>

            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed line-clamp-3">
              {post.description || post.excerpt}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-[#FF6D1B] to-[#6B5FFF] p-0.5 shadow-xs">
                  <div className="h-full w-full rounded-full bg-card flex items-center justify-center font-bold text-xs text-foreground">
                    {authorName.charAt(0)}
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">{authorName}</p>
                  <p className="text-[10px] text-muted-foreground">{authorRole}</p>
                </div>
              </div>

              <Link
                href={targetHref}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline group/btn"
              >
                Read Article
                <ArrowUpRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card/60 backdrop-blur-xl p-5 sm:p-6 transition-all duration-300 hover:border-foreground/25 hover:shadow-lg hover:shadow-primary/5">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-secondary text-secondary-foreground border border-border">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-muted-foreground text-[11px]">
            <Clock className="w-3 h-3" />
            {readTime}
          </span>
        </div>

        <Link href={targetHref} className="block">
          <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {post.description || post.excerpt}
        </p>
      </div>

      <div className="mt-5 pt-4 border-t border-border/60 flex items-center justify-between text-xs">
        <span className="text-muted-foreground text-[11px]">{formattedDate}</span>
        <Link
          href={targetHref}
          className="inline-flex items-center gap-1 font-semibold text-foreground group-hover:text-primary transition-colors"
        >
          Read <ArrowUpRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </Link>
      </div>
    </article>
  );
}
