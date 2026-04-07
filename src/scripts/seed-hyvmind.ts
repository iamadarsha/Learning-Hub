import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories, resources } from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql);

const seedCategories = [
  { name: "AI & Automation", slug: "ai-automation", color: "#009BFF", description: "AI tools, LLMs, automation workflows" },
  { name: "n8n Workflows", slug: "n8n", color: "#770BFF", description: "n8n automation recipes and templates" },
  { name: "Figma & Design", slug: "figma-design", color: "#4CC3AE", description: "Design systems, Figma tips, UI patterns" },
  { name: "Amazon & eComm", slug: "ecommerce", color: "#FF6B35", description: "Amazon listing optimization, ecommerce strategy" },
  { name: "Pi & KMS", slug: "pi-kms", color: "#009BFF", description: "Pattern Intelligence and knowledge management" },
  { name: "Data & Analytics", slug: "data-analytics", color: "#4CC3AE", description: "Data pipelines, dashboards, reporting" },
  { name: "Prompt Engineering", slug: "prompting", color: "#770BFF", description: "Writing effective prompts for AI tools" },
];

const seedResources = [
  {
    title: "Getting started with Pi — Pattern's AI assistant",
    type: "doc" as const,
    url: "https://docs.google.com/document/d/example-pi-guide",
    description: "A complete beginner's guide to using Pi for your daily work at Pattern.",
    categorySlug: "pi-kms",
  },
  {
    title: "How to build your first n8n workflow",
    type: "tutorial" as const,
    url: "https://docs.google.com/document/d/example-n8n-tutorial",
    description: "Step by step: connect Slack to Google Sheets using n8n.",
    categorySlug: "n8n",
  },
  {
    title: "Bulk image generation with AI tools",
    type: "video" as const,
    url: "https://drive.google.com/file/d/example-video-id/view",
    description: "Generate 50 on-brand product images in under 10 minutes.",
    categorySlug: "ai-automation",
  },
  {
    title: "Figma Variables deep dive",
    type: "video" as const,
    url: "https://drive.google.com/file/d/example-figma-vid/view",
    description: "Master Figma variables for scalable design systems.",
    categorySlug: "figma-design",
  },
  {
    title: "Amazon listing optimisation checklist",
    type: "template" as const,
    url: "https://docs.google.com/spreadsheets/d/example-checklist",
    description: "12-point checklist for optimising Amazon product listings.",
    categorySlug: "ecommerce",
  },
  {
    title: "Writing better prompts for Claude",
    type: "tutorial" as const,
    url: "https://docs.google.com/document/d/example-prompting",
    description: "Techniques for getting better outputs from Claude and other LLMs.",
    categorySlug: "prompting",
  },
  {
    title: "Building dashboards with Looker Studio",
    type: "doc" as const,
    url: "https://docs.google.com/document/d/example-looker",
    description: "How to create real-time dashboards for your team's KPIs.",
    categorySlug: "data-analytics",
  },
];

async function seed() {
  console.log("Seeding Hyvmind categories...");

  const insertedCategories = await db
    .insert(categories)
    .values(seedCategories)
    .onConflictDoNothing()
    .returning();

  console.log(`Inserted ${insertedCategories.length} categories`);

  // Build slug → id map from all categories
  const allCategories = await db.select().from(categories);
  const categoryMap = Object.fromEntries(allCategories.map((c) => [c.slug, c.id]));

  console.log("Seeding resources...");
  for (const resource of seedResources) {
    const { categorySlug, ...rest } = resource;
    await db
      .insert(resources)
      .values({
        ...rest,
        authorId: "seed_user",
        authorName: "Hyvmind Team",
        authorImageUrl: "",
        visibility: "public",
        xpValue: 10,
        categoryId: categoryMap[categorySlug],
      })
      .onConflictDoNothing();
  }

  console.log("Seed complete!");
  process.exit(0);
}

seed().catch(console.error);
