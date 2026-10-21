"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Blobatar } from "@blobatar/react";
import { ArrowLeft, LogOut, ShieldCheck, UserCheck, Sparkles, Key } from "lucide-react";
import { account } from "@/lib/appwrite";
import { clearCookieAction } from "@/app/actions";

interface UserInfo {
  name: string;
  email: string;
  $id?: string;
  registration?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserInfo | null>(null);
  const [avatarSeed, setAvatarSeed] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    // 1. Try local storage cache for instant paint
    try {
      const cached = localStorage.getItem("auth_user");
      const seed = localStorage.getItem("avatar_seed");
      if (cached) setUser(JSON.parse(cached));
      if (seed) setAvatarSeed(seed);
    } catch {}

    // 2. Fetch fresh Appwrite session
    if (account && typeof account.get === "function") {
      account
        .get()
        .then((accountUser) => {
          const u = {
            name: accountUser.name,
            email: accountUser.email,
            $id: accountUser.$id,
            registration: accountUser.registration,
          };
          setUser(u);
          try {
            localStorage.setItem("auth_user", JSON.stringify(u));
          } catch {}
        })
        .catch(() => {
          // Not authenticated
          setUser(null);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await account.deleteSession("current");
    } catch {}

    try {
      localStorage.removeItem("auth_user");
      localStorage.removeItem("avatar_seed");
    } catch {}

    await clearCookieAction("auth_user");
    await clearCookieAction("avatar_seed");

    setUser(null);
    setLoggingOut(false);
    router.push("/");
  };

  const displayName = user?.name || "Guest Visitor";
  const displayEmail = user?.email || "Not signed in";
  const seed = avatarSeed || displayName;

  return (
    <div className="min-h-screen bg-background text-foreground font-sans flex flex-col justify-between selection:bg-primary/30 transition-colors duration-300">
      {/* Background radial glow */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(225,29,72,0.12),rgba(255,255,255,0))]" />

      {/* Top Header */}
      <header className="relative z-10 w-full border-b border-border bg-background/80 backdrop-blur-xl px-4 py-4 sm:px-8">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Portfolio
          </Link>
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono text-muted-foreground">Account Portal</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 flex-1 max-w-4xl w-full mx-auto px-4 py-10 sm:py-16 flex flex-col justify-center">
        <div className="rounded-2xl border border-border bg-card/90 backdrop-blur-2xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle accent border at top */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 gap-4">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-[#E11D48]" />
              <p className="text-sm font-mono text-zinc-400">Loading account credentials…</p>
            </div>
          ) : (
            <div className="flex flex-col gap-8">
              {/* Profile Card Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-8 border-b border-border">
                <div className="flex items-center gap-5">
                  <div className="h-18 w-18 sm:h-20 sm:w-20 rounded-2xl overflow-hidden border border-border bg-card shadow-xl flex-shrink-0 p-1">
                    <Blobatar
                      name={seed}
                      animate="hover"
                      style={{ width: "100%", height: "100%", borderRadius: "12px" }}
                    />
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                        {displayName}
                      </h1>
                      {user && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400">
                          <ShieldCheck className="h-3 w-3" />
                          Verified
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 font-mono">{displayEmail}</p>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1.5">
                      <UserCheck className="h-3.5 w-3.5 text-primary" />
                      {user ? "Authenticated via Appwrite Cloud Auth" : "Guest browsing mode"}
                    </p>
                  </div>
                </div>

                {user && (
                  <button
                    onClick={handleLogout}
                    disabled={loggingOut}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 hover:bg-destructive/20 text-destructive px-4 py-2 text-xs font-semibold transition-all cursor-pointer disabled:opacity-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    {loggingOut ? "Signing out…" : "Sign Out"}
                  </button>
                )}
              </div>

              {/* Account Details Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-border bg-muted/40 p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider">
                      Identity &amp; Role
                    </span>
                    <p className="text-sm font-semibold text-foreground mt-1">
                      {user ? "Authorized Visitor / Reviewer" : "Public Explorer"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Granted access to explore project telemetry, full resume modules, and developer notes.
                  </p>
                </div>

                <div className="rounded-xl border border-border bg-muted/40 p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[11px] font-mono text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
                      <Key className="h-3 w-3 text-muted-foreground" />
                      Session Security
                    </span>
                    <p className="text-xs font-mono text-foreground mt-1 truncate">
                      {user?.$id ? `ID: ${user.$id}` : "Session: Guest Cookie Mode"}
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-3">
                    Encrypted cookie &amp; token storage scoped strictly to this origin.
                  </p>
                </div>
              </div>

              {/* Bottom Guidance */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-border text-xs text-muted-foreground">
                <p className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-primary" />
                  Need to update your info or reach out? Contact Vikas directly.
                </p>
                <Link
                  href="/#experience"
                  className="text-muted-foreground hover:text-foreground transition-colors underline underline-offset-4"
                >
                  Explore Engineering Experience →
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full border-t border-border px-4 py-4 text-center text-xs text-muted-foreground font-mono">
        Vikas N Dhavande Portfolio © {new Date().getFullYear()} — Built with Next.js 15
      </footer>
    </div>
  );
}
