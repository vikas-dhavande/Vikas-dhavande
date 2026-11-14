"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
// FieldLabel is used for email/password/name fields above
import { Input } from "@/components/ui/input";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGithub,
  signInWithGoogle,
  account,
} from "@/lib/appwrite";
import { useAuth } from "@/lib/auth-context";

interface LoginFormProps {
  onSuccess: (userName: string) => void;
  onClose?: () => void;
}

type Mode = "login" | "signup" | "forgot";

const LoginForm = ({ onSuccess, onClose }: LoginFormProps) => {
  const { refreshAuth, setUserOptimistic } = useAuth();
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"github" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [rememberDevice, setRememberDevice] = useState(true);

  const toggleMode = (targetMode: Mode) => {
    setMode(targetMode);
    setError(null);
    setNotice(null);
  };

  const handleAuthSuccess = async (authUser: { name?: string; email?: string }) => {
    try {
      const fullUser = await account.get();
      setUserOptimistic(fullUser);
    } catch {
      // Fallback optimistic object
    }
    await refreshAuth();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("appwrite-auth-changed"));
    }
    onSuccess(authUser.name || authUser.email?.split("@")[0] || "Member");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || oauthLoading) return; // Prevent double submit (S-08)

    setError(null);
    setNotice(null);

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    // 1. Validation (S-03, S-05, S-06)
    if (!trimmedEmail) {
      setError("Email address is required.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Please provide a valid email address.");
      return;
    }

    if (trimmedEmail.length > 254) {
      setError("Email address is too long.");
      return;
    }

    // 2. Forgot Password Flow (P-01, P-02)
    if (mode === "forgot") {
      setLoading(true);
      try {
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        await account.createRecovery(trimmedEmail, `${origin}/auth/recovery`);
      } catch {
        // Suppress enumeration errors intentionally (P-01, P-02)
      } finally {
        setNotice(
          "If an account exists for this email, password reset instructions have been dispatched."
        );
        setLoading(false);
      }
      return;
    }

    // 3. Password Validation (S-04, S-05)
    if (!password) {
      setError("Password is required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (mode === "signup") {
      if (!trimmedName) {
        setError("Name is required to create an account.");
        return;
      }
      if (password.toLowerCase() === trimmedEmail) {
        setError("Password cannot match your email address.");
        return;
      }
    }

    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(trimmedEmail, password);
      } else {
        await signUpWithEmail(trimmedName, trimmedEmail, password);
        // Send email verification if supported (S-01)
        const origin = typeof window !== "undefined" ? window.location.origin : "";
        account.createVerification(`${origin}/auth/verify`).catch(() => {});
      }

      const user = await account.get();
      await handleAuthSuccess(user);
    } catch (err: unknown) {
      const rawMsg = err instanceof Error ? err.message : "";
      // Normalize credential error to prevent user enumeration (L-02, L-03)
      if (rawMsg.includes("Invalid credentials") || rawMsg.includes("401")) {
        setError("Invalid email or password. Please verify your credentials and try again.");
      } else if (rawMsg.includes("already exists") || rawMsg.includes("409")) {
        setError("An account with this email address already exists.");
      } else {
        setError(rawMsg || "Authentication failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGithub = async () => {
    if (loading || oauthLoading) return;
    setError(null);
    setNotice(null);
    setOauthLoading("github");
    try {
      const user = await signInWithGithub();
      await handleAuthSuccess(user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "GitHub authentication failed.";
      setError(msg);
    } finally {
      setOauthLoading(null);
    }
  };

  const handleGoogle = async () => {
    if (loading || oauthLoading) return;
    setError(null);
    setNotice(null);
    setOauthLoading("google");
    try {
      const user = await signInWithGoogle();
      await handleAuthSuccess(user);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Google authentication failed.";
      setError(msg);
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <div className="w-full max-w-lg px-4 sm:px-0 mx-auto">
      <Card className="px-6 py-8 sm:p-12 relative gap-6">
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 h-8 w-8 rounded-full border border-border bg-background/50 hover:bg-muted text-muted-foreground hover:text-foreground transition-all flex items-center justify-center cursor-pointer z-10"
            aria-label="Close dialog"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
        <CardHeader className="text-center gap-6 p-0">
          <div className="mx-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6D1B] via-[#E11D48] to-[#6B5FFF]">
              <span className="font-mono text-sm font-black text-white">W</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-medium text-card-foreground">
              {mode === "login"
                ? "Welcome back"
                : mode === "signup"
                ? "Create an account"
                : "Reset your password"}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground font-normal">
              {mode === "login"
                ? "Sign in to your account"
                : mode === "signup"
                ? "Get started for free today"
                : "Enter your registered email to receive a recovery link."}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-6">
              {/* OAuth Buttons (Only on Login & Signup) */}
              {mode !== "forgot" && (
                <>
                  <Field className="grid md:grid-cols-2 md:gap-6 gap-3">
                    <Button
                      variant="outline"
                      type="button"
                      onPress={handleGoogle}
                      isDisabled={loading || oauthLoading !== null}
                      className="text-sm font-medium text-card-foreground gap-2 dark:bg-background rounded-lg h-9 shadow-xs cursor-pointer"
                    >
                      <Image
                        src="/google.svg"
                        alt="Google Logo"
                        width={16}
                        height={16}
                        className="h-4 w-4"
                      />
                      {oauthLoading === "google" ? "Connecting popup…" : "Sign in with Google"}
                    </Button>
                    <Button
                      variant="outline"
                      type="button"
                      onPress={handleGithub}
                      isDisabled={loading || oauthLoading !== null}
                      className="text-sm font-medium text-card-foreground gap-2 dark:bg-background rounded-lg h-9 shadow-xs cursor-pointer"
                    >
                      <Image
                        src="/github.svg"
                        alt="GitHub Logo"
                        width={16}
                        height={16}
                        className="h-4 w-4 dark:invert"
                      />
                      {oauthLoading === "github" ? "Connecting popup…" : "Sign in with Github"}
                    </Button>
                  </Field>

                  <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-sm text-muted-foreground bg-transparent">
                    <span className="px-4">or {mode === "login" ? "sign in" : "sign up"} with</span>
                  </FieldSeparator>
                </>
              )}

              <div className="flex flex-col gap-4">
                {mode === "signup" && (
                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="name"
                      className="text-sm text-muted-foreground font-normal"
                    >
                      Name*
                    </FieldLabel>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your full name"
                      value={name}
                      onChange={(e) => setName((e.target as HTMLInputElement).value)}
                      required
                      className="dark:bg-background h-9 shadow-xs"
                    />
                  </Field>
                )}

                <Field className="gap-1.5">
                  <FieldLabel
                    htmlFor="email"
                    className="text-sm text-muted-foreground font-normal"
                  >
                    Email*
                  </FieldLabel>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail((e.target as HTMLInputElement).value)}
                    required
                    className="dark:bg-background h-9 shadow-xs"
                  />
                </Field>

                {mode !== "forgot" && (
                  <Field className="gap-1.5">
                    <FieldLabel
                      htmlFor="password"
                      className="text-sm text-muted-foreground font-normal"
                    >
                      Password*
                    </FieldLabel>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword((e.target as HTMLInputElement).value)}
                      required
                      className="dark:bg-background h-9 shadow-xs"
                    />
                  </Field>
                )}
              </div>

              {mode === "login" && (
                <div className="flex items-center justify-between text-xs sm:text-sm pt-1">
                  <label className="flex items-center gap-2.5 cursor-pointer select-none group">
                    <input
                      type="checkbox"
                      id="remember-device"
                      name="remember-device"
                      checked={rememberDevice}
                      onChange={(e) => setRememberDevice(e.target.checked)}
                      className="size-4 rounded border border-border bg-background accent-primary text-primary focus:ring-2 focus:ring-primary/50 cursor-pointer transition-all"
                    />
                    <span className="text-muted-foreground group-hover:text-foreground transition-colors cursor-pointer select-none">
                      Remember this device
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => toggleMode("forgot")}
                    className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors font-medium text-end cursor-pointer bg-transparent border-0 p-0"
                  >
                    Forgot password?
                  </button>
                </div>
              )}

              {/* Status Notice */}
              {notice && (
                <div className="text-xs text-emerald-600 dark:text-emerald-400 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-3 leading-relaxed flex items-start gap-2.5 animate-in fade-in">
                  <span className="flex-1 text-left">{notice}</span>
                </div>
              )}

              {/* Error message */}
              {error && (
                <div className="text-xs text-destructive rounded-lg bg-destructive/10 border border-destructive/20 p-3 leading-relaxed flex items-start gap-2.5 animate-in fade-in">
                  <svg className="h-4 w-4 shrink-0 text-destructive mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span className="flex-1 text-left">{error}</span>
                </div>
              )}

              <Field className="gap-4">
                <Button
                  type="submit"
                  size="lg"
                  isDisabled={loading || oauthLoading !== null}
                  className="rounded-lg h-10 hover:bg-primary/80 cursor-pointer w-full"
                >
                  {loading
                    ? mode === "login"
                      ? "Signing in…"
                      : mode === "signup"
                      ? "Creating account…"
                      : "Sending link…"
                    : mode === "login"
                    ? "Sign in"
                    : mode === "signup"
                    ? "Create account"
                    : "Send reset link"}
                </Button>

                <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                  {mode === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={() => toggleMode("signup")}
                        className="font-medium text-card-foreground hover:underline cursor-pointer bg-transparent border-0 p-0"
                      >
                        Create an account
                      </button>
                    </>
                  ) : mode === "signup" ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => toggleMode("login")}
                        className="font-medium text-card-foreground hover:underline cursor-pointer bg-transparent border-0 p-0"
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => toggleMode("login")}
                      className="font-medium text-card-foreground hover:underline cursor-pointer bg-transparent border-0 p-0"
                    >
                      ← Back to Sign in
                    </button>
                  )}
                </FieldDescription>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
