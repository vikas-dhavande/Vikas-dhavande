import React from "react";
import { ArrowUpRight, BookOpen, Download, FileCode, FileText } from "lucide-react";
import { ResourceItem } from "@/lib/portfolio-types";

interface ResourcesSectionProps {
  resources: ResourceItem[];
}

export function ResourcesSection({ resources }: ResourcesSectionProps) {
  const getResourceIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "template":
        return <FileCode className="h-4 w-4 text-[#3B82F6]" />;
      case "cheatsheet":
        return <Download className="h-4 w-4 text-[#10B981]" />;
      case "architecture":
        return <BookOpen className="h-4 w-4 text-[#F59E0B]" />;
      default:
        return <FileText className="h-4 w-4 text-[#E11D48]" />;
    }
  };

  return (
    <section id="resources" className="py-20 sm:py-28 border-t border-border bg-background transition-colors duration-200">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-3.5 py-1 text-xs text-muted-foreground mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
              <span>Developer Knowledge</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground">
              Curated Resources
            </h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
            Starters, architectural blueprints, cheatsheets, and engineering write-ups shared for developers and teams.
          </p>
        </div>

        {/* Minimalist High-Contrast Resources List */}
        <div className="divide-y divide-border border-y border-border">
          {resources.map((res) => (
            <div
              key={res.id}
              className="group py-8 sm:py-10 transition-all duration-200 hover:bg-muted/30 px-2 sm:px-6 -mx-2 sm:-mx-6 rounded-2xl"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                {/* Left: Info */}
                <div className="flex items-start gap-4 max-w-3xl">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-border bg-secondary mt-0.5">
                    {getResourceIcon(res.type)}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded border border-border bg-secondary/60 px-2 py-0.5 text-[11px] font-mono text-muted-foreground">
                        {res.type}
                      </span>
                      {res.tag && (
                        <span className="text-xs text-muted-foreground/80">
                          • {res.tag}
                        </span>
                      )}
                      {res.formatBadge && (
                        <span className="text-xs text-muted-foreground/80">
                          ({res.formatBadge})
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight group-hover:text-foreground/90">
                      {res.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {res.description}
                    </p>
                  </div>
                </div>

                {/* Right: Direct Link Button */}
                <div className="shrink-0 self-start sm:self-center">
                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/80 px-4 py-2 text-xs font-semibold text-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all cursor-pointer shadow-sm"
                  >
                    <span>Access Resource</span>
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
