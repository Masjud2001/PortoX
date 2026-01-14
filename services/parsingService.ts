import { PortfolioData, Experience, Education, Project } from "../types";
import * as mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist";

// Fix for imports from esm.sh where default export contains the library
const pdfjs = (pdfjsLib as any).default || pdfjsLib;
const mammothLib = (mammoth as any).default || mammoth;

// Set worker source for PDF.js
// Using cdnjs is often more reliable for worker loading due to CORS/MIME headers
if (pdfjs?.GlobalWorkerOptions) {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
}

const parseResumeFile = async (file: File): Promise<PortfolioData> => {
  let text = "";

  try {
    if (file.type === "application/pdf") {
      text = await extractTextFromPDF(file);
    } else if (
      file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || 
      file.name.endsWith(".docx")
    ) {
      text = await extractTextFromDOCX(file);
    } else {
      text = await file.text();
    }

    // Heuristic Parsing Logic
    return parseTextToData(text);
  } catch (error) {
    console.error("Parsing Error:", error);
    // If it's a specific PDF error, provide a clearer message
    if (error instanceof Error && error.message.includes("worker")) {
       throw new Error("Could not initialize PDF worker. Please try a different browser or file type.");
    }
    throw new Error("Failed to parse file. Please try a different format.");
  }
};

// --- File Extractors ---

const extractTextFromPDF = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  
  // Ensure we are using the resolved pdfjs object
  // Using standard getDocument
  const loadingTask = pdfjs.getDocument({ 
    data: arrayBuffer,
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
    cMapPacked: true,
  });

  const pdf = await loadingTask.promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items.map((item: any) => item.str).join(" ");
    fullText += pageText + "\n";
  }
  return fullText;
};

const extractTextFromDOCX = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  // Use the properly resolved mammoth object
  const result = await mammothLib.extractRawText({ arrayBuffer });
  return result.value;
};

// --- "Smart" Heuristic Parser (Simulates Server Logic) ---

