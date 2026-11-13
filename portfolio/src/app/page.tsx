import React from "react";
import dynamic from "next/dynamic";
import { IntroHeroSection } from "@/components/layout/IntroHeroSection";
import { HeroSection } from "@/components/layout/HeroSection";
import { LogoCloud } from "@/components/shadcn-space/blocks/logo-cloud-01/logo-cloud";
import { getPortfolioData } from "@/lib/portfolio-service";

// Below-the-fold sections lazy-loaded to optimize initial page load & First Contentful Paint (FCP)
const ExperienceSection = dynamic(
  () => import("@/components/layout/ExperienceSection").then((mod) => mod.ExperienceSection),
  { loading: () => <div className="min-h-[400px] w-full animate-pulse bg-muted/10" /> }
);
const EducationSection = dynamic(
  () => import("@/components/layout/EducationSection").then((mod) => mod.EducationSection),
  { loading: () => <div className="min-h-[300px] w-full animate-pulse bg-muted/10" /> }
);
const CertificatesSection = dynamic(
  () => import("@/components/layout/CertificatesSection").then((mod) => mod.CertificatesSection),
  { loading: () => <div className="min-h-[300px] w-full animate-pulse bg-muted/10" /> }
);
const SkillsSection = dynamic(
  () => import("@/components/layout/SkillsSection").then((mod) => mod.SkillsSection),
  { loading: () => <div className="min-h-[400px] w-full animate-pulse bg-muted/10" /> }
);
const ProjectsSection = dynamic(
  () => import("@/components/layout/ProjectsSection").then((mod) => mod.ProjectsSection),
  { loading: () => <div className="min-h-[400px] w-full animate-pulse bg-muted/10" /> }
);
const ResourcesSection = dynamic(
  () => import("@/components/layout/ResourcesSection").then((mod) => mod.ResourcesSection),
  { loading: () => <div className="min-h-[300px] w-full animate-pulse bg-muted/10" /> }
);
const BlogPreviewSection = dynamic(
  () => import("@/components/layout/BlogPreviewSection").then((mod) => mod.BlogPreviewSection),
  { loading: () => <div className="min-h-[300px] w-full animate-pulse bg-muted/10" /> }
);
const SocialMediaSection = dynamic(
  () => import("@/components/layout/SocialMediaSection").then((mod) => mod.SocialMediaSection),
  { loading: () => <div className="min-h-[200px] w-full animate-pulse bg-muted/10" /> }
);
const Footer = dynamic(
  () => import("@/components/layout/Footer").then((mod) => mod.Footer),
  { loading: () => <div className="min-h-[120px] w-full bg-background" /> }
);

// Enable Incremental Static Regeneration (ISR) for fast edge caching
export const revalidate = 3600;

export default async function HomePage() {
  const portfolioData = await getPortfolioData();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-sans selection:bg-[#E11D48]/30">
      <main className="flex-1 flex flex-col">
        <IntroHeroSection />
        <HeroSection />
        <LogoCloud />
        <ExperienceSection experiences={portfolioData.experiences} />
        <EducationSection education={portfolioData.education} />
        <CertificatesSection certificates={portfolioData.certificates} />
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
