import { WaveGridBackground } from "@/components/ui/wave-grid-background";

export function IntroHeroSection() {
  return (
    <section
      id="explore"
      aria-label="Animated intro background"
      className="relative isolate flex min-h-[calc(100svh-4rem)] w-full overflow-hidden border-b border-neutral-200 bg-[#F4F4F5]"
    >
      <WaveGridBackground
        className="absolute inset-0 z-0"
        colorBase="#f7f7f8"
        colorHigh="#2904ff"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-white/[0.3]"
      />
    </section>
  );
}