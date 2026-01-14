import { PortfolioData } from "../types";

const parseResumeText = async (text: string): Promise<PortfolioData> => {
  // Simulate network delay for realistic feel
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Basic Heuristic Extraction from text (Mocking the AI)
  const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
  const name = lines[0] || "Your Name";
  
  // Try to find an email using regex
  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/;
  const emailMatch = text.match(emailRegex);
  const email = emailMatch ? emailMatch[0] : "contact@example.com";

  // Return Mock Data Structure
  // In a real app with an API Key, the AI would fill this based on the specific text.
  return {
    name: name,
    title: "Software Engineer & Designer",
    bio: "This portfolio was generated in 'Demo Mode' without an API Key. Uploaded content is processed locally to extract basic details like name and email.",
    email: email,
    location: "Remote / Worldwide",
    socialLinks: [
      { platform: "LinkedIn", url: "https://linkedin.com" },
      { platform: "GitHub", url: "https://github.com" },
      { platform: "Twitter", url: "https://twitter.com" }
    ],
    skills: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Product Design", "UI/UX"],
    experience: [
      {
        company: "Tech Corp",
        role: "Senior Developer",
        duration: "2022 - Present",
        description: "Leading the frontend team to build scalable web applications. Improved site performance by 40% and implemented a new design system."
      },
      {
        company: "Startup Inc",
        role: "Full Stack Engineer",
        duration: "2019 - 2022",
        description: "Developed and launched multiple features for the core product. Collaborated closely with design and product teams."
      }
    ],
    education: [
      {
        institution: "University of Technology",
        degree: "B.S. Computer Science",
        year: "2019"
      }
    ],
    projects: [
      {
        name: "E-commerce Dashboard",
        description: "A comprehensive analytics dashboard for online retailers.",
        technologies: ["React", "D3.js", "Firebase"]
      },
      {
        name: "Task Manager App",
        description: "Productivity application with real-time collaboration features.",
        technologies: ["Vue.js", "Socket.io", "Express"]
      }
    ]
  };
};

export const geminiService = {
  parseResumeText,
};