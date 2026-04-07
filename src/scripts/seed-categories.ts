import { db } from "@/db";
import { categories } from "@/db/schema";

const seedCategories = [
  { name: "AI & Automation", slug: "ai-automation", color: "#009BFF", description: "AI tools, LLMs, automation workflows" },
  { name: "n8n Workflows", slug: "n8n", color: "#770BFF", description: "n8n automation recipes and templates" },
  { name: "Figma & Design", slug: "figma-design", color: "#4CC3AE", description: "Design systems, Figma tips, UI patterns" },
  { name: "Amazon & eComm", slug: "ecommerce", color: "#FF6B35", description: "Amazon listing optimization, ecommerce strategy" },
  { name: "Pi & KMS", slug: "pi-kms", color: "#009BFF", description: "Pattern Intelligence and knowledge management" },
  { name: "Data & Analytics", slug: "data-analytics", color: "#4CC3AE", description: "Data pipelines, dashboards, reporting" },
  { name: "Prompt Engineering", slug: "prompting", color: "#770BFF", description: "Writing effective prompts for AI tools" },
];

async function main() {
  console.log("Seeding Hyvmind categories...");
  try {
    const values = seedCategories.map((cat) => ({
      name: cat.name,
      slug: cat.slug,
      color: cat.color,
      description: cat.description,
    }));
    await db.insert(categories).values(values);
    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
    process.exit(1);
  }
}

main();
