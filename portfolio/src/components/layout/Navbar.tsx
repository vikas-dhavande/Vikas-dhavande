"use client";

import React, { useState, useEffect, useTransition } from "react";
import Link from "next/link";
import { Blobatar } from "@blobatar/react";
import { account } from "@/lib/appwrite";
import { clearCookieAction } from "@/app/actions";
import { ThemeToggleButton } from "@/components/ui/ThemeToggleButton";
import { AuthModal } from "@/components/ui/AuthModal";
import { RefreshCw } from "lucide-react";
import { triggerWebsiteRefresh } from "@/components/ui/InitialWebLoader";

interface AppwriteUser {
  $id: string;
  name: string;
  email: string;
  prefs?: {
    avatar?: string;
    role?: string;
  };
}

interface NavbarProps {
  initialUser?: AppwriteUser | null;
  initialAvatarSeed?: string | null;
}

export function Navbar({ initialUser = null, initialAvatarSeed = null }: NavbarProps) {
  const [user, setUser] = useState<AppwriteUser | null>(initialUser);

  // Avatar seed: cookie (SSR) > localStorage > null
  const [avatarSeed, setAvatarSeed] = useState<string | null>(() => {
    if (initialAvatarSeed) return initialAvatarSeed;
    if (typeof window !== "undefined") {
      return localStorage.getItem("avatar_seed");
    }
    return null;
  });

  const [loading, setLoading] = useState(!initialUser);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleRefresh = async () => {
    setRefreshing(true);
    await triggerWebsiteRefresh("Refreshing Animations & Pipeline…");
    setTimeout(() => setRefreshing(false), 800);
  };

  useEffect(() => {
    if (initialUser) {
      setLoading(false);
      return;
    }

    // Only query Appwrite if there is an existing session token/cookie/local cache
    // to avoid logging 401 errors to the browser console for guest visitors
    const hasCachedUser = typeof window !== "undefined" && !!localStorage.getItem("auth_user");
    const hasAuthCookie = typeof document !== "undefined" && document.cookie.includes("auth_user");

    if ((hasCachedUser || hasAuthCookie) && account && typeof account.get === "function") {
      account
        .get()
        .then((u) => {
          setUser(u as AppwriteUser);
          // Sync avatar seed from localStorage if not already set via cookie
          const stored = localStorage.getItem("avatar_seed");
          if (stored && !avatarSeed) setAvatarSeed(stored);
        })
        .catch(() => setUser(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }

    // Auto-sync session when tab receives focus (e.g. after popup or external auth)
    const handleFocus = () => {
      const hasSession = (typeof window !== "undefined" && !!localStorage.getItem("auth_user")) ||
        (typeof document !== "undefined" && document.cookie.includes("auth_user"));
      if (hasSession && account && typeof account.get === "function") {
        account
          .get()
          .then((u) => {
            setUser(u as AppwriteUser);
            const stored = localStorage.getItem("avatar_seed");
            if (stored) setAvatarSeed(stored);
          })
          .catch(() => {});
      }
    };

    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialUser]);

  const refreshUser = () => {
    if (account && typeof account.get === "function") {
      account
        .get()
        .then((u) => setUser(u as AppwriteUser))
        .catch(() => setUser(null));
    }
  };

  const handleAuthSuccess = (userName: string) => {
    setAvatarSeed(userName);
    refreshUser();
  };

  const handleLogout = () => {
    startTransition(async () => {
      try {
        if (account && typeof account.deleteSession === "function") {
          await account.deleteSession("current");
        }
      } catch {}

      try {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("avatar_seed");
      } catch {}

      await clearCookieAction("auth_user");
      await clearCookieAction("avatar_seed");

      setUser(null);
      setAvatarSeed(null);
      setDropdownOpen(false);
    });
  };

  const roleName = user?.prefs?.role || "Authorized User";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-xl transition-colors duration-200">
      <div className="flex w-full items-center justify-between px-4 lg:px-8 h-16">

        {/* ── Brand / Logo ── */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6D1B] via-[#E11D48] to-[#6B5FFF] p-0.5 shadow-sm transition-transform duration-200 group-hover:scale-105">
              <div className="h-full w-full rounded-full bg-card flex items-center justify-center">
                <span className="font-mono text-sm font-black text-foreground">V</span>
              </div>
            </div>
            <span className="text-base font-bold tracking-tight text-foreground group-hover:text-foreground/90">
              Vikas
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link href="#experience" className="text-muted-foreground hover:text-foreground transition-colors duration-150">Experience</Link>
            <Link href="#education" className="text-muted-foreground hover:text-foreground transition-colors duration-150">Education</Link>
            <Link href="#skills" className="text-muted-foreground hover:text-foreground transition-colors duration-150">Skills</Link>
            <Link href="#projects" className="text-muted-foreground hover:text-foreground transition-colors duration-150">Projects</Link>
            <Link href="#resources" className="text-muted-foreground hover:text-foreground transition-colors duration-150">Resources</Link>
            <Link href="#social" className="text-muted-foreground hover:text-foreground transition-colors duration-150">Social</Link>
          </nav>
        </div>

        {/* ── Right Section ── */}
        <div className="flex items-center gap-3">

          {/* Theme Toggle — always visible */}
          <ThemeToggleButton />

          {/* Quick Animation & API Refresh Trigger */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            title="Refresh animation pipeline & API cache"
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border bg-secondary/80 text-muted-foreground hover:text-foreground hover:border-foreground/20 hover:bg-muted transition-all duration-150 cursor-pointer disabled:opacity-50"
            aria-label="Refresh animation rendering and API cache"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 transition-transform duration-300 ${
                refreshing ? "animate-spin text-[#E11D48]" : "group-hover:rotate-180"
              }`}
            />
          </button>

          {loading ? (
            <div className="h-8 w-20 rounded-full bg-muted animate-pulse" />
          ) : user ? (
            /* ── Logged-In: Blobatar avatar + dropdown ── */
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2.5 rounded-full p-1 pl-2 border border-border bg-secondary/80 hover:border-foreground/20 transition-all cursor-pointer"
              >
                <div className="hidden sm:flex flex-col text-right leading-tight pr-1">
                  <span className="text-xs font-semibold text-foreground">{user.name}</span>
                  <span className="text-[10px] text-muted-foreground">{roleName}</span>
                </div>
                {/* Blobatar — deterministic avatar seeded by user name, animates on hover */}
                <div className="relative h-8 w-8 rounded-full overflow-hidden border border-border flex-shrink-0">
                  <Blobatar
                    name={avatarSeed ?? user.name}
                    animate="hover"
                    style={{ width: "100%", height: "100%" }}
                  />
                  {/* Online indicator */}
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-emerald-500 border-2 border-background" />
                </div>
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-border bg-card p-2 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 z-50">
                  {/* User info header */}
                  <div className="px-3 py-2 border-b border-border mb-1 flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full overflow-hidden border border-border flex-shrink-0">
                      <Blobatar
                        name={avatarSeed ?? user.name}
                        animate="hover"
                        style={{ width: "100%", height: "100%" }}
                      />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <p className="text-xs font-semibold text-foreground truncate">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                    <Link
                      href="/profile"
                      className="rounded-lg px-3 py-2 hover:bg-secondary hover:text-foreground transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile &amp; Account
                    </Link>
                    <a
                      href="#settings"
                      className="rounded-lg px-3 py-2 hover:bg-secondary hover:text-foreground transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Workspace Settings
                    </a>
                    <a
                      href="#billing"
                      className="rounded-lg px-3 py-2 hover:bg-secondary hover:text-foreground transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Billing &amp; Subscription
                    </a>
                  </div>
                  <div className="mt-1 pt-1 border-t border-border">
                    <button
                      onClick={handleLogout}
                      disabled={isPending}
                      className="w-full text-left rounded-lg px-3 py-2 text-xs font-medium text-[#E11D48] hover:bg-[#E11D48]/10 transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isPending ? "Signing out…" : "Sign Out"}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* ── Logged-Out: Auth Modal trigger ── */
            <div className="flex items-center gap-2 sm:gap-3">
              <AuthModal
                onAuthSuccess={handleAuthSuccess}
                trigger={
                  <button className="btn-pill-primary">
                    Login
                  </button>
                }
              />
            </div>
          )}

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile Drawer ── */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background px-4 py-4 space-y-3">
          <nav className="flex flex-col gap-2 text-sm text-muted-foreground">
            <Link href="#experience" className="py-2 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Experience</Link>
            <Link href="#education" className="py-2 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Education</Link>
            <Link href="#skills" className="py-2 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Skills</Link>
            <Link href="#projects" className="py-2 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Projects</Link>
            <Link href="#resources" className="py-2 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Resources</Link>
            <Link href="#social" className="py-2 hover:text-foreground" onClick={() => setMobileMenuOpen(false)}>Social</Link>
          </nav>
          <div className="pt-2 border-t border-border">
            {user ? (
              <button
                onClick={handleLogout}
                disabled={isPending}
                className="w-full text-center py-2 text-xs rounded-full border border-rose-500/40 text-rose-500 disabled:opacity-50"
              >
                {isPending ? "Signing out…" : "Sign Out"}
              </button>
            ) : (
              <AuthModal
                onAuthSuccess={handleAuthSuccess}
                trigger={
                  <button className="block w-full text-center py-2 text-xs rounded-full border border-border bg-secondary text-foreground cursor-pointer">
                    Login
                  </button>
                }
              />
            )}
          </div>
        </div>
      )}
    </header>
  );
}
