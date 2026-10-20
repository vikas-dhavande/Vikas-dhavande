"use client";

import React, { useState } from "react";
import { ArrowUpRight, Check, Copy, FolderGit2, Mail, MessageSquare, Send, Sparkles, Tv } from "lucide-react";
import { SocialItem } from "@/lib/portfolio-types";

const XIcon = ({ className = "h-5 w-5" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

interface SocialMediaSectionProps {
  socials: SocialItem[];
}

export function SocialMediaSection({ socials }: SocialMediaSectionProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [contactName, setContactName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [sent, setSent] = useState(false);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactEmail || !contactMessage) return;
    setSent(true);
  };

  const getPlatformIcon = (iconName: string) => {
    switch (iconName.toLowerCase()) {
      case "github":
        return <FolderGit2 className="h-5 w-5" />;
      case "twitter":
        return <XIcon className="h-4 w-4" />;
      case "linkedin":
        return <Sparkles className="h-5 w-5" />;
      case "discord":
        return <MessageSquare className="h-5 w-5" />;
      case "youtube":
        return <Tv className="h-5 w-5" />;
      default:
        return <Mail className="h-5 w-5" />;
    }
  };

  return (
    <section id="social" className="py-20 sm:py-28 border-t border-[rgba(39,39,42,0.8)] bg-black/60">
      <div className="w-full px-4 lg:px-8 max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(255,255,255,0.04)] px-3.5 py-1 text-xs text-[#D4D4D8] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EC4899]" />
              <span>Connect &amp; Collaborate</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#F4F4F5]">
              Social Media &amp; Network
            </h2>
          </div>
          <p className="max-w-md text-sm text-[#A1A1AA] leading-relaxed">
            Find me across developer platforms, social networks, or send a direct dispatch for new projects and collaborations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Social Channels List (7 cols) */}
          <div className="lg:col-span-7 flex flex-col divide-y divide-[rgba(39,39,42,0.8)] border-y border-[rgba(39,39,42,0.8)]">
            {socials.map((soc) => (
              <div
                key={soc.id}
                className="group py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-200 hover:bg-[rgba(255,255,255,0.015)] px-3 -mx-3 rounded-xl"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[rgba(39,39,42,0.8)] bg-[rgba(24,24,27,0.7)] text-white group-hover:border-[rgba(255,255,255,0.25)] transition-colors">
                    {getPlatformIcon(soc.iconName)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-white tracking-tight">
                        {soc.platform}
                      </h3>
                      {soc.isPrimary && (
                        <span className="rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(255,255,255,0.05)] px-2 py-0.2 text-[10px] font-mono text-[#A1A1AA]">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#71717A] mt-0.5">
                      {soc.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-center">
                  <button
                    onClick={() => handleCopy(soc.id, soc.handle)}
                    title="Copy handle"
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[rgba(39,39,42,0.8)] bg-[rgba(24,24,27,0.5)] px-3 py-1.5 text-xs font-mono text-[#D4D4D8] hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-colors cursor-pointer"
                  >
                    <span>{soc.handle}</span>
                    {copiedId === soc.id ? (
                      <Check className="h-3 w-3 text-[#34D399]" />
                    ) : (
                      <Copy className="h-3 w-3 text-[#71717A]" />
                    )}
                  </button>

                  <a
                    href={soc.url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex h-8 w-8 items-center justify-center rounded-lg border border-[rgba(39,39,42,0.8)] bg-[rgba(255,255,255,0.04)] text-[#A1A1AA] hover:text-white hover:border-[rgba(255,255,255,0.25)] transition-colors cursor-pointer"
                    aria-label={`Open ${soc.platform}`}
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Direct Dispatch Form (5 cols) */}
          <div className="lg:col-span-5">
            <div className="rounded-3xl border border-[rgba(39,39,42,0.8)] bg-[rgba(24,24,27,0.5)] p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-2">
                <span className="h-2 w-2 rounded-full bg-[#10B981]" />
                <h3 className="text-lg font-bold text-white tracking-tight">
                  Direct Dispatch
                </h3>
              </div>
              <p className="text-xs text-[#A1A1AA] leading-relaxed mb-6">
                Have a proposal, speaking invitation, or want to discuss engineering roles? Drop a message straight to my inbox.
              </p>

              {sent ? (
                <div className="rounded-2xl border border-[rgba(52,211,153,0.3)] bg-[rgba(52,211,153,0.08)] p-6 text-center animate-in fade-in zoom-in-95">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#34D399]/20 text-[#34D399] mb-3">
                    ✓
                  </div>
                  <h4 className="text-sm font-bold text-white">Message Dispatched!</h4>
                  <p className="text-xs text-[#A1A1AA] mt-1">
                    Thank you, Vikas will get back to <span className="text-white font-mono">{contactEmail}</span> shortly.
                  </p>
                  <button
                    onClick={() => {
                      setSent(false);
                      setContactMessage("");
                    }}
                    className="mt-4 text-xs text-[#34D399] hover:underline cursor-pointer"
                  >
                    Send another note
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSendMessage} className="flex flex-col gap-3">
                  <div>
                    <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
                      Your Name
                    </label>
                    <input
                      type="text"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Alex Miller"
                      className="w-full rounded-xl border border-[rgba(39,39,42,0.8)] bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-[#52525B] focus:border-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
                      Your Email <span className="text-[#E11D48]">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full rounded-xl border border-[rgba(39,39,42,0.8)] bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-[#52525B] focus:border-white focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono text-[#A1A1AA] mb-1.5 uppercase tracking-wider">
                      Message <span className="text-[#E11D48]">*</span>
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={contactMessage}
                      onChange={(e) => setContactMessage(e.target.value)}
                      placeholder="Tell me about your project, timeline, or idea…"
                      className="w-full resize-none rounded-xl border border-[rgba(39,39,42,0.8)] bg-black/60 px-3.5 py-2.5 text-xs text-white placeholder-[#52525B] focus:border-white focus:outline-none transition-colors"
                    />
                  </div>

                  <button
                    type="submit"
                    className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-white text-black px-6 py-3 text-xs font-bold hover:bg-white/90 transition-all cursor-pointer shadow-lg active:scale-[0.98]"
                  >
                    <span>Send Message</span>
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
