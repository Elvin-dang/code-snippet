import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding languages...");

  const languages = [
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

  for (const lang of languages) {
    await prisma.language.upsert({
      where: { slug: lang.slug },
      update: {},
      create: lang,
    });
  }

  console.log(`✅ Seeded ${languages.length} languages successfully!`);
}

main()
  .catch((e) => {
    console.error("❌ Error seeding languages:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
