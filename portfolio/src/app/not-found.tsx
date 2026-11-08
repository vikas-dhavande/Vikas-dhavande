import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16">
      <div className="text-center max-w-md mx-auto space-y-5">
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-muted border border-border">
          <FileQuestion className="size-7 text-primary" />
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">404 - Page Not Found</h1>
        <p className="text-sm text-muted-foreground leading-relaxed">
          The publication or resource you are looking for does not exist or may have been moved.
        </p>
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground shadow-xs hover:opacity-90 transition-opacity"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}

