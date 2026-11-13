"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Blobatar } from "@blobatar/react";
import {
  ArrowRight,
  BadgeCheck,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  CircleUserRound,
  Clock3,
  FileEdit,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { Models } from "appwrite";
import dynamic from "next/dynamic";
import { account, storage, checkUserRole } from "@/lib/appwrite";

const LoginForm = dynamic(
  () => import("@/components/shadcn-space/blocks/login-01/login"),
  {
    loading: () => (
      <div className="h-96 w-full max-w-md mx-auto rounded-xl border border-border bg-card/40 animate-pulse" />
    ),
  }
);

type DashboardPreferences = Models.Preferences & {
  profileImageFileId?: string;
};

type DashboardUser = Models.User<DashboardPreferences>;

const profileBucketId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_BUCKET_ID;

function isUnauthorizedError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 401
  );
}

function formatRegistrationDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Not available"
    : new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(date);
}

export default function DashboardPage() {
  const [user, setUser] = useState<DashboardUser | null>(null);
  const [userRole, setUserRole] = useState<"admin" | "member" | "guest">("guest");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    account
      .get<DashboardPreferences>()
      .then(async (accountUser) => {
        if (!active) return;
        setUser(accountUser);
        const roleInfo = await checkUserRole(accountUser);
        if (active) setUserRole(roleInfo.role);
      })
      .catch((accountError) => {
        if (!active) return;
        setUser(null);
        setUserRole("guest");
        if (!isUnauthorizedError(accountError)) {
          setError(
            accountError instanceof Error
              ? accountError.message
              : "Could not verify your account session. Please try again."
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const handleLoginSuccess = async () => {
    setError("");
    setLoading(true);
    try {
      const currentUser = await account.get<DashboardPreferences>();
      setUser(currentUser);
      const roleInfo = await checkUserRole(currentUser);
      setUserRole(roleInfo.role);
      window.dispatchEvent(new Event("appwrite-auth-changed"));
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Could not load your account.");
    } finally {
      setLoading(false);
    }
  };

  const profileImageUrl =
    profileBucketId && user?.prefs.profileImageFileId
      ? storage.getFileView(profileBucketId, user.prefs.profileImageFileId)
      : null;
  const completionFields = [
    Boolean(user?.name.trim()),
    Boolean(user?.email.trim()),
    Boolean(user?.phone.trim()),
    Boolean(user?.prefs.profileImageFileId),
  ];
  const completion = Math.round(
    (completionFields.filter(Boolean).length / completionFields.length) * 100
  );
  const accountDetails = user
    ? [
        { label: "Email", value: user.email, icon: Mail },
        { label: "Phone", value: user.phone || "Not added", icon: Phone },
        { label: "Member since", value: formatRegistrationDate(user.registration), icon: CalendarDays },
        { label: "Account ID", value: user.$id, icon: CircleUserRound },
      ]
    : [];

  return (
    <main className="min-h-[calc(100dvh-3.5rem)] bg-background text-foreground">
      <div className="mx-auto w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-10 2xl:px-14">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 text-sm font-medium text-primary">Your account</p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Dashboard</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Your profile, account status, and shortcuts in one place.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
          >
            View portfolio
            <ArrowRight className="size-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-3" role="status">
            <div className="size-9 animate-spin rounded-full border-2 border-border border-t-primary" />
            <p className="text-sm text-muted-foreground">Checking your account…</p>
          </div>
        ) : !user ? (
          <section className="mx-auto max-w-xl rounded-2xl border border-border bg-card p-6 text-center shadow-sm sm:p-10">
            <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-muted">
              <ShieldCheck className="size-6 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold tracking-tight">Sign in to your dashboard</h2>
            <p className="mb-7 mt-2 text-sm text-muted-foreground">
              Sign in to view your account information and profile status.
            </p>
            {error && (
              <p className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <LoginForm onSuccess={handleLoginSuccess} />
          </section>
        ) : (
          <>
            <section className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary/20 via-primary/5 to-transparent sm:h-44">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(225,29,72,0.2),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(59,130,246,0.12),transparent_35%)]" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
              </div>
              <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-end sm:px-8 sm:pb-7">
                <div className="-mt-14 flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 border-card bg-muted shadow-sm sm:size-28">
                  {profileImageUrl ? (
                    // Profile images in the configured bucket are intentionally public.
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profileImageUrl} alt={`${user.name}'s profile`} className="size-full object-cover" />
                  ) : (
                    <Blobatar
                      name={user.name || user.email}
                      animate="hover"
                      style={{ width: "100%", height: "100%" }}
                    />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="truncate text-2xl font-semibold tracking-tight">
                      Welcome, {user.name || "there"}
                    </h2>
                    {userRole === "admin" ? (
                      <span className="inline-flex items-center gap-1 rounded-full border border-purple-500/40 bg-purple-500/15 px-2.5 py-1 text-xs font-semibold text-purple-600 dark:text-purple-400 shadow-xs">
                        <ShieldCheck className="size-3.5" />
                        Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full border border-blue-500/30 bg-blue-500/10 px-2.5 py-1 text-xs font-medium text-blue-600 dark:text-blue-400">
                        <UserRound className="size-3.5" />
                        Member
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
                      <BadgeCheck className="size-3.5" />
                      Signed in
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  {userRole === "admin" && (
                    <Link
                      href="/admin"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-purple-500/40 bg-purple-500/10 px-4 text-sm font-semibold text-purple-600 dark:text-purple-300 transition-colors hover:bg-purple-500/20"
                    >
                      <FileEdit className="size-4" />
                      Blog Manager
                    </Link>
                  )}
                  <Link
                    href="/profile"
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    <UserRound className="size-4" />
                    Edit profile
                  </Link>
                </div>
              </div>
            </section>

            <section aria-label="Account overview" className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Profile completeness</p>
                    <p className="mt-3 text-3xl font-semibold">{completion}%</p>
                  </div>
                  <div className="rounded-lg bg-primary/10 p-2.5 text-primary">
                    <UserRound className="size-5" />
                  </div>
                </div>
                <div
                  className="mt-4 h-2 overflow-hidden rounded-full bg-muted"
                  role="progressbar"
                  aria-label="Profile completeness"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={completion}
                >
                  <div className="h-full rounded-full bg-primary transition-[width]" style={{ width: `${completion}%` }} />
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Based on your name, email, phone, and profile photo.
                </p>
              </article>

              <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Email verification</p>
                    <p className="mt-3 text-xl font-semibold">
                      {user.emailVerification ? "Verified" : "Not verified"}
                    </p>
                  </div>
                  <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 className="size-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  {user.emailVerification
                    ? "Your email address has been verified."
                    : "Check your inbox or account settings to verify your email."}
                </p>
              </article>

              <article className="rounded-xl border border-border bg-card p-5 shadow-sm sm:col-span-2 lg:col-span-1">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Account age</p>
                    <p className="mt-3 text-xl font-semibold">{formatRegistrationDate(user.registration)}</p>
                  </div>
                  <div className="rounded-lg bg-blue-500/10 p-2.5 text-blue-600 dark:text-blue-400">
                    <Clock3 className="size-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs text-muted-foreground">
                  Your registration date from Appwrite.
                </p>
              </article>
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_0.8fr]">
              <article className="rounded-xl border border-border bg-card shadow-sm">
                <div className="border-b border-border px-5 py-4 sm:px-6">
                  <h2 className="font-semibold">Account information</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Details provided by your Appwrite account.
                  </p>
                </div>
                <dl className="grid gap-x-8 sm:grid-cols-2">
                  {accountDetails.map(({ label, value, icon: Icon }) => (
                    <div key={label} className="flex min-w-0 items-start gap-3 border-b border-border/70 px-5 py-4 last:border-b-0 sm:px-6">
                      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                      <div className="min-w-0">
                        <dt className="text-xs text-muted-foreground">{label}</dt>
                        <dd className="mt-1 break-all text-sm font-medium">{value || "Not added"}</dd>
                      </div>
                    </div>
                  ))}
                </dl>
              </article>

              <aside className="space-y-4">
                <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-emerald-500/10 p-2.5 text-emerald-600 dark:text-emerald-400">
                      <ShieldCheck className="size-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Account security</h2>
                      <p className="text-xs text-muted-foreground">Authenticated with Appwrite</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    Your account session is managed by Appwrite. Keep your sign-in details private.
                  </p>
                  <Link
                    href="/profile"
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-between rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Manage account details
                    <ArrowRight className="size-4" />
                  </Link>
                </article>

                <article className="rounded-xl border border-border bg-card p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-violet-500/10 p-2.5 text-violet-600 dark:text-violet-400">
                      <BriefcaseBusiness className="size-5" />
                    </div>
                    <div>
                      <h2 className="font-semibold">Explore portfolio</h2>
                      <p className="text-xs text-muted-foreground">Projects, experience, and skills</p>
                    </div>
                  </div>
                  <Link
                    href="/#experience"
                    className="mt-4 inline-flex min-h-11 w-full items-center justify-between rounded-lg border border-border px-4 text-sm font-medium transition-colors hover:bg-muted"
                  >
                    Explore work
                    <ArrowRight className="size-4" />
                  </Link>
                </article>
              </aside>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
