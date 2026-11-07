"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  FileEdit,
  Trash2,
  ExternalLink,
  Search,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { AdminGate } from "@/components/admin/AdminGate";
import { getBlogPosts, deleteBlogPost } from "@/lib/blog-service";
import { BlogPost } from "@/lib/blog-types";

function AdminDashboardContent() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string>("");

  const loadPosts = async () => {
    setLoading(true);
    setActionError("");
    try {
      const data = await getBlogPosts();
      setPosts(data);
    } catch (err: unknown) {
      setActionError(err instanceof Error ? err.message : "Failed to load blog posts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleDelete = async (post: BlogPost) => {
    if (!post.$id) {
      alert("This post does not have a database ID and cannot be deleted.");
      return;
    }
    const confirmed = window.confirm(`Are you sure you want to delete "${post.title}"?`);
    if (!confirmed) return;

    setDeletingId(post.$id);
    try {
      await deleteBlogPost(post.$id);
      setPosts((prev) => prev.filter((p) => p.$id !== post.$id));
    } catch (err: unknown) {
      alert(`Delete failed: ${err instanceof Error ? err.message : "Please check Appwrite database permissions."}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-border">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Dashboard
            </Link>
            <span className="text-muted-foreground/40">•</span>
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Admin Portal
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground">
            Blog Article Manager
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Create, format, publish, and maintain engineering publications.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href="/blog"
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors"
          >
            <BookOpen className="w-4 h-4 text-muted-foreground" />
            Live Blog
            <ExternalLink className="w-3 h-3 text-muted-foreground" />
          </Link>
          <Link
            href="/admin/new"
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity"
          >
            <Plus className="w-4 h-4" />
            New Article
          </Link>
        </div>
      </div>

      {actionError && (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
          {actionError}
        </div>
      )}

      {/* Search & Quick Stats */}
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search articles by title, category, or slug..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-border bg-card pl-9 pr-4 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span>
            Total: <strong className="text-foreground">{posts.length}</strong>
          </span>
          <span>•</span>
          <span>
            Published:{" "}
            <strong className="text-emerald-500">
              {posts.filter((p) => p.status !== "draft").length}
            </strong>
          </span>
          <span>•</span>
          <span>
            Drafts:{" "}
            <strong className="text-amber-500">
              {posts.filter((p) => p.status === "draft").length}
            </strong>
          </span>
        </div>
      </div>

      {/* Posts Table / List */}
      <div className="mt-6 rounded-xl border border-border bg-card overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-12 flex flex-col items-center justify-center gap-3 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
            <p className="text-xs text-muted-foreground">Loading publications...</p>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-foreground">No publications found.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              {search ? "No articles matched your search." : "Get started by creating your first article."}
            </p>
            {!search && (
              <div className="mt-4">
                <Link
                  href="/admin/new"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground"
                >
                  <Plus className="w-4 h-4" /> Create Article
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-border bg-muted/30 text-muted-foreground uppercase font-semibold text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Title & Slug</th>
                  <th className="px-4 py-3.5">Category</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Date</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {filteredPosts.map((post) => (
                  <tr key={post.$id || post.slug} className="hover:bg-muted/20 transition-colors">
                    <td className="px-5 py-4 max-w-sm">
                      <div className="font-semibold text-foreground text-sm line-clamp-1">
                        {post.title}
                      </div>
                      <div className="text-[11px] font-mono text-muted-foreground mt-0.5">
                        /{post.slug}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground border border-border">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {post.status === "draft" ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                          <Clock className="w-3 h-3" /> Draft
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" /> Published
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-muted-foreground">
                      <div className="flex items-center gap-1 text-[11px]">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.publishedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                          title="View live article"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <Link
                          href={`/admin/edit/${post.$id || post.slug}`}
                          className="p-1.5 rounded-md hover:bg-muted text-primary transition-colors"
                          title="Edit article"
                        >
                          <FileEdit className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(post)}
                          disabled={deletingId === post.$id}
                          className="p-1.5 rounded-md hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors disabled:opacity-30"
                          title="Delete article"
                        >
                          {deletingId === post.$id ? (
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminPage() {
  return (
    <AdminGate>
      <AdminDashboardContent />
    </AdminGate>
  );
}

