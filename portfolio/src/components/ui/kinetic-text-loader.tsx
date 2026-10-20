"use client";

import React from "react";
import { cn } from "@/lib/utils";
import styles from "./kinetic-text-loader.module.css";

export interface KineticTextLoaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  showProgressBar?: boolean;
}

export function KineticTextLoader({
  className,
  text = "Loading",
  subtitle,
  size = "md",
  showProgressBar = true,
  ...props
}: KineticTextLoaderProps) {
  const letters = text.split("");

  const scaleClasses = {
    sm: "scale-60 sm:scale-75",
    md: "scale-75 md:scale-90 lg:scale-100",
    lg: "scale-90 md:scale-105 lg:scale-120",
  }[size];

  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center font-light select-none transition-all duration-300",
        className,
      )}
      style={{ fontFamily: "'Roboto', sans-serif" }}
      role="status"
      aria-busy="true"
      {...props}
    >
      <span className="sr-only">{text} {subtitle ? `- ${subtitle}` : ""}</span>
      
      {/* Kinetic Animated Typography */}
      <div className={cn("relative transition-transform duration-300", scaleClasses)} aria-hidden="true">
        {/* Kinetic Orbital Dot */}
        <div
          className={cn(
            "absolute z-10 top-[40px] left-[85px] w-[7px] h-[7px] rounded-full",
            "bg-foreground shadow-[0_0_10px_rgba(255,109,27,0.5)]",
            "dark:shadow-[0_0_12px_rgba(225,29,72,0.8)]",
            styles.dot,
          )}
        />

        <p className="relative m-0 whitespace-nowrap text-[3.75rem] font-light tracking-[2px] text-foreground transition-colors duration-200">
          {letters.map((char, index) => {
            if (index === 0 && char.toUpperCase() === "L") {
              return (
                <span
                  key={index}
                  className={cn(
                    "inline-block relative tracking-[8px] transform origin-[100%_70%]",
                    styles.letterBounce,
                  )}
                >
                  {char}
                </span>
              );
            }

            if (index === 4 && char.toLowerCase() === "i") {
              return (
                <span
                  key={index}
                  className={cn(
                    "inline-block relative tracking-[8px] transform origin-[100%_70%]",
                    styles.letterStretch,
                  )}
                >
                  {char === "i" ? "ı" : char}
                </span>
              );
            }

            return (
              <span key={index} className="inline-block relative tracking-[8px]">
                {char}
              </span>
            );
          })}
        </p>
      </div>

      {/* Optional Subtitle status */}
      {subtitle && (
        <p className="mt-4 text-xs tracking-widest font-mono uppercase text-muted-foreground animate-pulse">
          {subtitle}
        </p>
      )}

      {/* Progress Bar Line */}
      {showProgressBar && (
        <div className="mt-5 w-44 h-0.5 rounded-full overflow-hidden bg-foreground/10 relative">
          <div className="absolute inset-y-0 w-1/3 bg-gradient-to-r from-[#FF6D1B] via-[#E11D48] to-[#6B5FFF] rounded-full animate-marquee" />
        </div>
      )}
    </div>
  );
}

export default KineticTextLoader;
