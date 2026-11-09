import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostView } from "@/components/blog/post-view";
import { TableOfContents } from "@/components/layout/toc";
import {
  getAllPosts,
  getBlogLinks,
  getPostBySegments,
} from "@/lib/blog-server";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export function generateStaticParams() {
  const posts = getAllPosts();
  const params: { slug: string[] }[] = [];

  for (const post of posts) {
    // Hierarchical path (e.g. ['avionics', 'hil-simulation-testbeds-aerospace-avionics'])
    params.push({ slug: post.segments });

    // Flat path fallback (e.g. ['hil-simulation-testbeds-aerospace-avionics'])
    const leaf = post.segments[post.segments.length - 1];
    if (post.segments.length > 1 && leaf) {
      params.push({ slug: [leaf] });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySegments(slug);
  if (!post) {
    return {
      title: "Article Not Found | AeroSys Engineering Hub",
      description: "The requested engineering article could not be located.",
    };
  }

  const authorName =
    typeof post.author === "string" ? post.author : post.author?.name || "Vikas N Dhavande";

  return {
    title: `${post.title} | AeroSys Journal`,
    description: post.description || post.excerpt,
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      type: "article",
      publishedTime: post.date,
      authors: [authorName],
      tags: post.tags,
      images: post.coverImage ? [{ url: post.coverImage }] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySegments(slug);
  if (!post) notFound();

  const allPosts = getAllPosts();
  const links = getBlogLinks(allPosts);

  return (
    <>
      <main className="relative min-w-0 py-6 md:pl-4 lg:pl-8 xl:pl-10">
        <div className="w-full min-w-0 max-w-4xl">
          <BlogPostView
            post={post}
            markdown={post.markdown}
            headings={post.headings}
          />
        </div>
      </main>
      <TableOfContents
        items={post.headings}
        currentSlug={post.slug}
        links={links}
      />
    </>
  );
}

