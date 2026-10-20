"use client";

import React from "react";
import { cn } from "@/lib/utils";
import styles from "./kinetic-text-loader.module.css";

export interface KineticTextLoaderProps
  extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

export function KineticTextLoader({
  className,
  text = "Loading",
  ...props
}: KineticTextLoaderProps) {
  const letters = text.split("");

  return (
    <div
      className={cn(
        "relative flex items-center justify-center font-light",
        className,
      )}
      style={{ fontFamily: "'Roboto', sans-serif" }}
      role="status"
      aria-busy="true"
      {...props}
    >
      <span className="sr-only">{text}</span>
      <div className="relative scale-75 md:scale-90 lg:scale-100" aria-hidden="true">
        <div
          className={cn(
            "absolute z-10 top-[40px] left-[85px] w-[6px] h-[6px] bg-neutral-800 dark:bg-neutral-200 rounded-full",
            styles.dot,
          )}
        />

        <p className="relative m-0 whitespace-nowrap text-[3.75rem] text-neutral-800 dark:text-neutral-200">
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
    </div>
  );
}

export default KineticTextLoader;