const parseTextToData = (text: string): PortfolioData => {
  // Normalize text
  const cleanText = text.replace(/\r\n/g, "\n");
  const lines = cleanText.split(/\n+/).map(l => l.trim()).filter(l => l.length > 0);
  
  // 1. Basic Details
  const emailMatch = cleanText.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  const email = emailMatch ? emailMatch[0] : "contact@example.com";
  
  // Assuming name is on the first line usually, but exclude common header words
  let name = lines[0]?.substring(0, 30) || "Your Name";
  if (name.toLowerCase().includes("resume") || name.toLowerCase().includes("curriculum")) {
      name = lines[1]?.substring(0, 30) || "Your Name";
  }
  
  // Identify Sections by Keywords
  const sectionIndices: { [key: string]: number } = {};
  const keywords = ["experience", "work history", "employment", "education", "skills", "projects", "summary", "profile", "contact"];
  
  lines.forEach((line, index) => {
    const lower = line.toLowerCase();
    // Check if line is short enough to be a header and contains a keyword
    if (line.length < 50) {
        for (const k of keywords) {
            if (lower.includes(k)) {
                sectionIndices[k] = index;
                break; // Found the section for this line
            }
        }
    }
  });

  // Helper to extract chunks between sections
  const extractSectionLines = (startKeywords: string[], endKeywords: string[]): string[] => {
    let startIndex = -1;
    // Find the first occurrence of any start keyword
    for (const k of startKeywords) {
      if (sectionIndices[k] !== undefined) {
        startIndex = sectionIndices[k];
        break;
      }
    }
    if (startIndex === -1) return [];

    let endIndex = lines.length;
    // Find the earliest next section that appears after the start index
    const allIndices = Object.values(sectionIndices).sort((a, b) => a - b);
    for (const idx of allIndices) {
        if (idx > startIndex) {
            endIndex = idx;
            break;
        }
    }
    
    return lines.slice(startIndex + 1, endIndex);
  };

  // 2. Extract Bio/Summary
  const summaryLines = extractSectionLines(["summary", "profile"], ["experience", "education", "skills"]);
  const bio = summaryLines.length > 0 ? summaryLines.join(" ") : "Professional with a passion for building great products.";

  // 3. Extract Skills
  const skillLines = extractSectionLines(["skills", "technologies"], ["experience", "education"]);
  let skills: string[] = [];
  if (skillLines.length > 0) {
    // Try splitting by commas, bullets, or pipes
    const rawSkills = skillLines.join(",");
    skills = rawSkills.split(/[,•|]/).map(s => s.trim()).filter(s => s.length > 2 && s.length < 30).slice(0, 12);
  } else {
    skills = ["Communication", "Leadership", "Problem Solving"];
  }

  // 4. Extract Experience (Tricky part)
  const expLines = extractSectionLines(["experience", "work history", "employment"], ["education", "skills", "projects"]);
  const experience: Experience[] = [];
  
  // Heuristic: Look for lines with dates
  let currentExp: any = {};
  
  for(let i=0; i<expLines.length; i++) {
     const line = expLines[i];
     const dateRegex = /(19|20)\d{2}|Present|Current/i;
     
     // If we hit a date line, it's likely the start of a new block or the duration line of the current block
     if (dateRegex.test(line)) {
        // If we already have a company/role, save it
        if (currentExp.company || currentExp.role) {
             // Ensure description exists
             currentExp.description = currentExp.description || "Contributed to team success.";
             experience.push(currentExp as Experience);
        }
        
        // Reset
        currentExp = {
            duration: line,
            description: ""
        };

        // Try to guess company/role from previous lines if they exist
        // This is very loose. Often: Company \n Role \n Date OR Role \n Company \n Date
        if (i > 0) {
            currentExp.role = expLines[i-1];
            if (i > 1) {
                currentExp.company = expLines[i-2];
            } else {
                currentExp.company = "Company Name";
            }
        } else {
             // Date is first line?
             currentExp.company = "Company Name";
             currentExp.role = "Role Title";
        }
     } else {
         // Accumulate description if we have a started block
         if (currentExp.duration) {
             currentExp.description = (currentExp.description || "") + " " + line;
         }
     }
  }
  // Push the last one
  if (currentExp.company || currentExp.role) {
       currentExp.description = currentExp.description || "Contributed to team success.";
       // Fill defaults if missing
       currentExp.company = currentExp.company || "Company";
       currentExp.role = currentExp.role || "Professional";
       experience.push(currentExp as Experience);
  }
  
  // Fallback if extraction failed significantly
  if (experience.length === 0) {
    experience.push({
      company: "Previous Company",
      role: "Professional Role",
      duration: "2020 - 2023",
      description: "Contributed to key projects and improved team efficiency."
    });
  }

  // 5. Extract Education
  const eduLines = extractSectionLines(["education"], ["skills", "experience"]);
  const education: Education[] = [];
  // Look for a year
  const eduYear = eduLines.find(l => l.match(/(19|20)\d{2}/));
  if (eduLines.length > 0) {
    education.push({
      institution: eduLines[0] || "University",
      degree: eduLines[1] || "Degree",
      year: eduYear || "20xx"
    });
  } else {
    education.push({ institution: "University", degree: "Bachelor's Degree", year: "2020" });
  }

  return {
    name,
    title: experience[0]?.role || "Professional",
    bio: bio.substring(0, 300),
    email,
    location: "Remote",
    socialLinks: [
      { platform: "LinkedIn", url: "#" },
      { platform: "GitHub", url: "#" }
    ],
    skills,
    experience: experience.slice(0, 4), // Limit to top 4
    education,
    projects: [
      { name: "Portfolio Project", description: "Generated using PortoX automatic parsing.", technologies: ["React", "AI"] }
    ]
  };
};

export const parsingService = {
  parseResumeFile
};