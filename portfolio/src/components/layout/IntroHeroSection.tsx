import { WaveGridBackground } from "@/components/ui/wave-grid-background";

const NAME = "VIKAS";

// Roughly fills ~92% of the viewport width regardless of name length.
// Increase 0.65 slightly if the text looks too small, decrease if it overflows.
const fontSizeVw = 92 / (NAME.length * 0.65);

export function IntroHeroSection() {
  return (
    <section
      id="explore"
      aria-label="Animated intro background"
      className="relative isolate flex min-h-[calc(100svh-4rem)] w-full items-center justify-center overflow-hidden border-b border-neutral-200 bg-[#F4F4F5]"
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

      <h1
        className="pointer-events-none relative z-[2] w-full select-none whitespace-nowrap px-[4vw] text-center font-extrabold uppercase leading-none tracking-tighter text-neutral-950"
        style={{ fontSize: `${fontSizeVw}vw` }}
      >
        {NAME}
      </h1>
    </section>
  );
}