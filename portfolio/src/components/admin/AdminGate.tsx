"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ShieldAlert, ShieldCheck, ArrowLeft, LogOut, Loader2 } from "lucide-react";
import { account, checkUserRole, UserRoleInfo } from "@/lib/appwrite";
import LoginForm from "@/components/shadcn-space/blocks/login-01/login";

interface AdminGateProps {
  children: React.ReactNode;
}

export function AdminGate({ children }: AdminGateProps) {
  const [roleInfo, setRoleInfo] = useState<UserRoleInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  const verifyRole = async () => {
    setLoading(true);
    setError("");
    try {
      const user = await account.get();
      const info = await checkUserRole(user);
      setRoleInfo(info);
    } catch {
      setRoleInfo({ isAdmin: false, role: "guest", user: null });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    verifyRole();

    const handleAuthChange = () => {
      verifyRole();
    };
    window.addEventListener("appwrite-auth-changed", handleAuthChange);
    return () => {
      window.removeEventListener("appwrite-auth-changed", handleAuthChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await account.deleteSession("current");
      window.dispatchEvent(new Event("appwrite-auth-changed"));
      verifyRole();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to log out");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Verifying admin authorization...</p>
      </div>
    );
  }

  // 1. Not logged in -> Show login card
  if (!roleInfo || roleInfo.role === "guest") {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <ShieldCheck className="size-6" />
          </div>
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold tracking-tight">Admin Portal</h1>
            <p className="mt-1.5 text-xs text-muted-foreground">
              Sign in with your verified administrator account to manage articles.
            </p>
          </div>

          {error && (
            <p className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-xs text-destructive">
              {error}
            </p>
          )}

          <LoginForm onSuccess={verifyRole} />

          <div className="mt-6 text-center">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Return to portfolio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Logged in, but is a Member (Not Admin)
  if (!roleInfo.isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <ShieldAlert className="size-6" />
          </div>
          <h1 className="text-xl font-bold tracking-tight">Access Restricted</h1>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            You are signed in as a <span className="font-semibold text-foreground">Member</span> (
            {roleInfo.user?.email}).
          </p>
          <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
            Only accounts connected to the administrator team have permissions to create or edit
            blog articles. Members can like and comment on published articles.
          </p>

          <div className="mt-6 flex flex-col gap-2.5">
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Go to Member Dashboard
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-xs font-medium text-muted-foreground hover:bg-muted transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" /> Sign in with different account
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authenticated Admin -> render children
  return <>{children}</>;
}

