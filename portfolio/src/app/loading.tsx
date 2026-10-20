import React from "react";
import { KineticTextLoader } from "@/components/ui/kinetic-text-loader";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex min-h-screen w-full flex-col items-center justify-center bg-background text-foreground transition-colors duration-300">
      <KineticTextLoader
        size="lg"
        subtitle="Rendering Components & Assets"
      />
    </div>
  );
}
