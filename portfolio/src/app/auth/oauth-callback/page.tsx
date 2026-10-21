"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { account } from "@/lib/appwrite";

function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"processing" | "success" | "error">("processing");
  const [message, setMessage] = useState("Verifying authentication…");

  useEffect(() => {
    const isError = searchParams.get("error") === "true";
    const provider = searchParams.get("provider") || "OAuth";
    const errorMessage = searchParams.get("message");

    const notifyParent = (type: "APPWRITE_OAUTH_SUCCESS" | "APPWRITE_OAUTH_FAILURE", payload: Record<string, unknown> = {}) => {
      if (window.opener && !window.opener.closed) {
        window.opener.postMessage({ type, ...payload }, window.location.origin);
      }
    };

    if (isError) {
      setStatus("error");
      const errText =
        errorMessage ||
        (provider === "google"
          ? "Google OAuth provider is not configured in Appwrite (HTTP 412). Please check Appwrite console settings."
          : `${provider} authentication was cancelled or failed.`);
      setMessage(errText);
      notifyParent("APPWRITE_OAUTH_FAILURE", { message: errText });

      setTimeout(() => {
        if (window.opener) {
          window.close();
        } else {
          router.push("/");
        }
      }, 2000);
      return;
    }

    // Attempt to verify active session
    let attempts = 0;
    const maxAttempts = 3;

    const verifySession = async () => {
      try {
        const user = await account.get();
        setStatus("success");
        setMessage(`Welcome back, ${user.name || "User"}! Finalizing…`);

        notifyParent("APPWRITE_OAUTH_SUCCESS", {
          user: {
            $id: user.$id,
            name: user.name,
            email: user.email,
          },
        });

        setTimeout(() => {
          if (window.opener) {
            window.close();
          } else {
            router.push("/");
          }
        }, 500);
      } catch (err: unknown) {
        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(verifySession, 700);
        } else {
          setStatus("error");
          const errText = err instanceof Error ? err.message : "Unable to verify Appwrite session.";
          setMessage(errText);
          notifyParent("APPWRITE_OAUTH_FAILURE", { message: errText });

          setTimeout(() => {
            if (window.opener) {
              window.close();
            } else {
              router.push("/");
            }
          }, 2000);
        }
      }
    };

    verifySession();
  }, [searchParams, router]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#09090B] text-white p-4 font-sans select-none">
      <div className="w-full max-w-sm rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#121215] p-6 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6D1B] via-[#E11D48] to-[#6B5FFF] p-0.5 shadow-lg">
          <div className="h-full w-full rounded-full bg-[#000000] flex items-center justify-center">
            {status === "processing" && (
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            )}
            {status === "success" && (
              <svg className="h-5 w-5 text-[#34D399]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === "error" && (
              <svg className="h-5 w-5 text-[#EF4444]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
          </div>
        </div>

        <h2 className="text-base font-semibold tracking-tight text-white mb-1.5">
          {status === "processing" && "Authenticating…"}
          {status === "success" && "Authentication Successful"}
          {status === "error" && "Authentication Error"}
        </h2>

        <p className="text-xs text-[#A1A1AA] leading-relaxed">
          {message}
        </p>

        <p className="text-[10px] text-[#71717A] mt-4">
          This window will close automatically.
        </p>
      </div>
    </div>
  );
}

export default function OAuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen w-full flex items-center justify-center bg-[#09090B] text-white">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}
