"use client";

import React, { useState, useEffect, useRef, useTransition } from "react";
import Link from "next/link";
import { Blobatar } from "@blobatar/react";
import { account } from "@/lib/appwrite";
import { clearCookieAction } from "@/app/actions";
import { ThemeToggleButton } from "@/components/ui/ThemeToggleButton";
import { AuthModal } from "@/components/ui/AuthModal";
import {
  BookOpen,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  RefreshCw,
  Users,
  type LucideIcon,
} from "lucide-react";
import { triggerWebsiteRefresh } from "@/components/ui/InitialWebLoader";

interface NavLinkItem {
  label: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

interface NavGroup {
  label: string;
  links: NavLinkItem[];
}

interface MegaMenuItem {
  id: string;
  label: string;
  groups: NavGroup[];
}

const navItems: MegaMenuItem[] = [
  {
    id: "portfolio",
    label: "Portfolio",
    groups: [
      {
        label: "About",
        links: [
          {
            label: "Experience",
            href: "#experience",
            description: "Roles and experience across my career.",
            icon: BriefcaseBusiness,
          },
          {
            label: "Education",
            href: "#education",
            description: "Academic background and learning.",
            icon: GraduationCap,
          },
        ],
      },
      {
        label: "Expertise",
        links: [
          {
            label: "Skills",
            href: "#skills",
            description: "Technologies and skills I work with.",
            icon: Code2,
          },
        ],
      },
    ],
  },
  {
    id: "work",
    label: "Work",
    groups: [
      {
        label: "Selected work",
        links: [
          {
            label: "Projects",
            href: "#projects",
            description: "A selection of projects and experiments.",
            icon: BriefcaseBusiness,
          },
          {
            label: "Blog",
            href: "/blog",
            description: "Articles, notes, and ideas.",
            icon: BookOpen,
          },
        ],
      },
    ],
  },
  {
    id: "resources",
    label: "Resources",
    groups: [
      {
        label: "Explore",
        links: [
          {
            label: "Resources",
            href: "#resources",
            description: "Useful resources and recommendations.",
            icon: BookOpen,
          },
        ],
      },
    ],
  },
  {
    id: "connect",
    label: "Connect",
    groups: [
      {
        label: "Around the web",
        links: [
          {
            label: "Social",
            href: "#social",
            description: "Find me on social platforms.",
            icon: Users,
          },
        ],
      },
    ],
  },
];

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
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [openMobileSection, setOpenMobileSection] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const desktopNavRef = useRef<HTMLElement>(null);
  const menuTriggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!desktopNavRef.current?.contains(event.target as Node)) {
        setOpenMenu(null);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;

      if (mobileMenuOpen) {
        setMobileMenuOpen(false);
        setOpenMobileSection(null);
        mobileToggleRef.current?.focus();
      }

      if (openMenu) {
        setOpenMenu(null);
        menuTriggerRefs.current[openMenu]?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen, openMenu]);

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

          {/* Desktop Mega Menu */}
          <nav
            ref={desktopNavRef}
            aria-label="Primary navigation"
            className="relative hidden items-center md:flex"
            onMouseLeave={() => setOpenMenu(null)}
          >
            <ul className="flex items-center gap-1 text-sm">
              {navItems.map((item) => {
                const isOpen = openMenu === item.id;
                const menuId = `${item.id}-mega-menu`;

                return (
                  <li
                    key={item.id}
                    className="relative"
                    onMouseEnter={() => setOpenMenu(item.id)}
                  >
                    <button
                      id={`${item.id}-trigger`}
                      ref={(element) => {
                        menuTriggerRefs.current[item.id] = element;
                      }}
                      type="button"
                      aria-expanded={isOpen}
                      aria-controls={menuId}
                      onClick={() => setOpenMenu(isOpen ? null : item.id)}
                      className={`flex items-center gap-1 rounded-lg px-3 py-2 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        isOpen
                          ? "bg-secondary text-foreground"
                          : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                      }`}
                    >
                      {item.label}
                      <svg
                        aria-hidden="true"
                        className={`h-3.5 w-3.5 transition-transform ${isOpen ? "rotate-180" : ""}`}
                        viewBox="0 0 20 20"
                        fill="none"
                      >
                        <path
                          d="m5 7.5 5 5 5-5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    <div
                      id={menuId}
                      aria-labelledby={`${item.id}-trigger`}
                      hidden={!isOpen}
                      className="fixed inset-x-4 top-16 z-50 pt-3"
                    >
                      <div className="mx-auto grid max-w-4xl gap-6 rounded-2xl border border-border bg-card p-5 shadow-2xl sm:grid-cols-2">
                        {item.groups.map((group) => (
                          <section key={group.label} aria-label={group.label}>
                            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                              {group.label}
                            </h2>
                            <ul className="space-y-1">
                              {group.links.map((link) => {
                                const Icon = link.icon;
                                return (
                                  <li key={link.href}>
                                    <Link
                                      href={link.href}
                                      onClick={() => setOpenMenu(null)}
                                      className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    >
                                      {Icon ? (
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-border bg-background text-muted-foreground transition-colors group-hover:text-foreground">
                                          <Icon aria-hidden="true" className="h-4 w-4" />
                                        </span>
                                      ) : null}
                                      <span className="min-w-0">
                                        <span className="block text-sm font-medium text-foreground">
                                          {link.label}
                                        </span>
                                        {link.description ? (
                                          <span className="mt-1 block text-xs leading-relaxed text-muted-foreground">
                                            {link.description}
                                          </span>
                                        ) : null}
                                      </span>
                                    </Link>
                                  </li>
                                );
                              })}
                            </ul>
                          </section>
                        ))}
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
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
            ref={mobileToggleRef}
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground hover:text-foreground md:hidden"
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
      <div
        id="mobile-navigation"
        hidden={!mobileMenuOpen}
        className="space-y-3 border-t border-border bg-background px-4 py-4 md:hidden"
      >
        <nav aria-label="Mobile primary navigation" className="text-sm">
          {navItems.map((item) => {
            const isOpen = openMobileSection === item.id;
            const sectionId = `mobile-${item.id}-links`;

            return (
              <section key={item.id} className="border-b border-border last:border-b-0">
                <h2>
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={sectionId}
                    onClick={() => setOpenMobileSection(isOpen ? null : item.id)}
                    className="flex w-full items-center justify-between py-3 text-left font-medium text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {item.label}
                    <svg
                      aria-hidden="true"
                      className={`h-4 w-4 text-muted-foreground transition-transform ${isOpen ? "rotate-180" : ""}`}
                      viewBox="0 0 20 20"
                      fill="none"
                    >
                      <path
                        d="m5 7.5 5 5 5-5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                </h2>
                <div id={sectionId} hidden={!isOpen} className="pb-3 pl-2">
                  {item.groups.map((group) => (
                    <div key={group.label} className="pb-3 last:pb-0">
                      <h3 className="px-2 pb-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {group.label}
                      </h3>
                      {group.links.map((link) => {
                        const Icon = link.icon;
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => {
                              setMobileMenuOpen(false);
                              setOpenMobileSection(null);
                            }}
                            className="flex items-center gap-3 rounded-lg px-2 py-2.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                          >
                            {Icon ? (
                              <Icon aria-hidden="true" className="h-4 w-4 shrink-0" />
                            ) : null}
                            <span>
                              <span className="block text-sm font-medium text-foreground">
                                {link.label}
                              </span>
                              {link.description ? (
                                <span className="mt-0.5 block text-xs text-muted-foreground">
                                  {link.description}
                                </span>
                              ) : null}
                            </span>
                          </Link>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </nav>
        <div className="border-t border-border pt-2">
          {user ? (
            <button
              onClick={handleLogout}
              disabled={isPending}
              className="w-full rounded-full border border-rose-500/40 py-2 text-center text-xs text-rose-500 disabled:opacity-50"
            >
              {isPending ? "Signing out…" : "Sign Out"}
            </button>
          ) : (
            <AuthModal
              onAuthSuccess={handleAuthSuccess}
              trigger={
                <button className="block w-full cursor-pointer rounded-full border border-border bg-secondary py-2 text-center text-xs text-foreground">
                  Login
                </button>
              }
            />
          )}
        </div>
      </div>
    </header>
  );
}
