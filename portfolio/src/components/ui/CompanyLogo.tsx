"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface CompanyLogoProps {
  company: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  isCurrent?: boolean;
}

export function CompanyLogo({
  company,
  className,
  size = "md",
  isCurrent = false,
}: CompanyLogoProps) {
  const normalized = (company || "").toLowerCase();

  const sizeClasses = {
    sm: "w-9 h-9 rounded-lg p-1.5",
    md: "w-12 h-12 sm:w-14 sm:h-14 rounded-xl p-2",
    lg: "w-16 h-16 sm:w-20 sm:h-20 rounded-2xl p-2.5",
    xl: "w-24 h-24 rounded-2xl p-3",
  }[size];

  const frostedBase =
    "relative flex shrink-0 items-center justify-center border border-border bg-card/60 backdrop-blur-md shadow-sm transition-all duration-300";

  // FOXCONN HON HAI TECHNOLOGY INDIA
  if (normalized.includes("foxconn") || normalized.includes("hon hai")) {
    return (
      <div
        className={cn(
          frostedBase,
          "rounded-xl sm:rounded-2xl",
          isCurrent && "border-[#E11D48]/60 shadow-[0_0_18px_rgba(225,29,72,0.3)] ring-1 ring-[#E11D48]/40",
          sizeClasses,
          className
        )}
        title="Foxconn Hon Hai Technology India"
      >
        <img
          src="/foxconn.png"
          alt="Foxconn Hon Hai Technology"
          className="h-full w-full object-contain p-0.5"
        />
        {isCurrent && (
          <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-black" />
          </span>
        )}
      </div>
    );
  }

  // INDIAN INSTITUTE OF SCIENCE (IISc) BENGALURU
  if (
    normalized.includes("iisc") ||
    normalized.includes("indian institute of science")
  ) {
    return (
      <div
        className={cn(
          frostedBase,
          "rounded-xl sm:rounded-2xl",
          sizeClasses,
          className
        )}
        title="Indian Institute of Science (IISc) Bengaluru"
      >
        <img
          src="/iisc.png"
          alt="Indian Institute of Science (IISc) Bengaluru Emblem"
          className="h-full w-full object-contain p-0.5 filter dark:invert dark:brightness-200 contrast-125"
        />
      </div>
    );
  }

  // BOSCH AUTOMOTIVE ELECTRONICS INDIA
  if (normalized.includes("bosch")) {
    return (
      <div
        className={cn(
          frostedBase,
          "rounded-xl sm:rounded-2xl",
          sizeClasses,
          className
        )}
        title="Bosch Automotive Electronics India"
      >
        <img
          src="/bosch.png"
          alt="Bosch Automotive Electronics"
          className="h-full w-full object-contain p-0.5 filter dark:brightness-110"
        />
      </div>
    );
  }

  // WISTRON INFOCOMM MANUFACTURING
  if (normalized.includes("wistron")) {
    return (
      <div
        className={cn(
          frostedBase,
          "rounded-xl sm:rounded-2xl",
          sizeClasses,
          className
        )}
        title="Wistron Infocomm Manufacturing"
      >
        <img
          src="/wistron.png"
          alt="Wistron Infocomm Manufacturing"
          className="h-full w-full object-contain p-0.5"
        />
      </div>
    );
  }

  // Generic fallback
  const initial = company.charAt(0).toUpperCase() || "C";
  return (
    <div
      className={cn(
        frostedBase,
        "rounded-xl font-mono font-bold text-white shadow-inner",
        sizeClasses,
        className
      )}
      title={company}
    >
      <span className="text-base font-bold text-[#E11D48]">{initial}</span>
      {isCurrent && (
        <span className="absolute -top-1 -right-1 flex h-3.5 w-3.5 z-10">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-black" />
        </span>
      )}
    </div>
  );
}

export default CompanyLogo;
