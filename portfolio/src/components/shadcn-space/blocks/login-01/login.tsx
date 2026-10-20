"use client";

import React, { useState } from "react";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  signInWithEmail,
  signUpWithEmail,
  signInWithGithub,
  signInWithGoogle,
  account,
} from "@/lib/appwrite";

interface LoginFormProps {
  onSuccess: (userName: string) => void;
}

type Mode = "login" | "signup";

const LoginForm = ({ onSuccess }: LoginFormProps) => {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<"github" | "google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const toggleMode = () => {
    setMode((m) => (m === "login" ? "signup" : "login"));
    setError(null);
    setName("");
    setEmail("");
    setPassword("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(name, email, password);
      }
      const user = await account.get();
      onSuccess(user.name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Authentication failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGithub = async () => {
    setError(null);
    setOauthLoading("github");
    try {
      const user = await signInWithGithub();
      onSuccess(user.name);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "GitHub authentication failed.";
      setError(msg);
    } finally {
      setOauthLoading(null);
    }
  };

  const handleGoogle = async () => {
    setError(null);
    setOauthLoading("google");
    try {
      const user = await signInWithGoogle();
      onSuccess(user.name);
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
        <CardHeader className="text-center gap-6 p-0">
          <div className="mx-auto">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-[#FF6D1B] via-[#E11D48] to-[#6B5FFF]">
              <span className="font-mono text-sm font-black text-white">W</span>
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <CardTitle className="text-2xl font-medium text-card-foreground">
              {mode === "login" ? "Welcome back" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-sm text-muted-foreground font-normal">
              {mode === "login"
                ? "Sign in to your account"
                : "Get started for free today"}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <form onSubmit={handleSubmit}>
            <FieldGroup className="gap-6">
              {/* OAuth Buttons */}
              <Field className="grid md:grid-cols-2 md:gap-6 gap-3">
                <Button
                  variant="outline"
                  type="button"
                  onPress={handleGoogle}
                  isDisabled={loading || oauthLoading !== null}
                  className="text-sm font-medium text-card-foreground gap-2 dark:bg-background rounded-lg h-9 shadow-xs cursor-pointer"
                >
                  <img
                    src="https://images.shadcnspace.com/assets/svgs/icon-google.svg"
                    alt="google icon"
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
                  <img
                    src="https://images.shadcnspace.com/assets/svgs/icon-github.svg"
                    alt="github icon"
                    className="dark:hidden h-4 w-4"
                  />
                  <img
                    src="https://images.shadcnspace.com/assets/svgs/icon-github-white.svg"
                    alt="github icon"
                    className="hidden dark:block h-4 w-4"
                  />
                  {oauthLoading === "github" ? "Connecting popup…" : "Sign in with Github"}
                </Button>
              </Field>

              <FieldSeparator className="*:data-[slot=field-separator-content]:bg-card text-sm text-muted-foreground bg-transparent">
                <span className="px-4">or {mode === "login" ? "sign in" : "sign up"} with</span>
              </FieldSeparator>

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
              </div>

              {mode === "login" && (
                <Field orientation="horizontal" className="justify-between">
                  <div className="flex items-center gap-3">
                    <Checkbox defaultSelected className="cursor-pointer">
                      <span className="text-sm text-primary font-normal cursor-pointer">
                        Remember this device
                      </span>
                    </Checkbox>
                  </div>
                  <a
                    href="#"
                    className="text-sm text-card-foreground font-medium text-end"
                  >
                    Forgot password?
                  </a>
                </Field>
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
                      : "Creating account…"
                    : mode === "login"
                    ? "Sign in"
                    : "Create account"}
                </Button>

                <FieldDescription className="text-center text-sm font-normal text-muted-foreground">
                  {mode === "login" ? (
                    <>
                      Don&apos;t have an account?{" "}
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="font-medium text-card-foreground hover:underline cursor-pointer bg-transparent border-0 p-0"
                      >
                        Create an account
                      </button>
                    </>
                  ) : (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={toggleMode}
                        className="font-medium text-card-foreground hover:underline cursor-pointer bg-transparent border-0 p-0"
                      >
                        Sign in
                      </button>
                    </>
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
