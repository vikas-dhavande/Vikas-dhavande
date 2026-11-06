"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRightIcon, CalendarDaysIcon, SearchIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { LinkButton } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tabs,
  TabsList,
  TabsContent,
  TabsTrigger,
} from "@/components/ui/tabs";
import type { BlogPost } from "@/lib/blog-types";

type BlogComponent15Props = {
  blogPosts: BlogPost[];
};

function BlogGrid({ posts }: { posts: BlogPost[] }) {
  if (posts.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-border px-6 py-12 text-center text-muted-foreground">
        No articles match your search.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => {
        const publishedDate = new Date(post.publishedAt);
        const formattedDate = Number.isNaN(publishedDate.getTime())
          ? post.publishedAt
          : publishedDate.toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
              timeZone: "UTC",
            });

        return (
          <Card
            key={post.slug}
            className="group h-full gap-0 overflow-hidden py-0 transition-shadow duration-300 hover:shadow-lg motion-reduce:transition-none"
          >
            <article className="flex h-full flex-col">
              <CardHeader className="p-0">
                <Link
                  href={`/blog/${post.slug}`}
                  className="block overflow-hidden"
                  aria-label={`Read ${post.title}`}
                >
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt={post.title}
                      width={1200}
                      height={750}
                      loading="lazy"
                      decoding="async"
                      className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-105 motion-reduce:transition-none"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="aspect-[16/10] w-full bg-muted"
                    />
                  )}
                </Link>
              </CardHeader>

              <CardContent className="flex flex-1 flex-col gap-4 p-5">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <CalendarDaysIcon aria-hidden="true" className="size-4" />
                    <time dateTime={post.publishedAt}>{formattedDate}</time>
                  </div>
                  <Badge variant="secondary">{post.category}</Badge>
                </div>

                <h2 className="line-clamp-2 text-lg font-semibold md:text-xl">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="transition-colors hover:text-primary focus-visible:text-primary"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>

                <div className="mt-auto flex items-center justify-between gap-4 pt-2">
                  <span className="truncate text-sm font-medium">
                    {post.author.name}
                  </span>
                  <LinkButton
                    href={`/blog/${post.slug}`}
                    size="icon"
                    variant="outline"
                    aria-label={`Read more: ${post.title}`}
                    className="shrink-0 transition-colors group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground motion-reduce:transition-none"
                  >
                    <ArrowRightIcon
                      aria-hidden="true"
                      className="size-4 -rotate-45"
                    />
                  </LinkButton>
                </div>
              </CardContent>
            </article>
          </Card>
        );
      })}
    </div>
  );
}

export function BlogComponent15({ blogPosts }: BlogComponent15Props) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(
    () => [
      "All",
      ...new Set(
        blogPosts
          .map((post) => post.category)
          .filter((category) => category !== "All")
          .sort((a, b) => a.localeCompare(b)),
      ),
    ],
    [blogPosts],
  );

  const filteredPosts = useMemo(() => {
    const query = searchQuery.trim().toLocaleLowerCase();

    return blogPosts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" || post.category === selectedCategory;
      const searchableText = [
        post.title,
        post.excerpt,
        post.category,
        post.author.name,
        ...post.tags,
      ]
        .join(" ")
        .toLocaleLowerCase();

      return matchesCategory && (!query || searchableText.includes(query));
    });
  }, [blogPosts, searchQuery, selectedCategory]);

  return (
    <section className="py-8 sm:py-16 lg:py-24">
      <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-6 lg:space-y-12 lg:px-8">
        <header className="max-w-3xl space-y-4">
          <p className="text-sm font-medium text-muted-foreground">
            Engineering journal
          </p>
          <h1 className="text-3xl font-semibold tracking-tight md:text-4xl lg:text-5xl">
            Insights and inspiration for building better products.
          </h1>
          <p className="text-lg text-muted-foreground">
            Practical engineering notes, project stories, and lessons from the
            field.
          </p>
        </header>

        <Tabs
          selectedKey={selectedCategory}
          onSelectionChange={(key) => setSelectedCategory(String(key))}
          className="gap-6"
        >
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <ScrollArea
              aria-label="Filter articles by category"
              className="w-full rounded-lg sm:w-auto"
            >
              <TabsList className="w-max min-w-full gap-1 sm:min-w-0">
                {categories.map((category) => (
                  <TabsTrigger
                    key={category}
                    id={category}
                    className="cursor-pointer px-3 text-base"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>

            <div className="relative w-full sm:max-w-xs">
              <SearchIcon
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-3 my-auto size-4 text-muted-foreground"
              />
              <Input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.currentTarget.value)}
                aria-label="Search articles"
                placeholder="Search articles"
                className="px-9"
              />
            </div>
          </div>

          {categories.map((category) => {
            const categoryPosts =
              category === "All"
                ? filteredPosts
                : filteredPosts.filter((post) => post.category === category);

            return (
              <TabsContent
                key={category}
                id={category}
                className="space-y-4"
              >
                <p className="text-sm text-muted-foreground" aria-live="polite">
                  Showing {categoryPosts.length}{" "}
                  {categoryPosts.length === 1 ? "article" : "articles"}
                </p>
                <BlogGrid posts={categoryPosts} />
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}
