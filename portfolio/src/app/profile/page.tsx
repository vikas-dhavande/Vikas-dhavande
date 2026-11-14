"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Blobatar } from "@blobatar/react";
import { ArrowLeft, Camera, LogOut, ShieldCheck } from "lucide-react";
import { account, storage } from "@/lib/appwrite";
import dynamic from "next/dynamic";
import { clearCookieAction } from "@/app/actions";

const LoginForm = dynamic(
  () => import("@/components/shadcn-space/blocks/login-01/login"),
  {
    loading: () => (
      <div className="h-96 w-full max-w-md mx-auto rounded-xl border border-border bg-card/40 animate-pulse" />
    ),
  }
);
import {
  updateProfileFieldAction,
  uploadProfileImageAction,
} from "@/app/profile/profile-actions";
import { Models } from "appwrite";

type ProfilePreferences = Models.Preferences & {
  profileImageFileId?: string;
};

type ProfileUser = Models.User<ProfilePreferences>;
type ProfileField = "name" | "email" | "phone";

const profileBucketId = process.env.NEXT_PUBLIC_APPWRITE_PROFILE_BUCKET_ID;

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<ProfileUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState("");
  const [saving, setSaving] = useState<ProfileField | "image" | "logout" | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const refreshUser = useCallback(async () => {
    const accountUser = await account.get<ProfilePreferences>();
    setUser(accountUser);
    try {
      localStorage.setItem(
        "auth_user",
        JSON.stringify({
          $id: accountUser.$id,
          name: accountUser.name,
          email: accountUser.email,
        })
      );
      localStorage.setItem("avatar_seed", accountUser.name);
    } catch {
      // The Appwrite session remains authoritative when local storage is unavailable.
    }
    window.dispatchEvent(new Event("appwrite-auth-changed"));
  }, []);

  useEffect(() => {
    let active = true;
    account
      .get<ProfilePreferences>()
      .then(async (accountUser) => {
        if (!active) return;
        setUser(accountUser);
        try {
          localStorage.setItem(
            "auth_user",
            JSON.stringify({
              $id: accountUser.$id,
              name: accountUser.name,
              email: accountUser.email,
            })
          );
          localStorage.setItem("avatar_seed", accountUser.name);
        } catch {
          // The Appwrite session remains authoritative when local storage is unavailable.
        }
        window.dispatchEvent(new Event("appwrite-auth-changed"));
      })
      .catch(() => {
        if (active) setUser(null);
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
      await refreshUser();
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : "Could not load your account.");
    } finally {
      setLoading(false);
    }
  };

  const saveField = async (event: FormEvent<HTMLFormElement>, field: ProfileField) => {
    event.preventDefault();
    if (!user) return;

    const formData = new FormData(event.currentTarget);
    const value = String(formData.get(field) ?? "");
    if (value.trim() === String(user[field] ?? "")) {
      setNotice("There are no changes to save.");
      return;
    }

    setError("");
    setNotice("");
    setSaving(field);
    try {
      const { jwt } = await account.createJWT();
      await updateProfileFieldAction(jwt, field, value, password);
      await refreshUser();
      setPassword("");
      setNotice(`${field === "name" ? "Name" : field === "email" ? "Email" : "Phone number"} updated.`);
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not update your profile.");
    } finally {
      setSaving(null);
    }
  };

  const saveImage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!selectedImage) {
      setError("Choose an image to upload.");
      return;
    }

    setError("");
    setNotice("");
    setSaving("image");
    try {
      const { jwt } = await account.createJWT();
      const formData = new FormData();
      formData.set("jwt", jwt);
      formData.set("image", selectedImage);
      await uploadProfileImageAction(formData);
      await refreshUser();
      setSelectedImage(null);
      setNotice("Profile image updated.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Could not upload your image.");
    } finally {
      setSaving(null);
    }
  };

  const handleLogout = async () => {
    setError("");
    setSaving("logout");
    try {
      await account.deleteSession("current");
      try {
        localStorage.removeItem("auth_user");
        localStorage.removeItem("avatar_seed");
      } catch {
        // Continue clearing the non-authentication display cookies.
      }
      await clearCookieAction("auth_user");
      await clearCookieAction("avatar_seed");
      setUser(null);
      window.dispatchEvent(new Event("appwrite-auth-changed"));
      router.push("/");
    } catch (logoutError) {
      setError(logoutError instanceof Error ? logoutError.message : "Could not sign out.");
      setSaving(null);
    }
  };

  const profileImageUrl =
    profileBucketId && user?.prefs.profileImageFileId
      ? storage.getFileView(profileBucketId, user.prefs.profileImageFileId)
      : null;

  return (
    <div className="relative flex min-h-screen flex-col justify-between bg-background font-sans text-foreground transition-colors duration-300">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(225,29,72,0.12),rgba(255,255,255,0))]" />
      <header className="relative z-10 w-full border-b border-border bg-background/80 px-4 py-4 backdrop-blur-xl sm:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Portfolio
          </Link>
          <span className="text-xs font-mono text-muted-foreground">Account Profile</span>
        </div>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-4xl flex-1 items-center px-4 py-10 sm:py-16">
        <section className="relative w-full overflow-hidden rounded-2xl border border-border bg-card/90 p-6 shadow-2xl backdrop-blur-2xl sm:p-10">
          <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-80" />

          {loading ? (
            <div className="flex flex-col items-center gap-4 py-16" role="status">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-border border-t-primary" />
              <p className="text-sm text-muted-foreground">Checking your Appwrite session…</p>
            </div>
          ) : !user ? (
            <div className="mx-auto max-w-xl py-6 text-center">
              <h1 className="mb-2 text-2xl font-bold tracking-tight">Sign in to view your profile</h1>
              <p className="mb-8 text-sm text-muted-foreground">
                Your account details are available after you sign in.
              </p>
              {error && (
                <p className="mb-5 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              <LoginForm onSuccess={handleLoginSuccess} />
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex flex-col justify-between gap-6 border-b border-border pb-7 sm:flex-row sm:items-center">
                <div className="flex items-center gap-5">
                  <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-border bg-muted p-1">
                    {profileImageUrl ? (
                      // Public profile avatars are intentionally readable without a session.
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={profileImageUrl} alt={`${user.name}'s profile`} className="h-full w-full rounded-xl object-cover" />
                    ) : (
                      <Blobatar
                        name={user.name || user.email}
                        animate="hover"
                        style={{ width: "100%", height: "100%", borderRadius: "12px" }}
                      />
                    )}
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{user.name || "Your profile"}</h1>
                      <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs text-emerald-500">
                        <ShieldCheck className="h-3 w-3" />
                        Signed in
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={saving !== null}
                  className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-2 text-sm font-semibold text-destructive transition-colors hover:bg-destructive/20 disabled:opacity-50"
                >
                  <LogOut className="h-4 w-4" />
                  {saving === "logout" ? "Signing out…" : "Sign out"}
                </button>
              </div>

              {error && (
                <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive" role="alert">
                  {error}
                </p>
              )}
              {notice && (
                <p className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-3 text-sm text-emerald-600" role="status">
                  {notice}
                </p>
              )}

              <form onSubmit={(event) => saveField(event, "name")} className="space-y-4">
                <h2 className="text-lg font-semibold">Personal information</h2>
                <label htmlFor="profile-name" className="block text-sm font-medium">
                  Name
                </label>
                <input
                  id="profile-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={128}
                  required
                  defaultValue={user.name}
                  key={`name-${user.name}`}
                  className="min-h-12 w-full rounded-lg border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
                <button
                  type="submit"
                  disabled={saving !== null}
                  className="min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {saving === "name" ? "Saving…" : "Save name"}
                </button>
              </form>

              <div className="grid gap-8 border-t border-border pt-7 md:grid-cols-2">
                {(["email", "phone"] as const).map((field) => (
                  <form key={field} onSubmit={(event) => saveField(event, field)} className="space-y-4">
                    <h2 className="text-lg font-semibold">{field === "email" ? "Email address" : "Phone number"}</h2>
                    <label htmlFor={`profile-${field}`} className="block text-sm font-medium">
                      {field === "email" ? "Email" : "Phone"}
                    </label>
                    <input
                      id={`profile-${field}`}
                      name={field}
                      type={field === "email" ? "email" : "tel"}
                      autoComplete={field === "email" ? "email" : "tel"}
                      required
                      defaultValue={user[field] ?? ""}
                      key={`${field}-${user[field] ?? ""}`}
                      placeholder={field === "phone" ? "+1 555 123 4567" : undefined}
                      className="min-h-12 w-full rounded-lg border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <label htmlFor={`profile-${field}-password`} className="block text-sm font-medium">
                      Current password
                    </label>
                    <input
                      id={`profile-${field}-password`}
                      type="password"
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                      className="min-h-12 w-full rounded-lg border border-input bg-background px-3 text-base outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    />
                    <button
                      type="submit"
                      disabled={saving !== null}
                      className="min-h-11 rounded-lg border border-border px-5 text-sm font-semibold hover:bg-muted disabled:opacity-50"
                    >
                      {saving === field ? "Saving…" : `Save ${field}`}
                    </button>
                  </form>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Appwrite asks for your current password before changing email or phone. Phone numbers
                should include the country code; email and phone verification may be required.
              </p>

              <form onSubmit={saveImage} className="space-y-4 border-t border-border pt-7">
                <h2 className="text-lg font-semibold">Profile image</h2>
                <label htmlFor="profile-image" className="block text-sm font-medium">
                  Choose a JPG, PNG, or WebP image (up to 4 MB)
                </label>
                <input
                  id="profile-image"
                  name="image"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  required
                  disabled={!profileBucketId || saving !== null}
                  onChange={(event) => setSelectedImage(event.target.files?.[0] ?? null)}
                  className="block min-h-12 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-muted file:px-3 file:py-2 file:text-sm file:font-medium"
                />
                {!profileBucketId && (
                  <p className="text-sm text-muted-foreground">
                    Image uploads are unavailable until an Appwrite profile storage bucket is configured.
                  </p>
                )}
                <button
                  type="submit"
                  disabled={!profileBucketId || !selectedImage || saving !== null}
                  className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border px-5 text-sm font-semibold hover:bg-muted disabled:opacity-50"
                >
                  <Camera className="h-4 w-4" />
                  {saving === "image" ? "Uploading…" : "Upload image"}
                </button>
              </form>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
