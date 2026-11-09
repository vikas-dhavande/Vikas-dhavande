import * as React from "react";
import { CopyButton } from "@/components/ui/copy-button";
import { cn } from "@/lib/utils";

export function BlogArticle({ children }: { children: React.ReactNode }) {
  return (
    <article className="space-y-10 pb-16 text-foreground">
      {children}
    </article>
  );
}

export function BlogHeader({
  title,
  description,
  meta,
  titleAside,
}: {
  title: string;
  description: string;
  meta?: React.ReactNode;
  titleAside?: React.ReactNode;
}) {
  return (
    <header className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {titleAside ? <div className="sm:pt-1">{titleAside}</div> : null}
      </div>
      {description ? (
        <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
          {description}
        </p>
      ) : null}
      {meta}
    </header>
  );
}

export function BlogCoverImage({ src, alt }: { src?: string; alt: string }) {
  if (!src) return null;
  return (
    <figure className="w-full overflow-hidden rounded-xl border border-border bg-card shadow-lg">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt}
        loading="eager"
        className="block h-auto max-h-[460px] w-full object-cover"
      />
    </figure>
  );
}

export function BlogSection({
  title,
  children,
  id,
  className,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
  className?: string;
}) {
  return (
    <section id={id} className={cn("scroll-mt-24 space-y-4", className)}>
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function BlogSubsection({
  title,
  children,
  id,
}: {
  title: string;
  children: React.ReactNode;
  id?: string;
}) {
  return (
    <div id={id} className="scroll-mt-24 space-y-3">
      <h3 className="text-xl font-semibold tracking-tight text-foreground">
        {title}
      </h3>
      {children}
    </div>
  );
}

export function BlogParagraph({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-base leading-7 text-muted-foreground">
      {children}
    </p>
  );
}

export function BlogQuote({
  children,
  cite,
}: {
  children: React.ReactNode;
  cite?: string;
}) {
  return (
    <blockquote className="border-l-2 border-primary/60 pl-4 py-1 text-base leading-7 text-muted-foreground italic bg-muted/20 rounded-r-lg">
      <p>{children}</p>
      {cite ? (
        <footer className="mt-2 text-sm not-italic text-muted-foreground/80">
          — {cite}
        </footer>
      ) : null}
    </blockquote>
  );
}

export function BlogList({ items }: { items: string[] }) {
  return (
    <ul className="list-disc space-y-2 pl-5 text-base leading-7 text-muted-foreground">
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

export function BlogCodeBlock({
  code,
  title,
  className,
}: {
  code: string;
  title?: string;
  className?: string;
}) {
  const displayCode = code.trimEnd();
  const lines = displayCode.split("\n");

  return (
    <div className={cn("space-y-2 my-6", className)}>
      {title ? (
        <div className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {title}
        </div>
      ) : null}
      <div className="group/code relative overflow-hidden rounded-xl border border-border bg-[#0d1117] dark:bg-[#090d13] shadow-md">
        <CopyButton
          code={displayCode}
          className="absolute right-3 top-3 border-zinc-700 bg-zinc-900/80 opacity-0 backdrop-blur transition-opacity group-hover/code:opacity-100"
        />
        <pre className="overflow-x-auto p-4 pr-12 text-xs sm:text-sm font-mono leading-relaxed text-zinc-100">
          <code className="table min-w-max">
            {lines.map((line, index) => (
              <span className="table-row" key={`${index}-${line}`}>
                <span className="table-cell w-8 select-none pr-4 text-right text-xs text-zinc-600">
                  {index + 1}
                </span>
                <span className="table-cell whitespace-pre text-zinc-100">
                  {line || " "}
                </span>
              </span>
            ))}
          </code>
        </pre>
      </div>
    </div>
  );
}

