export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Experience {
  company: string;
  role: string;
  duration: string;
  description: string;
}

export interface Education {
  institution: string;
  degree: string;
  year: string;
}

export interface Project {
  name: string;
  description: string;
  technologies: string[];
}

export interface PortfolioData {
  name: string;
  title: string;
  bio: string;
  email: string;
  location?: string;
  socialLinks: { platform: string; url: string }[];
  skills: string[];
  experience: Experience[];
  education: Education[];
  projects?: Project[];
}

export type LayoutType = 'minimal' | 'timeline' | 'grid';
export type ColorTheme = 'indigo' | 'emerald' | 'rose' | 'slate' | 'amber';
export type FontTheme = 'sans' | 'serif' | 'mono';

export interface PortfolioConfig {
  id: string;
  userId: string;
  createdAt: string;
  data: PortfolioData;
  theme: {
    layout: LayoutType;
    color: ColorTheme;
    font: FontTheme;
  };
}
