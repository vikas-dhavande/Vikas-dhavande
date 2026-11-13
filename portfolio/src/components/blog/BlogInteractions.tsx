"use client";

import { useEffect, useRef, useState } from "react";
import {
  Heart,
  Rocket,
  Lightbulb,
  ThumbsUp,
  MessageSquare,
  Send,
  Loader2,
  LogIn,
} from "lucide-react";
import { account } from "@/lib/appwrite";
import {
  getBlogReactions,
  toggleBlogReaction,
  getBlogComments,
  addBlogComment,
} from "@/lib/blog-service";
import { BlogReaction, BlogComment } from "@/lib/blog-types";
import { Models } from "appwrite";

interface BlogInteractionsProps {
  slug: string;
  title?: string;
}

export function BlogInteractions({ slug }: BlogInteractionsProps) {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [reactions, setReactions] = useState<BlogReaction>({
    likes: 12,
    rockets: 5,
    hearts: 8,
    ideas: 4,
    userReactions: [],
  });
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  const [reacting, setReacting] = useState<string | null>(null);
  const [inView, setInView] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    let active = true;

    // Check logged in user
    account
      .get()
      .then((currUser) => {
        if (!active) return;
        setUser(currUser);
        loadData(currUser.$id);
      })
      .catch(() => {
        if (!active) return;
        setUser(null);
        loadData();
      });

    const loadData = async (userId?: string) => {
      const [r, c] = await Promise.all([
        getBlogReactions(slug, userId),
        getBlogComments(slug),
      ]);
      if (active) {
        setReactions(r);
        setComments(c);
      }
    };

    return () => {
      active = false;
    };
  }, [inView, slug]);

  const handleReaction = async (type: "like" | "rocket" | "heart" | "idea") => {
    if (!user) {
      alert("Please sign in to react to this publication.");
      return;
    }

    setReacting(type);
    try {
      const updated = await toggleBlogReaction(slug, type, user.$id);
      setReactions(updated);
    } catch (err: unknown) {
      console.error("Reaction failed:", err);
    } finally {
      setReacting(null);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please sign in to submit a comment.");
      return;
    }
    if (!newComment.trim()) return;

    setSubmittingComment(true);
    try {
      const added = await addBlogComment(slug, {
        authorId: user.$id,
        authorName: user.name || user.email.split("@")[0],
        authorAvatar: "/avatar.png",
        content: newComment,
      });
      setComments((prev) => [added, ...prev]);
      setNewComment("");
    } catch (err: unknown) {
      alert(`Comment submission failed: ${err instanceof Error ? err.message : "Please try again."}`);
    } finally {
      setSubmittingComment(false);
    }
  };

  const isLiked = reactions.userReactions?.includes("like");
  const isRocketed = reactions.userReactions?.includes("rocket");
  const isHearted = reactions.userReactions?.includes("heart");
  const isIdeated = reactions.userReactions?.includes("idea");

  return (
    <div ref={containerRef} className="space-y-6">
      {/* ── Reactions Box ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <ThumbsUp className="w-3.5 h-3.5 text-primary" />
            Reactions
          </h3>
          <span className="text-[11px] font-mono text-muted-foreground">
            {reactions.likes + reactions.rockets + reactions.hearts + reactions.ideas} total
          </span>
        </div>

        {/* Reaction Buttons */}
        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => handleReaction("like")}
            disabled={reacting === "like"}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg border text-xs font-semibold transition-all ${
              isLiked
                ? "border-primary bg-primary/10 text-primary shadow-xs"
                : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title="Like this article"
          >
            <ThumbsUp className="w-4 h-4 mb-1" />
            <span className="text-[11px] font-mono">{reactions.likes}</span>
          </button>

          <button
            type="button"
            onClick={() => handleReaction("rocket")}
            disabled={reacting === "rocket"}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg border text-xs font-semibold transition-all ${
              isRocketed
                ? "border-blue-500 bg-blue-500/10 text-blue-500 shadow-xs"
                : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title="Rocket: Impressive Engineering"
          >
            <Rocket className="w-4 h-4 mb-1" />
            <span className="text-[11px] font-mono">{reactions.rockets}</span>
          </button>

          <button
            type="button"
            onClick={() => handleReaction("heart")}
            disabled={reacting === "heart"}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg border text-xs font-semibold transition-all ${
              isHearted
                ? "border-rose-500 bg-rose-500/10 text-rose-500 shadow-xs"
                : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title="Love this article"
          >
            <Heart className="w-4 h-4 mb-1" />
            <span className="text-[11px] font-mono">{reactions.hearts}</span>
          </button>

          <button
            type="button"
            onClick={() => handleReaction("idea")}
            disabled={reacting === "idea"}
            className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-lg border text-xs font-semibold transition-all ${
              isIdeated
                ? "border-amber-500 bg-amber-500/10 text-amber-500 shadow-xs"
                : "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
            title="Insightful & Useful"
          >
            <Lightbulb className="w-4 h-4 mb-1" />
            <span className="text-[11px] font-mono">{reactions.ideas}</span>
          </button>
        </div>

        {!user && (
          <p className="mt-3 text-[11px] text-muted-foreground text-center">
            Sign in as a Member to add your reaction.
          </p>
        )}
      </div>

      {/* ── Comments Section ── */}
      <div className="rounded-xl border border-border bg-card p-5 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5 text-primary" />
            Discussion ({comments.length})
          </h3>
        </div>

        {/* Comment Input */}
        {user ? (
          <form onSubmit={handleAddComment} className="space-y-2.5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <span className="font-semibold text-foreground">{user.name || user.email}</span>
              <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-medium">
                Member
              </span>
            </div>
            <textarea
              rows={3}
              placeholder="Share your thoughts, peer feedback, or questions..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full rounded-lg border border-border bg-muted/30 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 disabled:opacity-40 transition-all"
              >
                {submittingComment ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5" />
                )}
                Post Comment
              </button>
            </div>
          </form>
        ) : (
          <div className="p-3.5 rounded-lg border border-border/80 bg-muted/30 text-center space-y-2">
            <p className="text-xs text-muted-foreground">
              Sign in as a Member to join the engineering discussion.
            </p>
            <a
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
            >
              <LogIn className="w-3.5 h-3.5" />
              Sign In to Comment
            </a>
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-3 pt-2">
          {comments.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-4">
              No comments yet. Start the conversation!
            </p>
          ) : (
            comments.map((comment) => (
              <div
                key={comment.id}
                className="p-3 rounded-lg border border-border/60 bg-muted/20 space-y-1.5"
              >
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-semibold text-foreground flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded-full bg-primary/20 text-primary flex items-center justify-center text-[10px] font-bold">
                      {comment.authorName.charAt(0).toUpperCase()}
                    </span>
                    {comment.authorName}
                  </span>
                  <span className="text-muted-foreground text-[10px]">
                    {new Date(comment.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed pl-6">
                  {comment.content}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

