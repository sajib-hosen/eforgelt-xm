export type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

export type Competency =
  | "Computer Basics"
  | "Digital Storage"
  | "Security Basics"
  | "Cybersecurity"
  | "Spreadsheets"
  | "Web Development"
  | "Word Processing"
  | "Email Usage"
  | "Online Collaboration"
  | "Search Skills"
  | "Digital Communication"
  | "Problem Solving"
  | "Online Safety"
  | "Data Analysis"
  | "Cloud Tools"
  | "Software Installation"
  | "Device Maintenance"
  | "Media Literacy"
  | "Social Media Management"
  | "Online Learning"
  | "Digital Rights"
  | "Digital Etiquette";

export interface QuizQuestion {
  id: string; // unique identifier
  text: string; // question text
  options: string[]; // 4 options
  // correctAnswer: string; // must match one of the options
  competency: Competency;
  level: Level;
}

export interface AnswerType {
  id: string;
  correctAnswer: string;
}
