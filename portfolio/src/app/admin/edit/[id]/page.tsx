"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Save,
  Send,
  Image as ImageIcon,
  Loader2,
  Trash2,
} from "lucide-react";
import { AdminGate } from "@/components/admin/AdminGate";
import { Editor } from "@/components/admin/Editor";
import { getBlogPosts, updateBlogPost, deleteBlogPost } from "@/lib/blog-service";
import { uploadBlogImage } from "@/lib/appwrite";

const CATEGORIES = [
  "Aerospace Avionics",
  "Embedded Systems",
  "HIL Simulation",
  "RTOS & Firmware",
  "Hardware Design",
  "Software Engineering",
];

interface EditPageProps {
  params: Promise<{ id: string }>;
}

function EditPostForm({ postId }: { postId: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [tagsInput, setTagsInput] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [content, setContent] = useState("");
  const [readTimeMinutes, setReadTimeMinutes] = useState(5);
  const [databaseId, setDatabaseId] = useState<string>("");

  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      setLoading(true);
      try {
        const posts = await getBlogPosts();
        const found = posts.find((p) => p.$id === postId || p.slug === postId);
        if (found) {
          setTitle(found.title);
          setSlug(found.slug);
          setExcerpt(found.excerpt);
          setCategory(found.category || CATEGORIES[0]);
          setTagsInput(Array.isArray(found.tags) ? found.tags.join(", ") : "");
          setCoverImage(found.coverImage || "");
          setContent(found.content);
          setReadTimeMinutes(found.readTimeMinutes || 5);
          if (found.$id) setDatabaseId(found.$id);
        } else {
          setError("Post not found.");
        }
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load post.");
      } finally {
        setLoading(false);
      }
    }
    fetchPost();
  }, [postId]);

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCover(true);
    try {
      const url = await uploadBlogImage(file);
      setCoverImage(url);
    } catch (err: unknown) {
      alert(`Cover image upload failed: ${err instanceof Error ? err.message : "Check storage configuration."}`);
    } finally {
      setUploadingCover(false);
    }
  };

  const handleSave = async (targetStatus: "published" | "draft") => {
    if (!databaseId) {
      alert("This post does not have an Appwrite database ID and cannot be modified.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const tags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await updateBlogPost(databaseId, {
        title,
        slug,
        excerpt,
        category,
        tags,
        coverImage,
        content,
        status: targetStatus,
        readTimeMinutes: Number(readTimeMinutes) || 5,
      });

      router.push("/admin");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update publication.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!databaseId) return;
    const confirmed = window.confirm(`Are you sure you want to delete "${title}"?`);
    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteBlogPost(databaseId);
      router.push("/admin");
    } catch (err: unknown) {
      alert(`Delete failed: ${err instanceof Error ? err.message : "Unknown error"}`);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-xs text-muted-foreground">Loading publication data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border">
        <div className="space-y-1">
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to publications
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
            Edit Publication
          </h1>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting || submitting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-50"
          >
            {deleting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
            Delete
          </button>
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={submitting || deleting}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save Draft
          </button>
          <button
            type="button"
            onClick={() => handleSave("published")}
            disabled={submitting || deleting}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Publish Article
          </button>
        </div>
      </div>

      {error && (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-xs text-destructive">
          {error}
        </div>
      )}

      {/* Form Fields */}
      <div className="mt-8 space-y-6">
        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Article Title <span className="text-destructive">*</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3.5 py-2.5 text-sm text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            URL Slug
          </label>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-mono">/blog/</span>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-mono text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Summary / Excerpt
          </label>
          <textarea
            rows={2}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
            className="w-full rounded-lg border border-border bg-card px-3.5 py-2 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Read Time (Minutes)
            </label>
            <input
              type="number"
              min={1}
              max={60}
              value={readTimeMinutes}
              onChange={(e) => setReadTimeMinutes(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-foreground mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Cover Image
          </label>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <input
              type="text"
              placeholder="Image URL or upload a file..."
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="flex-1 w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
            <label className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3.5 py-2 text-xs font-medium cursor-pointer hover:bg-muted transition-colors">
              {uploadingCover ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <ImageIcon className="w-3.5 h-3.5" />
              )}
              Upload to Appwrite
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleCoverUpload}
                disabled={uploadingCover}
              />
            </label>
          </div>
          {coverImage && (
            <div className="mt-2 relative max-w-sm h-32 rounded-lg overflow-hidden border border-border">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={coverImage} alt="Cover preview" className="w-full h-full object-cover" />
            </div>
          )}
        </div>

        <div>
          <label className="block text-xs font-semibold text-foreground mb-1.5">
            Publication Content (Rich Text) <span className="text-destructive">*</span>
          </label>
          <Editor content={content} onChange={setContent} />
        </div>
      </div>
    </div>
  );
}

export default function EditPostPage({ params }: EditPageProps) {
  const resolvedParams = use(params);
  return (
    <AdminGate>
      <EditPostForm postId={resolvedParams.id} />
    </AdminGate>
  );
}

