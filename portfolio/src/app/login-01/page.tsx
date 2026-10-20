"use client";

import React, { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/components/shadcn-space/blocks/login-01/login";
import { setCookiePreferenceAction } from "@/app/actions";

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || "/";

  const handleSuccess = (userName: string) => {
    try {
      localStorage.setItem("avatar_seed", userName);
    } catch {}

    setTimeout(() => {
      setCookiePreferenceAction("avatar_seed", userName).catch(() => {});
    }, 0);

    router.push(redirectTo);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background px-4 py-12 relative">
      <div className="absolute top-6 left-6 sm:top-8 sm:left-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full border border-[rgba(39,39,42,0.8)] bg-card px-3.5 py-1.5 text-xs font-medium text-[#A1A1AA] hover:text-white hover:border-[rgba(255,255,255,0.25)] transition-all"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Home
        </Link>
      </div>

      <div className="w-full max-w-lg">
        <LoginForm onSuccess={handleSuccess} />
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-background">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  );
}