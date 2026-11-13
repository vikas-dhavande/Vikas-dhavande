"use client";

import React from "react";
import DoodleCrewFooter, {
  CrewMember,
  DoodleKind,
  FooterLink,
} from "@/components/ui/doodle-crew-footer";

const CREW_MEMBERS: CrewMember[] = [
  {
    kind: "kid",
    letter: 0,
    seat: "top",
    offset: 0,
    name: "Vanguard",
    says: "Systems nominal! Ready for launch.",
  },
  {
    kind: "bird",
    letter: 1,
    seat: "top",
    offset: 0,
    name: "Pip",
    says: "Telemetry checked and transmitting.",
  },
  {
    kind: "mushroom",
    letter: 2,
    seat: "front",
    offset: -0.08,
    scale: 0.95,
    name: "Morel",
    says: "Avionics RTOS kernel verified.",
  },
  {
    kind: "ghost",
    letter: 3,
    seat: "behind",
    offset: 0,
    name: "Specter",
    says: "Low EMI/EMC detected.",
  },
  {
    kind: "cat",
    letter: 4,
    seat: "front",
    offset: 0.2,
    flip: true,
    name: "Patch",
    says: "All circuits clear and operational.",
  },
];

const SOCIALS: FooterLink[] = [
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "GitHub", href: "https://github.com" },
  { label: "Email", href: "mailto:vikasndhavande@gmail.com" },
];

const LEGAL: FooterLink[] = [
  { label: "Privacy Policy", href: "#" },
  { label: "Terms of Service", href: "#" },
];

const DOODLES: DoodleKind[] = ["plane", "bolt", "star", "sparkle", "spiral", "flame"];

export function Footer() {
  return (
    <DoodleCrewFooter
      wordmark="VIKAS"
      brand=""
      blurb=""
      tagline=""
      columns={[]}
      actions={[]}
      crew={CREW_MEMBERS}
      socials={SOCIALS}
      legal={LEGAL}
      doodles={DOODLES}
      preset="auto"
      className="w-full border-t border-border"
    />
  );
}

export default Footer;
