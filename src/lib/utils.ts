import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export const locales = ["en", "vi"];
export const defaultLocale = "en";
export const languages = [
  { name: "JavaScript", slug: "javascript", icon: "js" },
  { name: "TypeScript", slug: "typescript", icon: "ts" },
  { name: "Python", slug: "python", icon: "py" },
  { name: "Java", slug: "java", icon: "java" },
  { name: "C++", slug: "cpp", icon: "cpp" },
  { name: "C#", slug: "csharp", icon: "csharp" },
  { name: "Go", slug: "go", icon: "go" },
  { name: "Rust", slug: "rust", icon: "rust" },
  { name: "PHP", slug: "php", icon: "php" },
  { name: "Ruby", slug: "ruby", icon: "ruby" },
  { name: "Swift", slug: "swift", icon: "swift" },
  { name: "Kotlin", slug: "kotlin", icon: "kotlin" },
  { name: "Scala", slug: "scala", icon: "scala" },
  { name: "Dart", slug: "dart", icon: "dart" },
  { name: "SQL", slug: "sql", icon: "sql" },
  { name: "HTML", slug: "html", icon: "html" },
  { name: "CSS", slug: "css", icon: "css" },
  { name: "Bash", slug: "bash", icon: "bash" },
  { name: "R", slug: "r", icon: "r" },
  { name: "MATLAB", slug: "matlab", icon: "matlab" },
];

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function detectLocale(path: string, locales: string[], defaultLocale: string) {
  const found = locales.find((l) => path.startsWith(`/${l}`));
  return found || defaultLocale;
}
