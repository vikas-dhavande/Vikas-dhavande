export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type?: "Full-time" | "Contract" | "Remote" | "Hybrid" | "Freelance" | "Apprentice" | "Trainee";
  description: string;
  highlights: string[];
  technologies: string[];
  link?: string;
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location?: string;
  details?: string;
}

export interface SkillItem {
  name: string;
  level?: string;
  highlight?: boolean;
}

export interface SkillCategory {
  id: string;
  category: string;
  description?: string;
  skills: SkillItem[];
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  year: string;
  category: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured?: boolean;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: "Guide" | "Cheatsheet" | "Tool" | "Article" | "Template" | "Architecture";
  description: string;
  url: string;
  formatBadge?: string;
  tag?: string;
}

export interface SocialItem {
  id: string;
  platform: string;
  handle: string;
  url: string;
  description: string;
  iconName: "github" | "twitter" | "linkedin" | "discord" | "youtube" | "mail";
  isPrimary?: boolean;
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  experiences: ExperienceItem[];
  education: EducationItem[];
  skillCategories: SkillCategory[];
  projects: ProjectItem[];
  resources: ResourceItem[];
  socials: SocialItem[];
}
