"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "motion/react";
import { ArrowUpRight } from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.7, ease: [0.21, 0.47, 0.32, 0.98] as const },
};

export function HeroSection() {
  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] w-full flex-col justify-end overflow-hidden bg-black">
      {/* Background Cinematic 3D Video Stream */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 z-0 h-full w-full object-cover"
      >
        <source
          src="https://images.shadcnspace.com/assets/video/hero-33.mp4"
          type="video/mp4"
        />
      </video>

      {/* Atmospheric Multi-layer Lighting & Gradients from DESIGN.md */}
      <div className="absolute inset-0 z-[1] bg-gradient-to-t from-black via-black/40 to-black/60" />
      <div className="pointer-events-none absolute inset-0 z-[2] flex items-center justify-center">
        <div className="h-[350px] w-[500px] rounded-full bg-gradient-to-tr from-[#E11D48]/15 via-[#3B82F6]/15 to-[#6B5FFF]/10 blur-[130px]" />
      </div>

      {/* Foreground Content Container */}
      <div className="relative z-10 flex w-full flex-1 flex-col justify-end px-4 pt-20 pb-12 sm:pb-16 lg:px-8">
        <motion.div
          {...fadeIn}
          className="flex w-full flex-col gap-6 lg:gap-10 lg:flex-row lg:items-end lg:justify-between"
        >
          {/* Left Column: Pill Badge & Display Headline */}
          <div className="flex flex-col gap-4 max-w-xl">
            <Badge
              variant="outline"
              className="h-7 w-fit rounded-full px-3.5 py-1 text-xs font-normal border-[rgba(39,39,42,0.9)] bg-[rgba(255,255,255,0.06)] text-[#F4F4F5] backdrop-blur-md"
            >
              <span className="flex h-1.5 w-1.5 rounded-full bg-[#E11D48] mr-1.5 animate-pulse" />
              Shadcnspace × Webpro Studio
            </Badge>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-medium tracking-tight text-[#F4F4F5] leading-[1.12]">
              Find a place that truly feels like home, where every moment matters.
            </h1>
          </div>

          {/* Right Column: Narrative Body & Dual Action Buttons */}
          <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8 max-w-lg lg:shrink-0">
            <p className="text-base sm:text-lg text-[#A1A1AA] leading-relaxed">
              Discover thoughtfully designed spaces that blend modern architectural comfort, timeless elegance, and
              vibrant communities, creating the perfect place to live.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button
                className="group h-11 w-full rounded-full px-6 font-medium text-black bg-white hover:bg-white/90 sm:w-fit cursor-pointer shadow-lg transition-all"
              >
                <span>Explore Portfolio</span>
                <ArrowUpRight className="ml-1.5 size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>

              <Button
                variant="outline"
                className="group h-11 w-full rounded-full px-6 font-medium border-[rgba(39,39,42,0.9)] bg-[rgba(255,255,255,0.06)] text-[#F4F4F5] backdrop-blur-md hover:bg-[rgba(255,255,255,0.12)] hover:border-[rgba(255,255,255,0.3)] sm:w-fit cursor-pointer transition-all"
              >
                <span>Partner With Us</span>
                <ArrowUpRight className="ml-1.5 size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
