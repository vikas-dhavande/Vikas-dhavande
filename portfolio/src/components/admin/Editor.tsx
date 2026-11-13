"use client";

import React, { useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import {
  Bold,
  Italic,
  Code,
  Heading2,
  Heading3,
  List,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  Loader2,
  Eye,
  Edit3,
  Columns,
  Workflow,
} from "lucide-react";
import dynamic from "next/dynamic";
import { uploadBlogImage } from "@/lib/appwrite";

// Lazy-load MermaidDiagram for editor preview
const MermaidDiagram = dynamic(
  () => import("@/components/blog/mermaid-diagram").then((m) => m.MermaidDiagram),
  { ssr: false }
);

interface EditorProps {
  content: string;
  onChange: (markdown: string) => void;
  placeholder?: string;
}

export function Editor({
  content,
  onChange,
  placeholder = "Write your engineering article markdown here...",
}: EditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "split" | "preview">("split");

  const insertText = (prefix: string, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.slice(start, end);

    const replacement = `${prefix}${selected || "text"}${suffix}`;
    const nextContent =
      content.slice(0, start) + replacement + content.slice(end);

    onChange(nextContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selected ? selected.length : 4),
      );
    }, 10);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const url = await uploadBlogImage(file);
      insertText(`\n![${file.name}](${url})\n`);
    } catch (err: unknown) {
      console.error("Upload failed:", err);
      alert("Image upload failed. Please verify Appwrite configuration.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col rounded-xl border border-border bg-card shadow-sm overflow-hidden">
      {/* ── Toolbar ── */}
      <div className="flex flex-wrap items-center justify-between gap-1 border-b border-border bg-muted/40 p-2 text-muted-foreground">
        <div className="flex flex-wrap items-center gap-1">
          <button
            type="button"
            onClick={() => insertText("## ")}
            title="Heading 2"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("### ")}
            title="Heading 3"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <Heading3 className="w-4 h-4" />
          </button>
          <span className="w-px h-4 bg-border mx-1" />
          <button
            type="button"
            onClick={() => insertText("**", "**")}
            title="Bold"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("*", "*")}
            title="Italic"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("`", "`")}
            title="Inline Code"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <Code className="w-4 h-4" />
          </button>
          <span className="w-px h-4 bg-border mx-1" />
          <button
            type="button"
            onClick={() => insertText("- ")}
            title="Bullet List"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <List className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("> ")}
            title="Quote"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => insertText("[", "](https://example.com)")}
            title="Link"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              insertText(
                "\n```mermaid\ngraph TD\n    A[Input] --> B[Controller]\n    B --> C[Actuator]\n```\n",
              )
            }
            title="Insert Mermaid Diagram"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer inline-flex items-center gap-1 text-xs"
          >
            <Workflow className="w-4 h-4" />
            <span className="hidden sm:inline">Mermaid</span>
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploadingImage}
            title="Upload Image to Appwrite Storage"
            className="p-1.5 rounded-lg hover:bg-secondary hover:text-foreground transition-colors cursor-pointer disabled:opacity-50"
          >
            {uploadingImage ? (
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
            ) : (
              <ImageIcon className="w-4 h-4" />
            )}
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageUpload}
            accept="image/*"
            className="hidden"
          />
        </div>

        {/* View mode toggle */}
        <div className="flex items-center gap-1 bg-background/80 rounded-lg p-0.5 border border-border">
          <button
            type="button"
            onClick={() => setViewMode("edit")}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === "edit"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Code editor only"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("split")}
            className={`hidden md:block p-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === "split"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Split pane: Edit & Live Preview"
          >
            <Columns className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("preview")}
            className={`p-1.5 rounded-md text-xs font-medium transition-colors ${
              viewMode === "preview"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title="Full preview"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── Editor Body ── */}
      <div
        className={`grid min-h-[420px] ${
          viewMode === "split"
            ? "grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-border"
            : "grid-cols-1"
        }`}
      >
        {/* Input Textarea */}
        {viewMode !== "preview" && (
          <textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-full min-h-[420px] p-4 bg-transparent font-mono text-sm leading-relaxed text-foreground resize-y outline-none placeholder:text-muted-foreground"
          />
        )}

        {/* Live Preview */}
        {viewMode !== "edit" && (
          <div className="p-5 max-h-[600px] overflow-y-auto space-y-4 bg-background/50">
            <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-b border-border/50 pb-1 mb-3">
              Live Vengeance Preview
            </div>
            <div className="prose dark:prose-invert max-w-none text-sm leading-relaxed text-foreground space-y-4">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
                components={{
                  h2: ({ children }) => (
                    <h2 className="text-xl font-bold tracking-tight text-foreground border-b border-border/60 pb-1 mt-6 mb-2">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-semibold tracking-tight text-foreground mt-4 mb-2">
                      {children}
                    </h3>
                  ),
                  code: ({ className, children }) => {
                    const language = className?.replace("language-", "");
                    const text = String(children).replace(/\n$/, "");
                    if (language === "mermaid") {
                      return <MermaidDiagram chart={text} />;
                    }
                    if (!className) {
                      return (
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary border border-border/60">
                          {children}
                        </code>
                      );
                    }
                    return (
                      <pre className="rounded-lg bg-zinc-950 p-3 font-mono text-xs text-zinc-100 overflow-x-auto my-3">
                        <code>{text}</code>
                      </pre>
                    );
                  },
                }}
              >
                {content || "*Nothing to preview yet. Start typing markdown...*"}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
