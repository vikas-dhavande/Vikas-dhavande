"use client";

import React, { useState } from "react";
import { HeadingItem } from "@/lib/blog-types";
import { Copy, Check, Info, AlertTriangle, Lightbulb, ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
}

import { slugifyHeading, extractHeadings } from "@/lib/blog-utils";
export { slugifyHeading, extractHeadings };

/**
 * Code block with syntax badge and copy-to-clipboard button.
 */
function CodeBlock({ code, language }: { code: string; language: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  return (
    <div className="relative my-6 overflow-hidden rounded-xl border border-border bg-card/90 shadow-md">
      <div className="flex items-center justify-between border-b border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground font-mono">
        <span className="uppercase tracking-wider font-semibold text-[11px] text-foreground">
          {language || "code"}
        </span>
        <button
          onClick={handleCopy}
          type="button"
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          aria-label="Copy code block"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-emerald-500 font-medium">Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div className="overflow-x-auto p-4 text-xs sm:text-sm font-mono leading-relaxed text-foreground">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}

/**
 * Helper to render inline formatting (bold, italic, code, links).
 */
function renderInlineFormatting(text: string): React.ReactNode {
  // Split by inline code: `code`
  const codeParts = text.split(/(`[^`]+`)/g);

  return codeParts.map((part, idx) => {
    if (part.startsWith("`") && part.endsWith("`")) {
      const codeContent = part.slice(1, -1);
      return (
        <code
          key={idx}
          className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-xs text-primary font-medium border border-border/60"
        >
          {codeContent}
        </code>
      );
    }

    // Process bold (**text**) and links ([text](url))
    const linkMatch = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
    if (linkMatch) {
      const before = part.slice(0, linkMatch.index);
      const linkText = linkMatch[1];
      const linkUrl = linkMatch[2];
      const after = part.slice((linkMatch.index || 0) + linkMatch[0].length);

      return (
        <React.Fragment key={idx}>
          {before}
          <a
            href={linkUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-4 hover:opacity-80 inline-flex items-center gap-0.5"
          >
            {linkText}
            <ExternalLink className="w-3 h-3 inline-block" />
          </a>
          {renderInlineFormatting(after)}
        </React.Fragment>
      );
    }

    // Bold formatting
    const boldParts = part.split(/(\*\*[^*]+\*\*)/g);
    return boldParts.map((bPart, bIdx) => {
      if (bPart.startsWith("**") && bPart.endsWith("**")) {
        return (
          <strong key={`${idx}-${bIdx}`} className="font-semibold text-foreground">
            {bPart.slice(2, -2)}
          </strong>
        );
      }
      return bPart;
    });
  });
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  if (!content) return null;

  const lines = content.split("\n");
  const renderedElements: React.ReactNode[] = [];

  let inCodeBlock = false;
  let codeBuffer: string[] = [];
  let codeLanguage = "";
  let inAlert = false;
  let alertType: "NOTE" | "TIP" | "WARNING" = "NOTE";
  let alertBuffer: string[] = [];
  let inList = false;
  let listItems: string[] = [];

  const flushList = (key: string) => {
    if (listItems.length > 0) {
      renderedElements.push(
        <ul key={key} className="my-4 space-y-1.5 list-disc list-inside text-muted-foreground text-sm sm:text-base leading-relaxed pl-2">
          {listItems.map((item, i) => (
            <li key={i} className="pl-1">
              {renderInlineFormatting(item)}
            </li>
          ))}
        </ul>
      );
      listItems = [];
      inList = false;
    }
  };

  const flushAlert = (key: string) => {
    if (alertBuffer.length > 0) {
      const icon =
        alertType === "TIP" ? (
          <Lightbulb className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
        ) : alertType === "WARNING" ? (
          <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        ) : (
          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
        );

      const borderColor =
        alertType === "TIP"
          ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
          : alertType === "WARNING"
          ? "border-amber-500/30 bg-amber-500/5 text-amber-700 dark:text-amber-300"
          : "border-blue-500/30 bg-blue-500/5 text-blue-700 dark:text-blue-300";

      renderedElements.push(
        <div
          key={key}
          className={`my-5 flex gap-3 p-4 rounded-xl border ${borderColor} text-sm leading-relaxed`}
        >
          {icon}
          <div className="space-y-1">
            <span className="font-semibold block text-xs tracking-wider uppercase">
              {alertType}
            </span>
            <div className="text-foreground/90">
              {alertBuffer.map((line, lIdx) => (
                <p key={lIdx}>{renderInlineFormatting(line)}</p>
              ))}
            </div>
          </div>
        </div>
      );
      alertBuffer = [];
      inAlert = false;
    }
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // 1. Code Block Delimiter
    if (trimmed.startsWith("```")) {
      if (inCodeBlock) {
        // End of code block
        renderedElements.push(
          <CodeBlock
            key={`code-${index}`}
            code={codeBuffer.join("\n")}
            language={codeLanguage}
          />
        );
        codeBuffer = [];
        codeLanguage = "";
        inCodeBlock = false;
      } else {
        // Start of code block
        flushList(`list-before-code-${index}`);
        flushAlert(`alert-before-code-${index}`);
        codeLanguage = trimmed.replace("```", "").trim();
        inCodeBlock = true;
      }
      return;
    }

    if (inCodeBlock) {
      codeBuffer.push(line);
      return;
    }

    // 2. Alert / Callout Block (> [!NOTE])
    if (trimmed.startsWith("> [!")) {
      flushList(`list-before-alert-${index}`);
      inAlert = true;
      if (trimmed.includes("[!TIP]")) alertType = "TIP";
      else if (trimmed.includes("[!WARNING]")) alertType = "WARNING";
      else alertType = "NOTE";
      return;
    }

    if (inAlert) {
      if (trimmed.startsWith(">")) {
        alertBuffer.push(trimmed.replace(/^>\s?/, ""));
        return;
      } else {
        flushAlert(`alert-end-${index}`);
      }
    }

    // 3. Horizontal Rule
    if (trimmed === "---" || trimmed === "***") {
      flushList(`list-before-hr-${index}`);
      flushAlert(`alert-before-hr-${index}`);
      renderedElements.push(
        <hr key={`hr-${index}`} className="my-8 border-t border-border" />
      );
      return;
    }

    // 4. Headings
    if (trimmed.startsWith("### ")) {
      flushList(`list-before-h3-${index}`);
      flushAlert(`alert-before-h3-${index}`);
      const text = trimmed.replace("### ", "").trim();
      renderedElements.push(
        <h3
          key={`h3-${index}`}
          id={slugifyHeading(text)}
          className="text-lg sm:text-xl font-bold tracking-tight text-foreground mt-8 mb-3 scroll-mt-24"
        >
          {text}
        </h3>
      );
      return;
    }

    if (trimmed.startsWith("## ")) {
      flushList(`list-before-h2-${index}`);
      flushAlert(`alert-before-h2-${index}`);
      const text = trimmed.replace("## ", "").trim();
      renderedElements.push(
        <h2
          key={`h2-${index}`}
          id={slugifyHeading(text)}
          className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-10 mb-4 border-b border-border/50 pb-2 scroll-mt-24"
        >
          {text}
        </h2>
      );
      return;
    }

    if (trimmed.startsWith("# ")) {
      flushList(`list-before-h1-${index}`);
      flushAlert(`alert-before-h1-${index}`);
      const text = trimmed.replace("# ", "").trim();
      renderedElements.push(
        <h1
          key={`h1-${index}`}
          id={slugifyHeading(text)}
          className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground mt-8 mb-4 scroll-mt-24"
        >
          {text}
        </h1>
      );
      return;
    }

    // 5. Unordered List Items
    if (trimmed.startsWith("* ") || trimmed.startsWith("- ")) {
      inList = true;
      listItems.push(trimmed.slice(2));
      return;
    }

    if (inList && trimmed === "") {
      flushList(`list-end-${index}`);
      return;
    }

    // 6. Blockquote
    if (trimmed.startsWith("> ")) {
      flushList(`list-before-quote-${index}`);
      flushAlert(`alert-before-quote-${index}`);
      renderedElements.push(
        <blockquote
          key={`quote-${index}`}
          className="my-5 border-l-4 border-primary/60 bg-muted/20 pl-4 py-2 italic text-muted-foreground text-sm sm:text-base rounded-r-lg"
        >
          {renderInlineFormatting(trimmed.replace(/^>\s?/, ""))}
        </blockquote>
      );
      return;
    }

    // 7. Regular Paragraphs
    if (trimmed !== "") {
      flushList(`list-before-p-${index}`);
      flushAlert(`alert-before-p-${index}`);
      renderedElements.push(
        <p
          key={`p-${index}`}
          className="my-4 text-sm sm:text-base text-muted-foreground leading-relaxed font-normal"
        >
          {renderInlineFormatting(trimmed)}
        </p>
      );
    }
  });

  // Flush remaining buffers
  flushList("list-final");
  flushAlert("alert-final");

  return <div className="blog-prose space-y-2">{renderedElements}</div>;
}
