"use client";

import React, { useState } from "react";

export function FormSection() {
  const [email, setEmail] = useState("");
  const [projectName, setProjectName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubmitted(true);
  };

  return (
    <section id="updates" className="py-16 sm:py-24 border-t border-[rgba(39,39,42,0.8)]">
      <div className="w-full px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-[rgba(39,39,42,0.8)] bg-gradient-to-b from-[rgba(255,255,255,0.04)] to-[rgba(255,255,255,0.01)] p-8 sm:p-12 backdrop-blur-xl shadow-2xl">
          {/* Subtle Ambient Glow */}
          <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-[#E11D48]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-[#3B82F6]/15 blur-3xl" />

          <div className="relative z-10 max-w-2xl mx-auto text-center flex flex-col items-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(39,39,42,0.8)] bg-[rgba(255,255,255,0.06)] px-3.5 py-1 text-xs text-[#d4d4d8] mb-4">
              <span className="h-1.5 w-1.5 rounded-full bg-[#34D399]" />
              <span>Placeholder Form</span>
            </span>

            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-[#F4F4F5]">
              Stay in the loop as we build.
            </h2>

            <p className="mt-3 text-sm text-[#A1A1AA] leading-relaxed">
              This interactive form placeholder demonstrates styled inputs and submission states conforming to the
              Lightswind design specification.
            </p>

            {submitted ? (
              <div className="mt-8 w-full rounded-2xl border border-[rgba(52,211,153,0.3)] bg-[rgba(52,211,153,0.1)] p-6 text-center animate-in fade-in zoom-in-95">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#34D399]/20 text-[#34D399] mb-3">
                  ✓
                </div>
                <h3 className="text-base font-bold text-white">Thank you for connecting!</h3>
                <p className="text-xs text-[#A1A1AA] mt-1">
                  We received your submission for <span className="text-white font-mono">{email}</span>.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-4 text-xs text-[#34D399] hover:underline cursor-pointer"
                >
                  Submit another response
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-8 w-full flex flex-col gap-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                    placeholder="Project or Organization name"
                    className="w-full rounded-full border border-[rgba(39,39,42,0.9)] bg-[rgba(255,255,255,0.06)] px-5 py-3 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full rounded-full border border-[rgba(39,39,42,0.9)] bg-[rgba(255,255,255,0.06)] px-5 py-3 text-xs text-white placeholder-[#71717A] focus:border-[#3B82F6] focus:outline-none focus:ring-1 focus:ring-[#3B82F6] transition-all"
                  />
                </div>

                <div className="mt-2 flex justify-center">
                  <button type="submit" className="btn-pill-primary w-full sm:w-auto min-w-[200px]">
                    Join Priority Access
                  </button>
                </div>
              </form>
            )}

            <p className="mt-4 text-[11px] text-[#71717A]">
              We respect your privacy. No spam. You can unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
