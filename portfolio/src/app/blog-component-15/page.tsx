import { BlogComponent15 } from "@/components/shadcn-space/blocks/blog-component-15/blog-component-15";
import { getBlogPosts } from "@/lib/blog-service";

export default async function BlogComponent15Page() {
  const blogPosts = await getBlogPosts();

  return (
    <main className="min-h-screen bg-background text-foreground">
      <BlogComponent15 blogPosts={blogPosts} />
    </main>
  );
}
