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

  let initialUser = null;
  if (authCookie) {
    try {
      initialUser = JSON.parse(authCookie);
    } catch {
      initialUser = null;
    }
  }

  return (
    <div className="min-h-screen bg-[#000000] text-[#F4F4F5] flex flex-col font-sans selection:bg-[#E11D48]/30">
      {/* 1. Header Section with Conditional User Auth */}
      <Navbar initialUser={initialUser} />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col">
        {/* 2. Modern Animated Hero Section */}
        <HeroSection />

        {/* 2.5. Logo Cloud Marquee Section */}
        <LogoCloud />

        {/* 3. Photo / Media Showcase Section */}
        <PhotoSection />

        {/* 4. Placeholder Form Section */}
        <FormSection />
      </main>

      {/* 5. Footer Section */}
      <Footer />
    </div>
  );
}
