import React from "react";
import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { HeroSection } from "@/components/layout/HeroSection";
import { LogoCloud } from "@/components/shadcn-space/blocks/logo-cloud-01/logo-cloud";
import { PhotoSection } from "@/components/layout/PhotoSection";
import { FormSection } from "@/components/layout/FormSection";
import { Footer } from "@/components/layout/Footer";

export default async function HomePage() {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get("auth_user")?.value;
  const avatarSeedCookie = cookieStore.get("avatar_seed")?.value ?? null;

  let initialUser = null;
  if (authCookie) {
    try {
      initialUser = JSON.parse(authCookie);
    } catch {
      initialUser = null;
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[#E11D48]/30">
      <Navbar initialUser={initialUser} initialAvatarSeed={avatarSeedCookie} />
      <main className="flex-1 flex flex-col">
        <HeroSection />
        <LogoCloud />
        <PhotoSection />
        <FormSection />
      </main>
      <Footer />
    </div>
  );
}
