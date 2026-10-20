import Link from "next/link";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { WaveGridBackground } from "@/components/ui/wave-grid-background";

export function IntroHeroSection() {
  return (
    <section
      id="explore"
      aria-labelledby="intro-heading"
      className="relative isolate flex min-h-[calc(100svh-4rem)] w-full overflow-hidden border-b border-neutral-200 bg-[#F4F4F5] text-neutral-950"
    >
      <WaveGridBackground
        className="absolute inset-0 z-0"
        colorBase="#ffffff"
        colorHigh="#1100ff"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-white/[0.3]"
      />

      <div className="pointer-events-none relative z-10 mx-auto flex w-full max-w-screen-2xl flex-1 items-center justify-center px-4 py-20 sm:px-8 lg:py-24">
        <div className="flex max-w-5xl flex-col items-center text-center">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-neutral-300 bg-white/75 px-3.5 py-1.5 font-mono text-[11px] tracking-wide text-neutral-700 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0055ff]" />
            DESIGN <span className="text-neutral-400">×</span> ENGINEERING
          </span>

          <h1
            id="intro-heading"
            className="max-w-5xl text-5xl leading-[1.02] font-medium tracking-[-0.055em] text-neutral-950 sm:text-6xl lg:text-7xl xl:text-[5.5rem]"
          >
            Digital experiences,{" "}
            <span className="text-[#0055ff]">built with purpose.</span>
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-neutral-600 sm:text-lg sm:leading-8">
            I design and build thoughtful products for the web, bringing clear
            interfaces, expressive details, and dependable engineering together.
          </p>

          <div className="pointer-events-auto mt-9 flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="#showcase"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[#0055ff] px-6 text-sm font-medium text-white transition-colors hover:bg-[#0047d6] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0055ff]"
            >
              View selected work
              <ArrowUpRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Link>
            <Link
              href="#updates"
              className="group inline-flex h-12 items-center justify-center gap-2 rounded-full border border-neutral-300 bg-white/75 px-6 text-sm font-medium text-neutral-900 transition-colors hover:border-neutral-400 hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0055ff]"
            >
              Get in touch
              <ArrowDownRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:translate-y-0.5" />
            </Link>
          </div>

          <p className="mt-12 font-mono text-[10px] tracking-[0.22em] text-neutral-500 uppercase">
            Independent portfolio{" "}
            <span className="px-2 text-neutral-400">/</span> Selected work &
            ideas
          </p>
        </div>
      </div>
    </section>
  );
}
