"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useTheme } from "@/components/layout/ThemeProvider";

// Dynamic import with SSR disabled isolates Three.js into an asynchronous chunk,
// preventing main-thread blocking during critical Largest Contentful Paint (LCP)
const WaveGridBackground = dynamic(
  () => import("@/components/ui/wave-grid-background").then((mod) => mod.WaveGridBackground),
  {
    ssr: false,
    loading: () => <div className="absolute inset-0 z-0 bg-background/50" />,
  }
);

const FIRST_NAME = "Vikas";
const LAST_NAME = "Dhavande";
const ROLE_LINES = ["Product Engineer", "Building Products End to End"];
const LOCATION = "Bengaluru, India";

// Sizes the first name to fill ~92% of the viewport width.
const fontSizeVw = 92 / (FIRST_NAME.length * 0.55);

const istFormatter = new Intl.DateTimeFormat("en-GB", {
  timeZone: "Asia/Kolkata",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hour12: false,
});

// Live IST clock. Starts empty and fills in after mount to avoid hydration mismatch.
function ISTClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const tick = () => setTime(istFormatter.format(new Date()));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p
      className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em]"
      aria-label="Current time in India Standard Time"
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-current opacity-60" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-current" />
      </span>
      <span className="tabular-nums">{time || "--:--:--"}</span>
      <span className="opacity-60">IST</span>
    </p>
  );
}

export function IntroHeroSection() {
  const { theme } = useTheme();

  const waveColors = {
    dark: { base: "#09090b", high: "#ffffffff" },
    cyberpunk: { base: "#0c081f", high: "#00ffcc" },
    light: { base: "#f4f4f5", high: "#2563eb" },
  }[theme] || { base: "#f4f4f5", high: "#2563eb" };

  return (
    <section
      id="explore"
      aria-label="Intro"
      className="relative isolate flex min-h-[calc(100svh-4rem)] w-full items-center justify-center overflow-hidden border-b border-border bg-background transition-colors duration-300"
    >
      {/* 1. Wave background (unchanged) */}
      <WaveGridBackground
        className="absolute inset-0 z-0"
        colorBase={waveColors.base}
        colorHigh={waveColors.high}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-background/25 backdrop-blur-[1px]"
      />

      {/* 2. Giant name: first name large, surname small on the next line */}
      <h1 className="pointer-events-none relative z-[2] w-full select-none px-[2vw] text-center text-foreground transition-colors duration-300">
        <span
          className="block whitespace-nowrap font-medium leading-none tracking-tighter"
          style={{ fontSize: `min(${fontSizeVw}vw, 55svh)` }}
        >
          {FIRST_NAME}
        </span>
        <span className="mt-[1.5vw] block text-[clamp(1.1rem,3vw,2.5rem)] font-light uppercase leading-none tracking-[0.3em]">
          {LAST_NAME}
        </span>
      </h1>

      {/* 3. Top bar: IST clock */}
      <header className="absolute inset-x-0 top-0 z-[5] flex items-center justify-between px-6 py-6 text-foreground md:px-8">
        <ISTClock />
      </header>

      {/* 4. Bottom info: stacked on mobile, corners on desktop */}
      <div className="absolute inset-x-6 bottom-6 z-[5] flex flex-col gap-3 text-foreground md:inset-x-8 md:flex-row md:items-end md:justify-between">
        <p className="order-2 text-[11px] font-medium uppercase tracking-[0.18em] md:order-1">
          {LOCATION}
        </p>
        <p className="order-1 text-left text-xl font-light leading-[1.1] tracking-tight sm:text-3xl md:order-2 md:text-right md:text-5xl">
          {ROLE_LINES.map((line) => (
            <span key={line} className="block">
              {line}
            </span>
          ))}
        </p>
      </div>
    </section>
  );
}

export default IntroHeroSection;