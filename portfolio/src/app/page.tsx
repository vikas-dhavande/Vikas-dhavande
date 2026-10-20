import React from "react";
import { cookies } from "next/headers";
import { Navbar } from "@/components/layout/Navbar";
import { IntroHeroSection } from "@/components/layout/IntroHeroSection";
import { HeroSection } from "@/components/layout/HeroSection";
import { LogoCloud } from "@/components/shadcn-space/blocks/logo-cloud-01/logo-cloud";
import { ExperienceSection } from "@/components/layout/ExperienceSection";
import { EducationSection } from "@/components/layout/EducationSection";
import { SkillsSection } from "@/components/layout/SkillsSection";
import { ProjectsSection } from "@/components/layout/ProjectsSection";
import { ResourcesSection } from "@/components/layout/ResourcesSection";
import { SocialMediaSection } from "@/components/layout/SocialMediaSection";
import { Footer } from "@/components/layout/Footer";
import { getPortfolioData } from "@/lib/portfolio-service";

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

  const portfolioData = await getPortfolioData();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[#E11D48]/30">
      <Navbar initialUser={initialUser} initialAvatarSeed={avatarSeedCookie} />
      <main className="flex-1 flex flex-col">
        <IntroHeroSection />
        <HeroSection />
        <LogoCloud />
        <ExperienceSection experiences={portfolioData.experiences} />
        <EducationSection education={portfolioData.education} />
        <SkillsSection categories={portfolioData.skillCategories} />
        <ProjectsSection projects={portfolioData.projects} />
        <ResourcesSection resources={portfolioData.resources} />
        <SocialMediaSection socials={portfolioData.socials} />
      </main>
      <Footer />
    </div>
  );
}
