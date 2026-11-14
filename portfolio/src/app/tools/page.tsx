import type { Metadata } from "next";
import { ToolsClient } from "./tools-client";

export const metadata: Metadata = {
  title: "Engineering Tools & Testbed Ecosystem | Vikas N Dhavande",
  description:
    "Curated directory of avionics, embedded firmware, HIL testbeds, hardware design, and protocol analysis tools utilized across mission-critical aerospace projects.",
  openGraph: {
    title: "Engineering Tools & Testbed Ecosystem | Vikas N Dhavande",
    description:
      "Avionics, embedded firmware, HIL testbeds, and hardware design tools utilized across mission-critical aerospace projects.",
    type: "website",
  },
  alternates: {
    canonical: "/tools",
  },
};

export default function ToolsPage() {
  return <ToolsClient />;
}
