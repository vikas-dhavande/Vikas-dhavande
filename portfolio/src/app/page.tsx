import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { IntroHeroSection } from "@/components/layout/IntroHeroSection";
import { HeroSection } from "@/components/layout/HeroSection";
import { LogoCloud } from "@/components/shadcn-space/blocks/logo-cloud-01/logo-cloud";
import { ExperienceSection } from "@/components/layout/ExperienceSection";
import { EducationSection } from "@/components/layout/EducationSection";
import { SkillsSection } from "@/components/layout/SkillsSection";
import { ProjectsSection } from "@/components/layout/ProjectsSection";
import { ResourcesSection } from "@/components/layout/ResourcesSection";
import { BlogPreviewSection } from "@/components/layout/BlogPreviewSection";
import { SocialMediaSection } from "@/components/layout/SocialMediaSection";
import { Footer } from "@/components/layout/Footer";
import { getPortfolioData } from "@/lib/portfolio-service";

// Enable Incremental Static Regeneration (ISR) for fast edge caching
export const revalidate = 3600;

export default async function HomePage() {
  const portfolioData = await getPortfolioData();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[#E11D48]/30">
      <Navbar />
      <main className="flex-1 flex flex-col">
        <IntroHeroSection />
        <HeroSection />
        <LogoCloud />
        <ExperienceSection experiences={portfolioData.experiences} />
        <EducationSection education={portfolioData.education} />
        <SkillsSection categories={portfolioData.skillCategories} />
        <ProjectsSection projects={portfolioData.projects} />
        <ResourcesSection resources={portfolioData.resources} />
        <BlogPreviewSection />
        <SocialMediaSection socials={portfolioData.socials} />
      </main>
      <Footer />
    </div>
  );
}
