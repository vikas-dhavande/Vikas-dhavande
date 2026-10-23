"use client";

import React, { useEffect, useState } from "react";
import { KineticTextLoader } from "./kinetic-text-loader";

export function InitialWebLoader() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [statusText, setStatusText] = useState("Initializing Experience…");

  useEffect(() => {
    setMounted(true);

    // Listen for custom API / Animation refresh events from UI
    const handleRefresh = (e: Event) => {
      const customEvent = e as CustomEvent<{ status?: string }>;
      setStatusText(customEvent.detail?.status || "Refreshing Animation & API…");
      setRefreshing(true);
      setVisible(true);

      setTimeout(() => {
        setVisible(false);
        setTimeout(() => setRefreshing(false), 300);
      }, 900);
    };

    window.addEventListener("trigger-web-refresh", handleRefresh);

    return () => {
      window.removeEventListener("trigger-web-refresh", handleRefresh);
    };
  }, []);

  if (!mounted) return null;
  if (!visible && !refreshing) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-xl transition-all duration-300 ${
        visible ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
      }`}
      aria-live="polite"
    >
      <KineticTextLoader
        size="lg"
        subtitle={statusText}
        showProgressBar={true}
      />
    </div>
  );
}

/**
 * Trigger the kinetic web loader and backend API refresh from anywhere in the application.
 */
export async function triggerWebsiteRefresh(customStatus?: string): Promise<boolean> {
  if (typeof window === "undefined") return false;

  window.dispatchEvent(
    new CustomEvent("trigger-web-refresh", {
      detail: { status: customStatus || "Refreshing Pipeline & Cache…" },
    })
  );

  try {
    const res = await fetch("/api/refresh", { method: "POST" });
    const data = await res.json();
    return data.success;
  } catch {
    return false;
  }
}
